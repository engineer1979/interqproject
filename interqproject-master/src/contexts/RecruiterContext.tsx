import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Candidate, JobOpening, Interview, Offer } from '@/types/recruiter';

interface RecruiterState {
  jobs: JobOpening[];
  candidates: Candidate[];
  interviews: Interview[];
  offers: Offer[];
}

type RecruiterAction = 
  | { type: 'ADD_JOB'; payload: JobOpening }
  | { type: 'UPDATE_JOB'; payload: JobOpening }
  | { type: 'DELETE_JOB'; payload: number }
  | { type: 'SET_JOBS'; payload: JobOpening[] }
  | { type: 'ADD_CANDIDATE'; payload: Candidate }
  | { type: 'UPDATE_CANDIDATE'; payload: Candidate }
  | { type: 'DELETE_CANDIDATE'; payload: number }
  | { type: 'SET_CANDIDATES'; payload: Candidate[] }
  | { type: 'ADD_INTERVIEW'; payload: Interview }
  | { type: 'UPDATE_INTERVIEW'; payload: Interview }
  | { type: 'DELETE_INTERVIEW'; payload: number }
  | { type: 'ADD_OFFER'; payload: Offer }
  | { type: 'UPDATE_OFFER'; payload: Offer }
  | { type: 'DELETE_OFFER'; payload: number }
  | { type: 'UPDATE_SETTINGS'; payload: any };

const initialState: RecruiterState = {
  jobs: [
    { id: 1, title: 'Senior Frontend Developer', department: 'Engineering', location: 'Remote', salary: '$120k - $150k', type: 'Full-time', status: 'Open', postedDate: '2024-01-10', description: 'Looking for an experienced frontend developer...' },
    { id: 2, title: 'DevOps Engineer', department: 'Infrastructure', location: 'New York, NY', salary: '$130k - $160k', type: 'Full-time', status: 'Open', postedDate: '2024-01-12', description: 'Join our infrastructure team...' },
    { id: 3, title: 'Product Manager', department: 'Product', location: 'San Francisco, CA', salary: '$140k - $180k', type: 'Full-time', status: 'Open', postedDate: '2024-01-15', description: 'Lead product initiatives...' },
  ],
  candidates: [
    { id: 1, name: "Sarah Johnson", email: "sarah.j@email.com", phone: "+1234567890", stage: "Interviewed", rating: 4.8, appliedDate: "2024-01-15" },
    { id: 2, name: "Michael Chen", email: "m.chen@email.com", phone: "+1234567891", stage: "Offered", rating: 4.5, appliedDate: "2024-01-12" },
    { id: 3, name: "Emily Davis", email: "emily.d@email.com", phone: "+1234567892", stage: "Screened", rating: 4.2, appliedDate: "2024-01-18" },
    { id: 4, name: "James Wilson", email: "j.wilson@email.com", phone: "+1234567893", stage: "Applied", rating: 3.8, appliedDate: "2024-01-20" },
  ],
  interviews: [],
  offers: [],
  settings: {
    companyName: 'Acme Corporation',
    notifications: true,
    defaultTimeZone: 'America/New_York',
    interviewReminderDays: 2,
  },
};

const reducer = (state: RecruiterState, action: RecruiterAction): RecruiterState => {
  switch (action.type) {
    case 'ADD_JOB':
      return { ...state, jobs: [...state.jobs, action.payload] };
    case 'UPDATE_JOB':
      return { ...state, jobs: state.jobs.map(j => j.id === action.payload.id ? action.payload : j) };
    case 'DELETE_JOB':
      return { ...state, jobs: state.jobs.filter(j => j.id !== action.payload) };
    case 'SET_JOBS':
      return { ...state, jobs: action.payload };
    case 'ADD_CANDIDATE':
      return { ...state, candidates: [...state.candidates, action.payload] };
    case 'UPDATE_CANDIDATE':
      return { ...state, candidates: state.candidates.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CANDIDATE':
      return { ...state, candidates: state.candidates.filter(c => c.id !== action.payload) };
    case 'SET_CANDIDATES':
      return { ...state, candidates: action.payload };
    case 'ADD_INTERVIEW':
      return { ...state, interviews: [...state.interviews, action.payload] };
    case 'UPDATE_INTERVIEW':
      return { ...state, interviews: state.interviews.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'DELETE_INTERVIEW':
      return { ...state, interviews: state.interviews.filter(i => i.id !== action.payload) };
    case 'ADD_OFFER':
      return { ...state, offers: [...state.offers, action.payload] };
    case 'UPDATE_OFFER':
      return { ...state, offers: state.offers.map(o => o.id === action.payload.id ? action.payload : o) };
    case 'DELETE_OFFER':
      return { ...state, offers: state.offers.filter(o => o.id !== action.payload) };
    case 'UPDATE_SETTINGS':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const RecruiterContext = createContext<any>(null);

export const RecruiterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('recruiterData');
    if (saved) {
      dispatch({ type: 'SET_JOBS', payload: JSON.parse(saved).jobs || [] });
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('recruiterData', JSON.stringify(state));
  }, [state]);

  return (
    <RecruiterContext.Provider value={{ state, dispatch }}>
      {children}
    </RecruiterContext.Provider>
  );
};

export const useRecruiter = () => useContext(RecruiterContext);

