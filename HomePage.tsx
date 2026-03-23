import React from 'react';
import { useVoting } from '../context/VotingContext';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { isAuthenticated, getTotalVoters, getTotalVotes } = useVoting();

  const features = [
    {
      icon: '🔐',
      title: 'Secure Authentication',
      description: 'Multi-layer security with VIN verification ensures only eligible voters can cast their votes.'
    },
    {
      icon: '🎫',
      title: 'Unique VIN System',
      description: 'Each voter receives a unique Voter Identification Number (VIN) that can only be used once.'
    },
    {
      icon: '✅',
      title: 'One Person, One Vote',
      description: 'Our system guarantees that each VIN can only cast one vote per election position.'
    },
    {
      icon: '📊',
      title: 'Transparent Results',
      description: 'Real-time vote counting with transparent and tamper-proof result compilation.'
    },
    {
      icon: '🛡️',
      title: 'Data Protection',
      description: 'All voter information is encrypted and protected according to Nigerian data protection regulations.'
    },
    {
      icon: '📱',
      title: 'Accessible Platform',
      description: 'Vote from anywhere using any device with internet access during election period.'
    }
  ];

  const steps = [
    { num: 1, title: 'Register', desc: 'Create your voter account with valid personal information' },
    { num: 2, title: 'Get VIN', desc: 'Receive your unique Voter Identification Number' },
    { num: 3, title: 'Login', desc: 'Access the voting portal with your credentials' },
    { num: 4, title: 'Verify VIN', desc: 'Enter your VIN to access the ballot' },
    { num: 5, title: 'Vote', desc: 'Select your preferred candidate and submit' },
    { num: 6, title: 'Confirmation', desc: 'Receive confirmation that your vote was recorded' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 border-4 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                <span className="text-5xl">🇳🇬</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Secure Online Voting System
            </h1>
            <p className="text-xl md:text-2xl text-green-200 mb-8 max-w-3xl mx-auto">
              Independent National Electoral Commission (INEC) - Nigeria
            </p>
            <p className="text-lg text-green-100 mb-10 max-w-2xl mx-auto">
              Exercise your civic duty from anywhere. Our secure VIN-based authentication 
              system ensures transparent and tamper-proof elections.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <button
                  onClick={() => onNavigate('vote')}
                  className="px-8 py-4 bg-white text-green-800 rounded-xl font-bold text-lg hover:bg-green-100 transform hover:scale-105 transition-all shadow-lg"
                >
                  🗳️ Cast Your Vote Now
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('register')}
                    className="px-8 py-4 bg-white text-green-800 rounded-xl font-bold text-lg hover:bg-green-100 transform hover:scale-105 transition-all shadow-lg"
                  >
                    Register to Vote
                  </button>
                  <button
                    onClick={() => onNavigate('login')}
                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transform hover:scale-105 transition-all"
                  >
                    Already Registered? Login
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <p className="text-3xl font-bold">{getTotalVoters()}</p>
              <p className="text-green-200">Registered Voters</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <p className="text-3xl font-bold">{getTotalVotes()}</p>
              <p className="text-green-200">Votes Cast</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <p className="text-3xl font-bold">3</p>
              <p className="text-green-200">Active Elections</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <p className="text-3xl font-bold">37</p>
              <p className="text-green-200">States Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            How Online Voting Works
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our streamlined process ensures secure and efficient voting
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {steps.map((step) => (
              <div key={step.num} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center h-full">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
                {step.num < 6 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-green-600 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Security Features
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Built with industry-standard security measures to protect your vote
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Exercise Your Right?</h2>
          <p className="text-green-100 mb-8">
            Join millions of Nigerians in shaping the future of our nation through secure online voting.
          </p>
          {!isAuthenticated && (
            <button
              onClick={() => onNavigate('register')}
              className="px-8 py-4 bg-white text-green-700 rounded-xl font-bold text-lg hover:bg-green-100 transform hover:scale-105 transition-all shadow-lg"
            >
              Get Started - Register Now
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xl">🇳🇬</span>
                </div>
                <span className="font-bold">INEC Nigeria</span>
              </div>
              <p className="text-gray-400 text-sm">
                Independent National Electoral Commission - Securing Nigeria's Democratic Future
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => onNavigate('home')} className="hover:text-white">Home</button></li>
                <li><button onClick={() => onNavigate('register')} className="hover:text-white">Register</button></li>
                <li><button onClick={() => onNavigate('login')} className="hover:text-white">Login</button></li>
                <li><button onClick={() => onNavigate('results')} className="hover:text-white">Results</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>📞 0800-CALL-INEC</li>
                <li>📧 support@inec.gov.ng</li>
                <li>🌐 www.inecnigeria.org</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Data Protection</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            © 2026 Independent National Electoral Commission (INEC) Nigeria. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
