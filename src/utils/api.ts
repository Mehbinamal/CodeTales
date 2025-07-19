import { ApiResponse } from '../types';

// API base URL - use deployed server
const API_BASE_URL = 'https://code-tales-server.vercel.app';

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