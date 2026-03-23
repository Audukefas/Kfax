import React, { useState } from 'react';
import { VotingProvider } from './context/VotingContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import VotingPage from './components/VotingPage';
import ResultsPage from './components/ResultsPage';
import AdminPage from './components/AdminPage';

type Page = 'home' | 'register' | 'login' | 'vote' | 'results' | 'admin';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'vote':
        return <VotingPage onNavigate={handleNavigate} />;
      case 'results':
        return <ResultsPage />;
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // Don't show header on login page
  const showHeader = currentPage !== 'login';

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
      )}
      {renderPage()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <VotingProvider>
      <AppContent />
    </VotingProvider>
  );
};

export default App;
