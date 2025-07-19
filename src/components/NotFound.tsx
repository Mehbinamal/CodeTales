import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Github } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Github className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The repository story you're looking for doesn't exist or the URL is invalid.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Valid URL format: <code className="bg-gray-100 px-2 py-1 rounded">codetales.com/username/repository</code></p>
            <p className="mt-2">Example: <code className="bg-gray-100 px-2 py-1 rounded">codetales.com/facebook/react</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 