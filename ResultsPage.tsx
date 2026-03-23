import React, { useState } from 'react';
import { useVoting } from '../context/VotingContext';
import { candidates, elections, getPartyColor } from '../data/candidates';

const ResultsPage: React.FC = () => {
  const { getVotesByCandidate, getVotesByPosition, getTotalVotes } = useVoting();
  const [selectedPosition, setSelectedPosition] = useState<string>('President');

  const positions = [...new Set(elections.map(e => e.position))];
  
  const getPositionResults = (position: string) => {
    const positionCandidates = candidates.filter(c => c.position === position);
    const positionVotes = getVotesByPosition(position);
    const totalVotes = positionVotes.length;

    return positionCandidates.map(candidate => {
      const candidateVotes = getVotesByCandidate(candidate.id);
      const percentage = totalVotes > 0 ? (candidateVotes / totalVotes) * 100 : 0;
      
      return {
        ...candidate,
        votes: candidateVotes,
        percentage
      };
    }).sort((a, b) => b.votes - a.votes);
  };

  const results = getPositionResults(selectedPosition);
  const totalPositionVotes = results.reduce((sum, r) => sum + r.votes, 0);
  const winner = results.length > 0 && results[0].votes > 0 ? results[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📊 Election Results</h1>
          <p className="text-gray-600">Real-time vote counting and results</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{getTotalVotes()}</p>
            <p className="text-sm text-gray-500">Total Votes Cast</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{positions.length}</p>
            <p className="text-sm text-gray-500">Positions</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{candidates.length}</p>
            <p className="text-sm text-gray-500">Total Candidates</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{totalPositionVotes}</p>
            <p className="text-sm text-gray-500">{selectedPosition} Votes</p>
          </div>
        </div>

        {/* Position Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex border-b overflow-x-auto">
            {positions.map((position) => (
              <button
                key={position}
                onClick={() => setSelectedPosition(position)}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  selectedPosition === position
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {position}
              </button>
            ))}
          </div>

          {/* Results Content */}
          <div className="p-6">
            {/* Winner Banner */}
            {winner && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 mb-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">🏆</div>
                  <div>
                    <p className="text-yellow-100 text-sm">Leading Candidate</p>
                    <h2 className="text-2xl font-bold">{winner.name}</h2>
                    <p className="text-yellow-100">{winner.party} ({winner.partyAbbr})</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-4xl font-bold">{winner.votes}</p>
                    <p className="text-yellow-100">votes ({winner.percentage.toFixed(1)}%)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Results List */}
            <div className="space-y-4">
              {results.map((candidate, index) => (
                <div
                  key={candidate.id}
                  className={`border rounded-xl p-4 ${
                    index === 0 && candidate.votes > 0 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-gray-300 w-8">
                      #{index + 1}
                    </div>
                    <div className={`w-12 h-12 ${getPartyColor(candidate.partyAbbr)} rounded-full flex items-center justify-center text-2xl`}>
                      {candidate.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800">{candidate.name}</h3>
                        {index === 0 && candidate.votes > 0 && (
                          <span className="text-yellow-500">👑</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {candidate.party} ({candidate.partyAbbr})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">{candidate.votes}</p>
                      <p className="text-sm text-gray-500">{candidate.percentage.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPartyColor(candidate.partyAbbr)} transition-all duration-500`}
                        style={{ width: `${candidate.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}

              {results.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <span className="text-4xl">📭</span>
                  <p className="mt-2">No candidates found for this position</p>
                </div>
              )}

              {totalPositionVotes === 0 && results.length > 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <span className="text-4xl">🗳️</span>
                  <p className="mt-2 text-gray-600">No votes have been cast yet for {selectedPosition}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chart Legend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4">Party Colors</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-sm text-gray-600">APC - All Progressives Congress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-sm text-gray-600">PDP - People's Democratic Party</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-sm text-gray-600">LP - Labour Party</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-600 rounded"></div>
              <span className="text-sm text-gray-600">NNPP - New Nigeria People's Party</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Results are updated in real-time. Official results will be announced by INEC after verification.</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
