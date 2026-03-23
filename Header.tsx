import React from 'react';
import { useVoting } from '../context/VotingContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { isAuthenticated, isAdmin, currentVoter, logout } = useVoting();

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  return (
    <header className="bg-green-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🇳🇬</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">INEC Nigeria</h1>
              <p className="text-xs text-green-200">Independent National Electoral Commission</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'home' 
                  ? 'bg-green-700 text-white' 
                  : 'text-green-100 hover:bg-green-700'
              }`}
            >
              Home
            </button>

            {isAuthenticated && (
              <>
                <button
                  onClick={() => onNavigate('vote')}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === 'vote' 
                      ? 'bg-green-700 text-white' 
                      : 'text-green-100 hover:bg-green-700'
                  }`}
                >
                  🗳️ Cast Vote
                </button>
                <button
                  onClick={() => onNavigate('results')}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === 'results' 
                      ? 'bg-green-700 text-white' 
                      : 'text-green-100 hover:bg-green-700'
                  }`}
                >
                  📊 Results
                </button>
              </>
            )}

            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'admin' 
                    ? 'bg-green-700 text-white' 
                    : 'text-green-100 hover:bg-green-700'
                }`}
              >
                ⚙️ Admin
              </button>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">{currentVoter?.fullName}</p>
                  <p className="text-xs text-green-200">VIN: {currentVoter?.vin}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 bg-white text-green-800 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 border border-green-500 rounded-lg text-sm font-medium transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-3 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              currentPage === 'home' ? 'bg-green-600' : 'bg-green-700'
            }`}
          >
            Home
          </button>
          {isAuthenticated && (
            <>
              <button
                onClick={() => onNavigate('vote')}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                  currentPage === 'vote' ? 'bg-green-600' : 'bg-green-700'
                }`}
              >
                Vote
              </button>
              <button
                onClick={() => onNavigate('results')}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                  currentPage === 'results' ? 'bg-green-600' : 'bg-green-700'
                }`}
              >
                Results
              </button>
            </>
          )}
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                currentPage === 'admin' ? 'bg-green-600' : 'bg-green-700'
              }`}
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
