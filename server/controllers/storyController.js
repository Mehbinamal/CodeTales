import dotenv from 'dotenv';

dotenv.config();

// Types for our data structures
const extractRepoInfo = (url) => {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error('Invalid GitHub URL');
  }
  return { owner: match[1], repo: match[2] };
};

const fetchGitHubData = async (owner, repo) => {
  const baseUrl = 'https://api.github.com';
  
  // Fetch repository data
  const repoResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}`);
  if (!repoResponse.ok) {
    throw new Error('Repository not found or is private');
  }
  const repoData = await repoResponse.json();
  
  // Fetch commits
  const commitsResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/commits?per_page=100`);
  const commits = commitsResponse.ok ? await commitsResponse.json() : [];
  
  // Fetch contributors
  const contributorsResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/contributors`);
  const contributors = contributorsResponse.ok ? await contributorsResponse.json() : [];
  
  return { repoData, commits, contributors };
};

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client with your API key from the .env file
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Check if Gemini is available
const isGeminiAvailable = () => {
  console.log('🔍 Debug: All environment variables:', Object.keys(process.env).filter(key => key.includes('API') || key.includes('GOOGLE') || key.includes('GEMINI')));
  
  const apiKey = process.env.GOOGLE_API_KEY;
  console.log('🔍 Debug: GOOGLE_API_KEY exists:', !!apiKey);
  console.log('🔍 Debug: GOOGLE_API_KEY length:', apiKey ? apiKey.length : 0);
  console.log('🔍 Debug: GOOGLE_API_KEY starts with:', apiKey ? apiKey.substring(0, 10) : 'N/A');
  
  if (!apiKey) {
    console.warn('⚠️ GOOGLE_API_KEY not found in environment variables. Gemini AI will not be available.');
    return false;
  }
  
  if (apiKey === 'your_gemini_api_key_here' || apiKey.includes('your_')) {
    console.warn('⚠️ GOOGLE_API_KEY is still set to placeholder value. Please set your actual API key.');
    return false;
  }
  
  console.log('✅ Gemini AI is available and configured!');
  return true;
};

const generateNarrative = async (repository, insights, personalExperience = null) => {
  // Check if Gemini is available
  if (!isGeminiAvailable()) {
    console.log('Using fallback narrative generation');
    return generateFallbackNarrative(repository, insights, personalExperience);
  }

  // Compose a creative prompt for Gemini
  let prompt = `
  You are a masterful storyteller with a deep understanding of the developer community and open-source culture. Craft an inspiring, emotionally resonant narrative about a GitHub open-source project, using the following details:
  
  - **Project Name:** ${repository.name}  
  - **Owner:** ${repository.owner}  
  - **Primary Language:** ${repository.language}  
  - **Stars:** ${repository.stars.toLocaleString()}  
  - **Forks:** ${repository.forks.toLocaleString()}  
  - **Active for:** ${insights.activeMonths} months  
  - **Contributors:** ${insights.contributors}  
  - **Total Commits:** ${insights.totalCommits.toLocaleString()}
  `;

  if (personalExperience) {
    prompt += `
  
  **Personal Experience:** ${personalExperience}
  
  Now, rewrite the story to incorporate this personal experience. Make it feel like a personal journey where the user's experience with this project is woven into the narrative. The story should reflect their unique perspective and connection to the project while maintaining the factual information about the repository.
  `;
  } else {
    prompt += `
  
  Tell the story of how this project came to life — the challenges it aimed to solve, the spark of the first commit, and how it grew into a thriving community effort. Highlight the passion of its contributors, the milestones reached, and the impact it's made on the broader tech world. 
  
  Make it human, heartfelt, and motivating — as if you're speaking to a room full of aspiring developers looking for something meaningful to be part of.
  `;
  }

  prompt += `
  
  **Length:** 150–250 words  
  **Tone:** Inspirational, personal, community-driven  
  **Goal:** To emotionally connect readers with the project and encourage appreciation or contribution.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const story = response.text();
    return story;
  } catch (error) {
    console.error("Error generating narrative with Gemini:", error);
    return generateFallbackNarrative(repository, insights, personalExperience);
  }
};

const generateFallbackNarrative = (repository, insights, personalExperience = null) => {
  let narrative = `The story of ${repository.name} is one of collaboration and innovation. Created by ${repository.owner}, this ${repository.language} project has earned ${repository.stars.toLocaleString()} stars and ${repository.forks.toLocaleString()} forks, thanks to ${insights.contributors} contributors and ${insights.totalCommits.toLocaleString()} commits over ${insights.activeMonths} months. This project represents the power of open source development and the amazing things that can happen when developers come together to build something meaningful.`;
  
  if (personalExperience) {
    narrative += `\n\n${personalExperience}`;
  }
  
  return narrative;
};

const processTimeline = (commits) => {
  const timeline = [];
  
  if (commits.length > 0) {
    // First commit
    const firstCommit = commits[commits.length - 1];
    timeline.push({
      sha: firstCommit.sha.substring(0, 7),
      message: firstCommit.commit.message.split('\n')[0],
      date: firstCommit.commit.author.date,
      author: firstCommit.commit.author.name
    });
    
    // Some middle commits
    const middleCount = Math.min(3, commits.length - 2);
    const step = Math.floor((commits.length - 2) / middleCount);
    
    for (let i = 1; i <= middleCount; i++) {
      const commit = commits[commits.length - 1 - (i * step)];
      timeline.push({
        sha: commit.sha.substring(0, 7),
        message: commit.commit.message.split('\n')[0],
        date: commit.commit.author.date,
        author: commit.commit.author.name
      });
    }
    
    // Latest commit
    if (commits.length > 1) {
      const latestCommit = commits[0];
      timeline.push({
        sha: latestCommit.sha.substring(0, 7),
        message: latestCommit.commit.message.split('\n')[0],
        date: latestCommit.commit.author.date,
        author: latestCommit.commit.author.name
      });
    }
  }
  
  return timeline.reverse(); // Show chronological order
};

// Controller methods
export const generateStory = async (req, res) => {
  try {
    const { repoUrl } = req.body;
    
    if (!repoUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Repository URL is required' 
      });
    }

    const { owner, repo } = extractRepoInfo(repoUrl);
    const { repoData, commits, contributors } = await fetchGitHubData(owner, repo);

    const repository = {
      name: repoData.name,
      owner: repoData.owner.login,
      description: repoData.description || '',
      language: repoData.language || 'Unknown',
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at,
      url: repoData.html_url
    };

    const timeline = processTimeline(commits);
    
    const createdDate = new Date(repository.createdAt);
    const updatedDate = new Date(repository.updatedAt);
    const activeMonths = Math.ceil((updatedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

    const insights = {
      totalCommits: commits.length,
      contributors: contributors.length,
      activeMonths: Math.max(1, activeMonths)
    };

    const narrative = await generateNarrative(repository, insights);

    const story = {
      repository,
      timeline,
      narrative,
      insights
    };

    res.json({ success: true, data: story });

  } catch (error) {
    console.error('Error generating story:', error);
    
    res.status(500).json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred'
    });
  }
};

export const rewriteStoryWithExperience = async (req, res) => {
  try {
    const { repoUrl, personalExperience } = req.body;
    
    if (!repoUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Repository URL is required' 
      });
    }

    if (!personalExperience) {
      return res.status(400).json({ 
        success: false, 
        error: 'Personal experience is required' 
      });
    }

    const { owner, repo } = extractRepoInfo(repoUrl);
    const { repoData, commits, contributors } = await fetchGitHubData(owner, repo);

    const repository = {
      name: repoData.name,
      owner: repoData.owner.login,
      description: repoData.description || '',
      language: repoData.language || 'Unknown',
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at,
      url: repoData.html_url
    };

    const timeline = processTimeline(commits);
    
    const createdDate = new Date(repository.createdAt);
    const updatedDate = new Date(repository.updatedAt);
    const activeMonths = Math.ceil((updatedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

    const insights = {
      totalCommits: commits.length,
      contributors: contributors.length,
      activeMonths: Math.max(1, activeMonths)
    };

    // Generate new narrative with personal experience
    const narrative = await generateNarrative(repository, insights, personalExperience);

    const story = {
      repository,
      timeline,
      narrative,
      insights
    };

    res.json({ success: true, data: story });

  } catch (error) {
    console.error('Error rewriting story:', error);
    
    res.status(500).json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred'
    });
  }
};

export const healthCheck = (req, res) => {
  res.json({ status: 'OK', message: 'CodeTales API is running' });
}; 