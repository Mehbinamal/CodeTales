import React from 'react';
import { Github, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <Github className="w-16 h-16 text-blue-600 mr-3" />
          <Sparkles className="w-6 h-6 text-purple-500 absolute -top-2 -right-2 animate-pulse" />
        </div>
      </div>
      
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
        Code<span className="text-blue-600">Tales</span>
      </h1>
      
      <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
        Every repository has a journey. Let us tell the story of your code.
      </p>
      
      <p className="text-lg text-gray-500 max-w-2xl mx-auto">
        Discover the narrative behind any public GitHub repository — from its first commit 
        to its latest evolution.
      </p>
    </div>
  );
};

export default Hero;