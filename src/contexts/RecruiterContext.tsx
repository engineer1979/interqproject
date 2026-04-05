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
  // Add more for candidates/interviews/offers...

const initialState: RecruiterState = {
  jobs: [],
  candidates: [
    { id: 1, name: "Sarah Johnson", stage: "Interviewed", rating: 4.8, appliedDate: "2024-01-15" },
    { id: 2, name: "Michael Chen", stage: "Offered", rating: 4.5, appliedDate: "2024-01-12" },
    { id: 3, name: "Emily Davis", stage: "Screened", rating: 4.2, appliedDate: "2024-01-18" },
    { id: 4, name: "James Wilson", stage: "Applied", rating: 3.8, appliedDate: "2024-01-20" },
  ],
  interviews: [],
  offers: [],
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

