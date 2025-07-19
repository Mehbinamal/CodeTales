import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const githubToken = Deno.env.get('GITHUB_TOKEN');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { repo_url } = await req.json();
    
    if (!repo_url) {
      return new Response(JSON.stringify({ error: 'Repository URL is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract owner and repo from URL
    const urlParts = repo_url.replace('https://github.com/', '').split('/');
    const owner = urlParts[0];
    const repo = urlParts[1];

    if (!owner || !repo) {
      return new Response(JSON.stringify({ error: 'Invalid GitHub URL format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetching data for ${owner}/${repo}`);

    // Fetch repository metadata
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: githubToken ? { 'Authorization': `token ${githubToken}` } : {},
    });

    if (!repoResponse.ok) {
      return new Response(JSON.stringify({ error: 'Repository not found or not accessible' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const repoData = await repoResponse.json();

    // Fetch commit history (last 20 commits)
    const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=20`, {
      headers: githubToken ? { 'Authorization': `token ${githubToken}` } : {},
    });

    const commits = commitsResponse.ok ? await commitsResponse.json() : [];

    // Fetch languages
    const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
      headers: githubToken ? { 'Authorization': `token ${githubToken}` } : {},
    });

    const languages = languagesResponse.ok ? await languagesResponse.json() : {};
    const mainLanguage = Object.keys(languages)[0] || 'Unknown';

    // Prepare data for AI story generation
    const commitSummary = commits.slice(0, 10).map((commit: any) => ({
      message: commit.commit.message,
      date: commit.commit.author.date,
      author: commit.commit.author.name,
    }));

    const prompt = `Generate a compelling project story for the GitHub repository "${repo}" by "${owner}".

Repository Info:
- Name: ${repoData.name}
- Description: ${repoData.description || 'No description'}
- Main Language: ${mainLanguage}
- Stars: ${repoData.stargazers_count}
- Created: ${repoData.created_at}
- Last Updated: ${repoData.updated_at}

Recent Commits:
${commitSummary.map(c => `- ${c.message} (by ${c.author})`).join('\n')}

Please write:
1. A compelling story about this project's journey (2-3 paragraphs)
2. A technical code summary highlighting key aspects (1-2 paragraphs)

Make it engaging and tell the story of the project's evolution. Focus on what makes this repository special.`;

    // Generate story with AI
    let story = "This repository represents a journey of development and innovation...";
    let codeSummary = "The codebase demonstrates solid engineering practices...";

    if (openAIApiKey) {
      try {
        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are a technical storyteller who creates engaging narratives about software projects.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 1000,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const generatedContent = aiData.choices[0].message.content;
          
          // Split the response into story and code summary
          const sections = generatedContent.split('\n\n');
          story = sections.slice(0, 2).join('\n\n');
          codeSummary = sections.slice(2).join('\n\n') || codeSummary;
        }
      } catch (aiError) {
        console.error('AI generation error:', aiError);
        // Continue with fallback content
      }
    }

    // Return structured response
    const response = {
      repo_name: repoData.name,
      owner: repoData.owner.login,
      story: story,
      main_language: mainLanguage,
      code_summary: codeSummary,
      commit_history: commitSummary,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate_story_from_repo function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});