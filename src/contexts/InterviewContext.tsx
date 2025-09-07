import React, { createContext, useContext, useState, useEffect } from 'react';
import { Interview } from '@/types';

interface InterviewContextType {
  interviews: Interview[];
  selectedInterview: Interview | null;
  setSelectedInterview: (interview: Interview | null) => void;
  createInterview: (jobName: string) => string;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  getInterview: (id: string) => Interview | undefined;
}

const InterviewContext = createContext<InterviewContextType | undefined>(
  undefined
);

export function useInterview() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );

  useEffect(() => {
    const savedInterviews = localStorage.getItem('interviews');
    if (savedInterviews) {
      const parsed = JSON.parse(savedInterviews);
      setInterviews(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('interviews', JSON.stringify(interviews));
  }, [interviews]);

  const createInterview = (jobName: string): string => {
    const newInterview: Interview = {
      id: Date.now().toString(),
      user: { id: '1', name: 'Demo User', email: 'demo@example.com' },
      job: { id: Date.now().toString(), name: jobName },
      skills: [],
      vacancies: [],
      courses: [],
      status: 'preference_interview',
      created_at: new Date().toISOString(),
    };

    setInterviews(prev => [...prev, newInterview]);
    return newInterview.id;
  };

  const updateInterview = (id: string, updates: Partial<Interview>) => {
    setInterviews(prev =>
      prev.map(interview =>
        interview.id === id ? { ...interview, ...updates } : interview
      )
    );
  };

  const getInterview = (id: string): Interview | undefined => {
    return interviews.find(interview => interview.id === id);
  };

  const value = {
    interviews,
    selectedInterview,
    setSelectedInterview,
    createInterview,
    updateInterview,
    getInterview,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}
