import { useState, useCallback } from "react";

export const useCertificate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCertificate = useCallback(async (assessmentId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assessmentId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate certificate');
      }
      
      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyCertificate = useCallback(async (verificationCode: string) => {
    try {
      const response = await fetch(`/api/certificates/verify/${verificationCode}`);
      if (!response.ok) {
        throw new Error('Invalid verification code');
      }
      return await response.json();
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    generateCertificate,
    verifyCertificate,
    isLoading,
    error
  };
};


