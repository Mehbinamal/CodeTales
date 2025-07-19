import { ApiResponse } from '../types';

// API base URL - use localhost for development
const API_BASE_URL = 'http://localhost:3001';

// Utility function to validate and parse GitHub repository URLs
export const parseGitHubUrl = (url: string): { username: string; repo: string } | null => {
  try {
    // Handle both full URLs and username/repo format
    let cleanUrl = url.trim();
    
    // If it's already in username/repo format, construct the full URL
    if (!cleanUrl.includes('github.com') && !cleanUrl.includes('http')) {
      cleanUrl = `https://github.com/${cleanUrl}`;
    }
    
    // Remove trailing slash if present
    cleanUrl = cleanUrl.replace(/\/$/, '');
    
    // Extract username and repo from GitHub URL
    const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    
    if (match) {
      return {
        username: match[1],
        repo: match[2]
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing GitHub URL:', error);
    return null;
  }
};

// Utility function to validate if a string looks like a GitHub repository
export const isValidGitHubRepo = (input: string): boolean => {
  const parsed = parseGitHubUrl(input);
  return parsed !== null;
};

export const generateStory = async (repoUrl: string): Promise<ApiResponse> => {
  try {
    const apiUrl = `${API_BASE_URL}/api/generate-story`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ repoUrl }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating story:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};

export const rewriteStoryWithExperience = async (repoUrl: string, personalExperience: string): Promise<ApiResponse> => {
  try {
    const apiUrl = `${API_BASE_URL}/api/rewrite-story`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ repoUrl, personalExperience }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error rewriting story:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};