import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import RepositoryStory from './components/RepositoryStory';
import NotFound from './components/NotFound';

function App() {
  const handleBackToHome = () => {
    // This function is passed to RepositoryStory component
    // to handle navigation back to home
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Home />} 
        />
        <Route 
          path="/:username/:repo" 
          element={<RepositoryStory onBackToHome={handleBackToHome} />} 
        />
        <Route 
          path="*" 
          element={<NotFound />} 
        />
      </Routes>
    </Router>
  );
}

export default App;