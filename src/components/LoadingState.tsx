import React from 'react';
import { BookOpen, Code, Clock, Users } from 'lucide-react';

const LoadingState: React.FC = () => {
  const steps = [
    { icon: Code, text: "Analyzing repository structure" },
    { icon: Clock, text: "Exploring commit history" },
    { icon: Users, text: "Understanding contributors" },
    { icon: BookOpen, text: "Crafting your code story" }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Crafting the tale of your code...
          </h3>
          <p className="text-gray-600">
            We're diving deep into your repository's history
          </p>
        </div>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 animate-pulse"
              style={{ animationDelay: `${index * 500}ms` }}
            >
              <div className="flex-shrink-0">
                <step.icon className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-gray-700 font-medium">{step.text}</span>
              <div className="flex-1 flex justify-end">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This usually takes 10-15 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;