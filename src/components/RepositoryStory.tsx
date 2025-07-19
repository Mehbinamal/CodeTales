import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Hero from './Hero';
import LoadingState from './LoadingState';
import StoryDisplay from './StoryDisplay';
import EmptyState from './EmptyState';
import { CodeStory } from '../types';
import { generateStory, rewriteStoryWithExperience } from '../utils/api';

interface RepositoryStoryProps {
  onBackToHome: () => void;
}

const RepositoryStory: React.FC<RepositoryStoryProps> = ({ onBackToHome }) => {
  const { username, repo } = useParams<{ username: string; repo: string }>();
  const navigate = useNavigate();
  
  const [story, setStory] = useState<CodeStory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentRepoUrl, setCurrentRepoUrl] = useState<string>('');

  useEffect(() => {
    if (username && repo) {
      // Validate that username and repo are valid GitHub identifiers
      const usernameValid = /^[a-zA-Z0-9-]+$/.test(username);
      const repoValid = /^[a-zA-Z0-9-_.]+$/.test(repo);
      
      if (!usernameValid || !repoValid) {
        setError('Invalid repository format. Username and repository names can only contain letters, numbers, hyphens, underscores, and dots.');
        setIsLoading(false);
        return;
      }
      
      const repoUrl = `https://github.com/${username}/${repo}`;
      setCurrentRepoUrl(repoUrl);
      generateStoryFromUrl(repoUrl);
    }
  }, [username, repo]);

  const generateStoryFromUrl = async (repoUrl: string) => {
    setIsLoading(true);
    setError(null);
    setStory(null);

    try {
      const result = await generateStory(repoUrl);
      
      if (result.success && result.data) {
        setStory(result.data);
      } else {
        setError(result.error || 'Failed to generate story');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRewriteStory = async (personalExperience: string) => {
    if (!currentRepoUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await rewriteStoryWithExperience(currentRepoUrl, personalExperience);
      
      if (result.success && result.data) {
        setStory(result.data);
      } else {
        setError(result.error || 'Failed to rewrite story');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
    onBackToHome();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <Hero />
        
        {/* Back to Home Button and Repository Info */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Home</span>
            </button>
            
            {currentRepoUrl && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Analyzing:</span>{' '}
                <a 
                  href={currentRepoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {currentRepoUrl}
                </a>
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm font-bold">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">
                    Oops! Something went wrong
                  </h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <LoadingState />
        ) : story ? (
          <StoryDisplay 
            story={story} 
            onRewriteStory={handleRewriteStory}
            currentRepoUrl={currentRepoUrl}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default RepositoryStory; 