// Type definitions for the voting system

export interface Voter {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  state: string;
  lga: string;
  password: string;
  vin: string;
  vinStatus: 'unused' | 'used';
  registeredAt: string;
  isAdmin?: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  partyAbbr: string;
  position: string;
  image: string;
  manifesto: string;
}

export interface Vote {
  id: string;
  voterId: string;
  candidateId: string;
  position: string;
  timestamp: string;
  vin: string;
}

export interface Election {
  id: string;
  title: string;
  position: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'closed';
  candidates: string[];
}

export interface NigerianState {
  name: string;
  lgas: string[];
}
