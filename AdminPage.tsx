import React, { useState } from 'react';
import { useVoting } from '../context/VotingContext';
import { candidates, elections, getPartyColor } from '../data/candidates';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { 
    isAdmin, 
    voters, 
    votes, 
    getVotesByCandidate,
    getTotalVoters,
    getTotalVotes 
  } = useVoting();

  const [activeTab, setActiveTab] = useState<'overview' | 'voters' | 'votes' | 'results'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access this page</p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const registeredVoters = voters.filter(v => !v.isAdmin);
  const usedVINs = registeredVoters.filter(v => v.vinStatus === 'used').length;
  const unusedVINs = registeredVoters.filter(v => v.vinStatus === 'unused').length;

  const filteredVoters = registeredVoters.filter(v => 
    v.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getVoteDetails = () => {
    return votes.map(vote => {
      const voter = voters.find(v => v.id === vote.voterId);
      const candidate = candidates.find(c => c.id === vote.candidateId);
      return {
        ...vote,
        voterName: voter?.fullName || 'Unknown',
        voterVIN: voter?.vin || 'Unknown',
        candidateName: candidate?.name || 'Unknown',
        candidateParty: candidate?.partyAbbr || 'Unknown'
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-gray-900 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">⚙️ Admin Dashboard</h1>
              <p className="text-gray-400">INEC Election Management System</p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Back to Site
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{getTotalVoters()}</p>
                <p className="text-sm text-gray-500">Registered Voters</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🗳️</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{getTotalVotes()}</p>
                <p className="text-sm text-gray-500">Total Votes</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{usedVINs}</p>
                <p className="text-sm text-gray-500">Used VINs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎫</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{unusedVINs}</p>
                <p className="text-sm text-gray-500">Unused VINs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="flex border-b">
            {(['overview', 'voters', 'votes', 'results'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">Election Overview</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {elections.map((election) => {
                    const electionVotes = votes.filter(v => v.position === election.position).length;
                    const electionCandidates = candidates.filter(c => c.position === election.position);
                    
                    return (
                      <div key={election.id} className="border rounded-xl p-4">
                        <h4 className="font-bold text-gray-800">{election.title}</h4>
                        <p className="text-sm text-gray-500 mb-3">{election.position}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Candidates:</span>
                            <span className="font-medium">{electionCandidates.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Votes Cast:</span>
                            <span className="font-medium">{electionVotes}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Status:</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              election.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {election.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Turnout */}
                <div className="border rounded-xl p-4">
                  <h4 className="font-bold text-gray-800 mb-3">Voter Turnout</h4>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 transition-all"
                      style={{ width: `${getTotalVoters() > 0 ? (usedVINs / getTotalVoters()) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {usedVINs} of {getTotalVoters()} registered voters have voted ({getTotalVoters() > 0 ? ((usedVINs / getTotalVoters()) * 100).toFixed(1) : 0}%)
                  </p>
                </div>
              </div>
            )}

            {/* Voters Tab */}
            {activeTab === 'voters' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Registered Voters</h3>
                  <input
                    type="text"
                    placeholder="Search voters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">VIN</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">State</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredVoters.map((voter) => (
                        <tr key={voter.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{voter.fullName}</td>
                          <td className="px-4 py-3 text-sm font-mono text-gray-600">{voter.vin}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{voter.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{voter.state}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              voter.vinStatus === 'used' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {voter.vinStatus === 'used' ? 'Voted' : 'Not Voted'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(voter.registeredAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredVoters.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No voters found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Votes Tab */}
            {activeTab === 'votes' && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Vote Records</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Vote ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Voter VIN</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Position</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Candidate</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Party</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {getVoteDetails().map((vote) => (
                        <tr key={vote.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-mono text-gray-600">{vote.id.slice(-8)}</td>
                          <td className="px-4 py-3 text-sm font-mono text-gray-600">{vote.voterVIN}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{vote.position}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{vote.candidateName}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 ${getPartyColor(vote.candidateParty)} text-white rounded text-xs`}>
                              {vote.candidateParty}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(vote.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {votes.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No votes recorded yet
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Results Tab */}
            {activeTab === 'results' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">Results Summary</h3>
                
                {elections.map((election) => {
                  const electionCandidates = candidates.filter(c => c.position === election.position);
                  const totalVotes = votes.filter(v => v.position === election.position).length;
                  
                  return (
                    <div key={election.id} className="border rounded-xl p-4">
                      <h4 className="font-bold text-gray-800 mb-4">{election.title}</h4>
                      <div className="space-y-3">
                        {electionCandidates
                          .map(c => ({
                            ...c,
                            votes: getVotesByCandidate(c.id),
                            percentage: totalVotes > 0 ? (getVotesByCandidate(c.id) / totalVotes) * 100 : 0
                          }))
                          .sort((a, b) => b.votes - a.votes)
                          .map((candidate, idx) => (
                            <div key={candidate.id} className="flex items-center gap-4">
                              <div className="w-8 text-center font-bold text-gray-400">#{idx + 1}</div>
                              <div className={`w-10 h-10 ${getPartyColor(candidate.partyAbbr)} rounded-full flex items-center justify-center text-xl`}>
                                {candidate.image}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{candidate.name}</p>
                                <div className="h-2 bg-gray-200 rounded-full mt-1">
                                  <div
                                    className={`h-full ${getPartyColor(candidate.partyAbbr)} rounded-full`}
                                    style={{ width: `${candidate.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-800">{candidate.votes}</p>
                                <p className="text-xs text-gray-500">{candidate.percentage.toFixed(1)}%</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
