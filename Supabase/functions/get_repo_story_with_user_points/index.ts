import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { repo_url } = await req.json();

    if (!repo_url) {
      return new Response(
        JSON.stringify({ error: "repo_url is required" }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    // Get the AI-generated story from repos table
    const { data: repoData, error: repoError } = await supabase
      .from("repos")
      .select("story, commit_history, code_summary, main_language, owner, repo_name")
      .eq("repo_url", repo_url)
      .single();

    if (repoError && repoError.code !== 'PGRST116') { // PGRST116 is "not found"
      return new Response(
        JSON.stringify({ error: repoError.message }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    // Get user-added story points
    const { data: storyPoints, error: storyPointsError } = await supabase
      .from("story_points")
      .select(`
        *,
        user_id,
        created_at
      `)
      .eq("repo_url", repo_url)
      .order("created_at", { ascending: true });

    if (storyPointsError) {
      return new Response(
        JSON.stringify({ error: storyPointsError.message }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    // Combine the data
    const fullStory = {
      repo_info: repoData || null,
      user_story_points: storyPoints || [],
      total_story_points: storyPoints?.length || 0
    };

    return new Response(
      JSON.stringify(fullStory), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}); 