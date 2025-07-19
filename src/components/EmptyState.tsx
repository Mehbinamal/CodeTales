import React from 'react';
import { BookOpen, Github } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Your story will appear here once it's ready
        </h3>
        
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Enter a GitHub repository URL above to discover the fascinating journey 
          behind the code. Every repository has a tale to tell — let's uncover yours.
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Github className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Pro Tip</span>
          </div>
          <p className="text-blue-800 text-sm">
            Try exploring popular repositories like React, Vue, or TensorFlow to see 
            how CodeTales brings their development stories to life.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;