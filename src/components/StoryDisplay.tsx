import React from 'react';
import { Calendar, Code, GitBranch, Star, Users, Clock, ExternalLink, Download, Edit3, Save, X } from 'lucide-react';
import { CodeStory } from '../types';
import DownloadCard from './DownloadCard';
import PersonalExperience from './PersonalExperience';

interface StoryDisplayProps {
  story: CodeStory;
  onRewriteStory: (personalExperience: string) => Promise<void>;
  currentRepoUrl: string;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ story, onRewriteStory, currentRepoUrl }) => {
  const { repository, timeline, narrative, insights } = story;
  const [showDownload, setShowDownload] = React.useState(false);
  const [personalExperience, setPersonalExperience] = React.useState('');
  const [isRewriting, setIsRewriting] = React.useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRewriteStory = async (experience: string) => {
    setIsRewriting(true);
    try {
      await onRewriteStory(experience);
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Repository Header */}
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {repository.name}
                </h2>
                <p className="text-lg text-gray-600">
                  by <span className="font-semibold">{repository.owner}</span>
                </p>
              </div>
            </div>
            
            {repository.description && (
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {repository.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-full">
                <Code className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {repository.language}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-2 rounded-full">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">
                  {repository.stars.toLocaleString()} stars
                </span>
              </div>
              
              <div className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-full">
                <GitBranch className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {repository.forks.toLocaleString()} forks
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDownload(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download Story</span>
              </button>
              
              <a
                href={repository.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {insights.totalCommits.toLocaleString()}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Total Commits</h3>
          <p className="text-sm text-gray-600">
            Code changes over time
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {insights.contributors}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Contributors</h3>
          <p className="text-sm text-gray-600">
            Developers involved
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {insights.activeMonths}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Active Months</h3>
          <p className="text-sm text-gray-600">
            Development period
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Timeline Highlights
          </h3>
        </div>
        
        <div className="space-y-6">
          {timeline.map((commit, index) => (
            <div 
              key={commit.sha}
              className="flex space-x-4 animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900 truncate">
                    {commit.message}
                  </p>
                  <span className="text-sm text-gray-500 flex-shrink-0 ml-4">
                    {formatDate(commit.date)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  by {commit.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Narrative */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            The Story Behind the Code
          </h3>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed text-lg">
            {narrative}
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Created at {formatDate(repository.createdAt)} • Last updated {formatDate(repository.updatedAt)}
          </p>
        </div>
      </div>

      {/* Personal Experience Section */}
      <PersonalExperience
        personalExperience={personalExperience}
        setPersonalExperience={setPersonalExperience}
        onRewriteStory={handleRewriteStory}
        isRewriting={isRewriting}
      />

      {/* Download Modal */}
      {showDownload && (
        <DownloadCard
          story={story}
          personalExperience={personalExperience}
          onClose={() => setShowDownload(false)}
        />
      )}
    </div>
  );
};

export default StoryDisplay;