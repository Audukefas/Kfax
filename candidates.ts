import { Candidate } from '../types';

export const candidates: Candidate[] = [
  // Presidential Candidates
  {
    id: 'pres-1',
    name: 'Chief Adewale Okonkwo',
    party: 'All Progressives Congress',
    partyAbbr: 'APC',
    position: 'President',
    image: '🧑‍💼',
    manifesto: 'Economic transformation through industrialization, youth empowerment, and infrastructure development across all geopolitical zones.'
  },
  {
    id: 'pres-2',
    name: 'Dr. Amina Ibrahim',
    party: "People's Democratic Party",
    partyAbbr: 'PDP',
    position: 'President',
    image: '👩‍💼',
    manifesto: 'Education reform, healthcare accessibility, and agricultural revolution to achieve food security and reduce poverty.'
  },
  {
    id: 'pres-3',
    name: 'Barr. Emmanuel Nnamdi',
    party: 'Labour Party',
    partyAbbr: 'LP',
    position: 'President',
    image: '👨‍⚖️',
    manifesto: 'Digital economy transformation, anti-corruption crusade, and restructuring for true federalism and regional development.'
  },
  {
    id: 'pres-4',
    name: 'Hajiya Fatima Bello',
    party: 'New Nigeria People\'s Party',
    partyAbbr: 'NNPP',
    position: 'President',
    image: '👩‍🏫',
    manifesto: 'Social welfare programs, women empowerment, and comprehensive security reform to tackle insurgency and banditry.'
  },
  // Gubernatorial Candidates
  {
    id: 'gov-1',
    name: 'Hon. Chukwuemeka Eze',
    party: 'All Progressives Congress',
    partyAbbr: 'APC',
    position: 'Governor',
    image: '🧑‍💼',
    manifesto: 'State-level economic reforms, urban renewal projects, and improved civil service welfare.'
  },
  {
    id: 'gov-2',
    name: 'Chief (Mrs.) Ngozi Okafor',
    party: "People's Democratic Party",
    partyAbbr: 'PDP',
    position: 'Governor',
    image: '👩‍💼',
    manifesto: 'Agricultural transformation, rural development, and youth employment schemes.'
  },
  {
    id: 'gov-3',
    name: 'Engr. Musa Abdullahi',
    party: 'Labour Party',
    partyAbbr: 'LP',
    position: 'Governor',
    image: '👷',
    manifesto: 'Infrastructure development, technology hubs, and transparent governance.'
  },
  // Senatorial Candidates
  {
    id: 'sen-1',
    name: 'Sen. Oluwaseun Adeyemi',
    party: 'All Progressives Congress',
    partyAbbr: 'APC',
    position: 'Senator',
    image: '🧑‍💼',
    manifesto: 'Legislative reforms for economic growth and constituency development projects.'
  },
  {
    id: 'sen-2',
    name: 'Dr. Hauwa Garba',
    party: "People's Democratic Party",
    partyAbbr: 'PDP',
    position: 'Senator',
    image: '👩‍⚕️',
    manifesto: 'Healthcare legislation, education bills, and women representation in governance.'
  },
  {
    id: 'sen-3',
    name: 'Alh. Yakubu Sani',
    party: 'Labour Party',
    partyAbbr: 'LP',
    position: 'Senator',
    image: '👨‍🎓',
    manifesto: 'Electoral reforms, anti-corruption bills, and equitable resource distribution.'
  }
];

export const elections = [
  {
    id: 'election-1',
    title: '2026 Presidential Election',
    position: 'President',
    startDate: '2026-02-25',
    endDate: '2026-02-25',
    status: 'active' as const,
    candidates: ['pres-1', 'pres-2', 'pres-3', 'pres-4']
  },
  {
    id: 'election-2',
    title: '2026 Gubernatorial Election',
    position: 'Governor',
    startDate: '2026-03-11',
    endDate: '2026-03-11',
    status: 'active' as const,
    candidates: ['gov-1', 'gov-2', 'gov-3']
  },
  {
    id: 'election-3',
    title: '2026 Senatorial Election',
    position: 'Senator',
    startDate: '2026-03-11',
    endDate: '2026-03-11',
    status: 'active' as const,
    candidates: ['sen-1', 'sen-2', 'sen-3']
  }
];

export const getPartyColor = (partyAbbr: string): string => {
  const colors: Record<string, string> = {
    'APC': 'bg-blue-600',
    'PDP': 'bg-red-600',
    'LP': 'bg-green-600',
    'NNPP': 'bg-orange-600'
  };
  return colors[partyAbbr] || 'bg-gray-600';
};

export const getPartyBorderColor = (partyAbbr: string): string => {
  const colors: Record<string, string> = {
    'APC': 'border-blue-600',
    'PDP': 'border-red-600',
    'LP': 'border-green-600',
    'NNPP': 'border-orange-600'
  };
  return colors[partyAbbr] || 'border-gray-600';
};
