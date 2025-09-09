import React, { createContext, useContext, useState, useEffect } from 'react';
import { Interview } from '@/types';
import { interviewsService } from '../services/interviews';
import { useAuth } from './AuthContext';

interface InterviewContextType {
  interviews: Interview[];
  selectedInterview: Interview | null;
  loading: boolean;
  setSelectedInterview: (interview: Interview | null) => void;
  createInterview: (jobName: string) => Promise<string>;
  updateInterview: (id: string, updates: Partial<Interview>) => Promise<void>;
  getInterview: (id: string) => Interview | undefined;
  loadInterviews: () => Promise<void>;
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
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createInterview = async (_jobName: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    const newInterview = await interviewsService.createInterview({
      user: user,
      status: 'preference_interview',
      created_at: new Date().toISOString(),
    });

    setInterviews(prev => [...prev, newInterview]);
    return newInterview.id;
  };

  const updateInterview = async (id: string, updates: Partial<Interview>): Promise<void> => {
    const updatedInterview = await interviewsService.updateInterview({
      id,
      ...updates,
      last_update: new Date().toISOString(),
    });

    setInterviews(prev =>
      prev.map(interview =>
        interview.id === id ? updatedInterview : interview
      )
    );
  };

  const getInterview = (id: string): Interview | undefined => {
    return interviews.find(interview => interview.id === id);
  };

  const loadInterviews = async (): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await interviewsService.getInterviews();
      setInterviews(data);
    } catch (error) {
      console.error('Failed to load interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadInterviews();
    } else {
      setInterviews([]);
      setSelectedInterview(null);
    }
  }, [user]);

  const value = {
    interviews,
    selectedInterview,
    loading,
    setSelectedInterview,
    createInterview,
    updateInterview,
    getInterview,
    loadInterviews,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}