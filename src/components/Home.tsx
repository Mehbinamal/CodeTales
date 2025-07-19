import React, { useState } from 'react';
import Hero from './Hero';
import InputForm from './InputForm';
import LoadingState from './LoadingState';
import StoryDisplay from './StoryDisplay';
import EmptyState from './EmptyState';
import { CodeStory } from '../types';
import { generateStory, rewriteStoryWithExperience } from '../utils/api';

const Home: React.FC = () => {
  const [story, setStory] = useState<CodeStory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRepoUrl, setCurrentRepoUrl] = useState<string>('');

  const handleGenerateStory = async (repoUrl: string) => {
    setIsLoading(true);
    setError(null);
    setStory(null);
    setCurrentRepoUrl(repoUrl);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <Hero />
        
        <InputForm 
          onSubmit={handleGenerateStory}
          isLoading={isLoading}
        />
        
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

export default Home; 