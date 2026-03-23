import React, { useState } from 'react';
import { useVoting } from '../context/VotingContext';
import { candidates, elections, getPartyColor, getPartyBorderColor } from '../data/candidates';
import { Candidate } from '../types';

interface VotingPageProps {
  onNavigate: (page: string) => void;
}

const VotingPage: React.FC<VotingPageProps> = ({ onNavigate }) => {
  const { 
    currentVoter, 
    verifyVIN, 
    castVote, 
    hasVotedForPosition,
    isAuthenticated 
  } = useVoting();

  const [vinInput, setVinInput] = useState('');
  const [vinVerified, setVinVerified] = useState(false);
  const [selectedElection, setSelectedElection] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please login to access the voting portal</p>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Login to Vote
          </button>
        </div>
      </div>
    );
  }

  const handleVINVerification = () => {
    const result = verifyVIN(vinInput);
    if (result.valid) {
      setVinVerified(true);
      setError('');
    } else {
      setError(result.message);
    }
  };

  const handleCastVote = () => {
    if (!selectedCandidate || !selectedElection) return;

    const election = elections.find(e => e.id === selectedElection);
    if (!election) return;

    const result = castVote(selectedCandidate, election.position);
    
    if (result.success) {
      setVoteSuccess(true);
      setShowConfirmation(false);
    } else {
      setError(result.message);
    }
  };

  const getElectionCandidates = (electionId: string): Candidate[] => {
    const election = elections.find(e => e.id === electionId);
    if (!election) return [];
    return candidates.filter(c => election.candidates.includes(c.id));
  };

  const selectedCandidateData = selectedCandidate 
    ? candidates.find(c => c.id === selectedCandidate) 
    : null;

  // VIN Verification Screen
  if (!vinVerified) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔐</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">VIN Verification</h2>
              <p className="text-gray-600">Enter your Voter Identification Number to proceed</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your VIN
              </label>
              <input
                type="text"
                value={vinInput}
                onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                placeholder="NG-2026-XXXXXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center font-mono text-lg"
              />
              <p className="text-xs text-gray-500 mt-2">
                Your VIN: <span className="font-mono font-medium">{currentVoter?.vin}</span>
              </p>
            </div>

            <button
              onClick={handleVINVerification}
              disabled={!vinInput}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify VIN
            </button>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Security Notice:</strong> Your VIN can only be used once per election. 
                Make sure you are ready to cast your vote before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vote Success Screen
  if (voteSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">Vote Cast Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for participating in the democratic process. Your vote has been securely recorded.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500">Vote Reference</p>
              <p className="font-mono text-lg font-bold text-gray-800">
                #{Date.now().toString(36).toUpperCase()}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setVoteSuccess(false);
                  setSelectedElection(null);
                  setSelectedCandidate(null);
                }}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Vote for Another Position
              </button>
              <button
                onClick={() => onNavigate('results')}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                View Results
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation Modal
  if (showConfirmation && selectedCandidateData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Confirm Your Vote</h2>
              <p className="text-gray-600">Please review your selection before submitting</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className={`border-2 ${getPartyBorderColor(selectedCandidateData.partyAbbr)} rounded-xl p-6 mb-6`}>
              <div className="text-center">
                <span className="text-5xl">{selectedCandidateData.image}</span>
                <h3 className="text-xl font-bold text-gray-800 mt-3">{selectedCandidateData.name}</h3>
                <div className={`inline-block px-3 py-1 ${getPartyColor(selectedCandidateData.partyAbbr)} text-white rounded-full text-sm mt-2`}>
                  {selectedCandidateData.party} ({selectedCandidateData.partyAbbr})
                </div>
                <p className="text-gray-500 mt-2">Position: {selectedCandidateData.position}</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm font-medium">
                ⚠️ Warning: This action cannot be undone. Once submitted, your vote is final.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleCastVote}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Confirm Vote
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Election Selection
  if (!selectedElection) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">🗳️ Select an Election</h1>
            <p className="text-gray-600">Choose the position you want to vote for</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election) => {
              const hasVoted = hasVotedForPosition(election.position);
              
              return (
                <div
                  key={election.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                    hasVoted ? 'opacity-75' : 'hover:shadow-xl cursor-pointer'
                  } transition-all`}
                  onClick={() => !hasVoted && setSelectedElection(election.id)}
                >
                  <div className={`p-4 ${hasVoted ? 'bg-gray-400' : 'bg-green-600'} text-white`}>
                    <h3 className="font-bold text-lg">{election.title}</h3>
                    <p className="text-green-100 text-sm">Position: {election.position}</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">
                        {election.candidates.length} Candidates
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        election.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {election.status.toUpperCase()}
                      </span>
                    </div>
                    
                    {hasVoted ? (
                      <div className="flex items-center gap-2 text-green-600 font-medium">
                        <span>✅</span>
                        <span>Vote Cast</span>
                      </div>
                    ) : (
                      <button className="w-full py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors">
                        Vote Now →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Ballot Screen
  const electionCandidates = getElectionCandidates(selectedElection);
  const election = elections.find(e => e.id === selectedElection);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{election?.title}</h1>
              <p className="text-gray-600">Select your preferred candidate</p>
            </div>
            <button
              onClick={() => {
                setSelectedElection(null);
                setSelectedCandidate(null);
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {electionCandidates.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate.id)}
              className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all ${
                selectedCandidate === candidate.id
                  ? `ring-4 ${getPartyBorderColor(candidate.partyAbbr).replace('border', 'ring')} scale-[1.02]`
                  : 'hover:shadow-xl'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 ${getPartyColor(candidate.partyAbbr)} rounded-full flex items-center justify-center text-3xl`}>
                  {candidate.image}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{candidate.name}</h3>
                  <div className={`inline-block px-2 py-1 ${getPartyColor(candidate.partyAbbr)} text-white rounded text-xs mt-1`}>
                    {candidate.partyAbbr}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{candidate.party}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedCandidate === candidate.id
                    ? `${getPartyColor(candidate.partyAbbr)} border-transparent`
                    : 'border-gray-300'
                }`}>
                  {selectedCandidate === candidate.id && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{candidate.manifesto}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        {selectedCandidate && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button
              onClick={() => setShowConfirmation(true)}
              className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors"
            >
              🗳️ Cast Vote for {selectedCandidateData?.name}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingPage;
