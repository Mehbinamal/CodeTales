import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    // Parse the incoming body
    const { repo_url } = await req.json();

    if (!repo_url || !repo_url.startsWith("https://github.com/")) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing GitHub repo URL" }),
        { status: 400 }
      );
    }

    // Extract owner and repo name
    const [owner, repo] = repo_url.replace("https://github.com/", "").split("/");

    if (!owner || !repo) {
      return new Response(JSON.stringify({ error: "Invalid GitHub URL format" }), {
        status: 400,
      });
    }

    // Call GitHub API to fetch commit history
    const githubRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits`,
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("GITHUB_TOKEN")}`,
          "User-Agent": "CodeTales-App",
        },
      }
    );

    // Parse GitHub response
    const data = await githubRes.json();

    // Check for errors or non-array response
    if (!Array.isArray(data)) {
      return new Response(
        JSON.stringify({
          error: "Unexpected response from GitHub",
          details: data,
        }),
        { status: 500 }
      );
    }

    // Extract meaningful commit messages
    const messages = data
      .map((commit: any) => commit?.commit?.message)
      .filter((msg: string | undefined) => msg && msg.length > 5);

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "No valid commit messages found" }), {
        status: 404,
      });
    }

    // Simple project story generation logic (you can improve later)
    const story = `
This project has ${messages.length} visible commits.
It began with: "${messages[messages.length - 1]}".
Notable recent work: "${messages[0]}".

Here are a few commits that shaped the journey:
- ${messages.slice(0, 3).join("\n- ")}
`;

    return new Response(JSON.stringify({ story: story.trim() }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
});
