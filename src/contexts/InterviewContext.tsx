import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Interview {
  id: string;
  role: string;
  status: 'in_progress' | 'completed';
  date: string;
  progress: number;
  currentStep: number;
  responses: Record<string, string>;
}

interface InterviewContextType {
  interviews: Interview[];
  selectedInterview: Interview | null;
  setSelectedInterview: (interview: Interview | null) => void;
  createInterview: (role: string) => string;
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
    } else {
      const mockInterviews: Interview[] = [
        {
          id: '1',
          role: 'ML-разработчик',
          status: 'completed',
          date: '2024-01-15',
          progress: 70,
          currentStep: 3,
          responses: {},
        },
        {
          id: '2',
          role: 'Frontend-разработчик',
          status: 'in_progress',
          date: '2024-01-20',
          progress: 40,
          currentStep: 2,
          responses: {},
        },
      ];
      setInterviews(mockInterviews);
      localStorage.setItem('interviews', JSON.stringify(mockInterviews));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('interviews', JSON.stringify(interviews));
  }, [interviews]);

  const createInterview = (role: string): string => {
    const newInterview: Interview = {
      id: Date.now().toString(),
      role,
      status: 'in_progress',
      date: new Date().toISOString().split('T')[0],
      progress: 0,
      currentStep: 1,
      responses: {},
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
