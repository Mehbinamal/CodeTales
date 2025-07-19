import React, { useState, useEffect } from 'react';
import { Github, Sparkles, ExternalLink } from 'lucide-react';
import { parseGitHubUrl, isValidGitHubRepo } from '../utils/api';

interface InputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [autoSubmit, setAutoSubmit] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  const handleDirectNavigation = () => {
    const parsed = parseGitHubUrl(url);
    if (parsed) {
      const { username, repo } = parsed;
      window.location.href = `/${username}/${repo}`;
    }
  };

  const isValidGithubUrl = (url: string) => {
    return isValidGitHubRepo(url);
  };

  // Auto-submit when a valid GitHub URL is entered
  useEffect(() => {
    if (autoSubmit && url.trim() && isValidGithubUrl(url) && !isLoading) {
      onSubmit(url.trim());
      setAutoSubmit(false);
    }
  }, [url, autoSubmit, isLoading, onSubmit]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    // Check if this looks like a GitHub URL that should auto-submit
    if (newUrl.trim() && isValidGithubUrl(newUrl)) {
      // Add a small delay to allow user to finish typing
      setTimeout(() => {
        if (url === newUrl && newUrl.trim()) {
          setAutoSubmit(true);
        }
      }, 1000); // 1 second delay
    }
  };

  const isValid = url === '' || isValidGithubUrl(url);

  return (
    <div className="max-w-2xl mx-auto mb-16">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Github className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="Paste your GitHub repo URL…"
            className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 ${
              !isValid 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100 bg-white hover:border-gray-300'
            } shadow-sm`}
            disabled={isLoading}
          />
          
          {!isValid && url.trim() && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              Please enter a valid GitHub repository URL
            </p>
          )}
          
          {isValid && url.trim() && !isLoading && (
            <p className="mt-2 text-sm text-green-600 flex items-center">
              ✓ Valid GitHub URL - Story will be generated automatically
            </p>
          )}
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={!url.trim() || !isValid || isLoading}
            className="flex-1 py-4 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl transition-all duration-300 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Crafting your tale...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Tell Me The Story</span>
              </>
            )}
          </button>
          
          {isValid && url.trim() && !isLoading && (
            <button
              type="button"
              onClick={handleDirectNavigation}
              className="px-6 py-4 bg-gray-100 text-gray-700 text-lg font-semibold rounded-2xl transition-all duration-300 hover:bg-gray-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              title="Go directly to repository story page"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Direct Link</span>
            </button>
          )}
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Try: <button 
            onClick={() => setUrl('https://github.com/facebook/react')}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            https://github.com/facebook/react
          </button>
        </p>
        <p className="text-xs text-gray-400 mt-2">
          💡 Tip: Paste a GitHub URL and the story will generate automatically! Use "Direct Link" to create shareable URLs.
        </p>
      </div>
    </div>
  );
};

export default InputForm;