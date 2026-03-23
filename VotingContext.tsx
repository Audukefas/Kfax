import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Voter, Vote } from '../types';
import { generateVIN, hashPassword, verifyPassword } from '../utils/vinGenerator';

interface VotingContextType {
  // Auth state
  currentVoter: Voter | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Data
  voters: Voter[];
  votes: Vote[];
  
  // Auth functions
  register: (voterData: Omit<Voter, 'id' | 'vin' | 'vinStatus' | 'registeredAt'>) => { success: boolean; message: string; vin?: string };
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  
  // Voting functions
  verifyVIN: (vin: string) => { valid: boolean; message: string };
  castVote: (candidateId: string, position: string) => { success: boolean; message: string };
  hasVotedForPosition: (position: string) => boolean;
  
  // Admin functions
  getVotesByCandidate: (candidateId: string) => number;
  getVotesByPosition: (position: string) => Vote[];
  getTotalVoters: () => number;
  getTotalVotes: () => number;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

const STORAGE_KEYS = {
  VOTERS: 'inec_voters',
  VOTES: 'inec_votes',
  CURRENT_VOTER: 'inec_current_voter',
  SESSION_EXPIRY: 'inec_session_expiry'
};

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

export const VotingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [currentVoter, setCurrentVoter] = useState<Voter | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedVoters = localStorage.getItem(STORAGE_KEYS.VOTERS);
    const savedVotes = localStorage.getItem(STORAGE_KEYS.VOTES);
    const savedCurrentVoter = localStorage.getItem(STORAGE_KEYS.CURRENT_VOTER);
    const sessionExpiry = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY);

    if (savedVoters) {
      setVoters(JSON.parse(savedVoters));
    } else {
      // Create default admin account
      const adminVoter: Voter = {
        id: 'admin-001',
        fullName: 'INEC Administrator',
        email: 'admin@inec.gov.ng',
        phoneNumber: '08000000000',
        dateOfBirth: '1980-01-01',
        gender: 'male',
        state: 'FCT',
        lga: 'Municipal Area Council',
        password: hashPassword('admin123'),
        vin: 'NG-2026-000001',
        vinStatus: 'unused',
        registeredAt: new Date().toISOString(),
        isAdmin: true
      };
      setVoters([adminVoter]);
      localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify([adminVoter]));
    }

    if (savedVotes) {
      setVotes(JSON.parse(savedVotes));
    }

    // Check session validity
    if (savedCurrentVoter && sessionExpiry) {
      const expiryTime = parseInt(sessionExpiry, 10);
      if (Date.now() < expiryTime) {
        setCurrentVoter(JSON.parse(savedCurrentVoter));
        // Extend session
        localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, (Date.now() + SESSION_DURATION).toString());
      } else {
        // Session expired
        localStorage.removeItem(STORAGE_KEYS.CURRENT_VOTER);
        localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
      }
    }
  }, []);

  // Save voters to localStorage when updated
  useEffect(() => {
    if (voters.length > 0) {
      localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(voters));
    }
  }, [voters]);

  // Save votes to localStorage when updated
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
  }, [votes]);

  const register = (voterData: Omit<Voter, 'id' | 'vin' | 'vinStatus' | 'registeredAt'>) => {
    // Check if email already exists
    if (voters.some(v => v.email.toLowerCase() === voterData.email.toLowerCase())) {
      return { success: false, message: 'Email already registered' };
    }

    // Check if phone already exists
    if (voters.some(v => v.phoneNumber === voterData.phoneNumber)) {
      return { success: false, message: 'Phone number already registered' };
    }

    // Generate unique VIN
    const existingVINs = voters.map(v => v.vin);
    const vin = generateVIN(existingVINs);

    const newVoter: Voter = {
      ...voterData,
      id: `voter-${Date.now()}`,
      password: hashPassword(voterData.password),
      vin,
      vinStatus: 'unused',
      registeredAt: new Date().toISOString()
    };

    setVoters(prev => [...prev, newVoter]);
    
    return { 
      success: true, 
      message: 'Registration successful! Please save your VIN securely.', 
      vin 
    };
  };

  const login = (email: string, password: string) => {
    const voter = voters.find(v => v.email.toLowerCase() === email.toLowerCase());
    
    if (!voter) {
      return { success: false, message: 'Invalid email or password' };
    }

    if (!verifyPassword(password, voter.password)) {
      return { success: false, message: 'Invalid email or password' };
    }

    setCurrentVoter(voter);
    localStorage.setItem(STORAGE_KEYS.CURRENT_VOTER, JSON.stringify(voter));
    localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, (Date.now() + SESSION_DURATION).toString());

    return { success: true, message: 'Login successful' };
  };

  const logout = () => {
    setCurrentVoter(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_VOTER);
    localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
  };

  const verifyVIN = (vin: string) => {
    if (!currentVoter) {
      return { valid: false, message: 'Please login first' };
    }

    if (vin !== currentVoter.vin) {
      return { valid: false, message: 'Invalid VIN. Please enter your correct VIN.' };
    }

    // Get updated voter status from voters array
    const updatedVoter = voters.find(v => v.id === currentVoter.id);
    if (updatedVoter?.vinStatus === 'used') {
      return { valid: false, message: 'This VIN has already been used to vote.' };
    }

    return { valid: true, message: 'VIN verified successfully' };
  };

  const castVote = (candidateId: string, position: string) => {
    if (!currentVoter) {
      return { success: false, message: 'Please login first' };
    }

    // Check if already voted for this position
    const existingVote = votes.find(
      v => v.voterId === currentVoter.id && v.position === position
    );

    if (existingVote) {
      return { success: false, message: 'You have already voted for this position' };
    }

    // Create new vote
    const newVote: Vote = {
      id: `vote-${Date.now()}`,
      voterId: currentVoter.id,
      candidateId,
      position,
      timestamp: new Date().toISOString(),
      vin: currentVoter.vin
    };

    setVotes(prev => [...prev, newVote]);

    // Update voter's VIN status
    setVoters(prev => prev.map(v => 
      v.id === currentVoter.id 
        ? { ...v, vinStatus: 'used' as const }
        : v
    ));

    // Update current voter state
    setCurrentVoter(prev => prev ? { ...prev, vinStatus: 'used' } : null);

    return { success: true, message: 'Your vote has been recorded successfully!' };
  };

  const hasVotedForPosition = (position: string) => {
    if (!currentVoter) return false;
    return votes.some(v => v.voterId === currentVoter.id && v.position === position);
  };

  const getVotesByCandidate = (candidateId: string) => {
    return votes.filter(v => v.candidateId === candidateId).length;
  };

  const getVotesByPosition = (position: string) => {
    return votes.filter(v => v.position === position);
  };

  const getTotalVoters = () => voters.filter(v => !v.isAdmin).length;
  
  const getTotalVotes = () => votes.length;

  const value: VotingContextType = {
    currentVoter,
    isAuthenticated: !!currentVoter,
    isAdmin: currentVoter?.isAdmin || false,
    voters,
    votes,
    register,
    login,
    logout,
    verifyVIN,
    castVote,
    hasVotedForPosition,
    getVotesByCandidate,
    getVotesByPosition,
    getTotalVoters,
    getTotalVotes
  };

  return (
    <VotingContext.Provider value={value}>
      {children}
    </VotingContext.Provider>
  );
};

export const useVoting = () => {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};
