
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type AIType = 'cv-optimization' | 'job-description' | 'interview-prep' | 'candidate-analysis' | 'job-matching' | 'general';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askAI = async (prompt: string, context?: string, type: AIType = 'general') => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('ai-assistant', {
        body: { prompt, context, type }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      setLoading(false);
      return data.response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  return { askAI, loading, error };
};
