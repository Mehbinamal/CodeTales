import React, { useState } from 'react';
import { Edit3, Save, X, Heart, MessageCircle, RefreshCw } from 'lucide-react';

interface PersonalExperienceProps {
  personalExperience: string;
  setPersonalExperience: (value: string) => void;
  onRewriteStory: (personalExperience: string) => Promise<void>;
  isRewriting?: boolean;
}

const PersonalExperience: React.FC<PersonalExperienceProps> = ({
  personalExperience,
  setPersonalExperience,
  onRewriteStory,
  isRewriting = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(personalExperience);

  const handleSave = async () => {
    setPersonalExperience(tempText);
    setIsEditing(false);
    
    // Rewrite the story with the new personal experience
    if (tempText.trim()) {
      await onRewriteStory(tempText);
    }
  };

  const handleCancel = () => {
    setTempText(personalExperience);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-100 to-orange-100 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-pink-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Your Personal Connection
          </h3>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-colors duration-200"
          >
            <Edit3 className="w-4 h-4" />
            <span>Add Your Story</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center space-x-2 mb-3">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Share Your Experience</span>
            </div>
            <p className="text-blue-800 text-sm">
              How did you discover this project? What impact has it had on your work? 
              Share your personal connection to make this story uniquely yours. After saving, 
              the story will be rewritten to incorporate your experience.
            </p>
          </div>
          
          <textarea
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            placeholder="Share your personal experience with this repository... How did you discover it? What impact has it had on your projects? What makes it special to you?"
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none resize-none transition-all duration-300"
            maxLength={500}
          />
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {tempText.length}/500 characters
            </span>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-colors duration-200"
                disabled={isRewriting}
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              
              <button
                onClick={handleSave}
                disabled={isRewriting}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRewriting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Rewriting...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save & Rewrite Story</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : personalExperience ? (
        <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-6 border border-pink-100">
          <p className="text-gray-700 leading-relaxed text-lg italic">
            "{personalExperience}"
          </p>
          <div className="mt-4 pt-4 border-t border-pink-200">
            <p className="text-sm text-pink-700 font-medium">
              — Your personal connection to this project
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-100 to-orange-100 rounded-full mb-4">
            <MessageCircle className="w-8 h-8 text-pink-600" />
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            Make This Story Yours
          </h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Add your personal experience with this repository to create a more meaningful 
            and complete story that reflects your unique journey. The story will be rewritten 
            to incorporate your experience.
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-pink-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105"
          >
            <Edit3 className="w-4 h-4" />
            <span>Share Your Experience</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalExperience;