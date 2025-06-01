
import { useState, useEffect } from 'react';

interface SpiritualSponsor {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  relationship: string;
  isActive: boolean;
}

interface ProgressReport {
  daysCompleted: number;
  totalDays: number;
  lastViolation?: Date;
  violationCount: number;
  strengthMoments: string[];
}

export const useAccountability = () => {
  const [sponsor, setSponsor] = useState<SpiritualSponsor | null>(null);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(typeof window !== 'undefined' && !!window.electronAPI);
    loadSponsor();
  }, []);

  const loadSponsor = () => {
    const savedSponsor = localStorage.getItem('spiritual_sponsor');
    if (savedSponsor) {
      setSponsor(JSON.parse(savedSponsor));
    }
  };

  const setSpiritualSponsor = (sponsorData: SpiritualSponsor) => {
    setSponsor(sponsorData);
    localStorage.setItem('spiritual_sponsor', JSON.stringify(sponsorData));
  };

  const removeSponsor = () => {
    setSponsor(null);
    localStorage.removeItem('spiritual_sponsor');
  };

  const notifyViolationAttempt = async (violationType: string) => {
    if (!sponsor || !isElectron) return;

    try {
      await window.electronAPI.notifySpiritualSponsor({
        sponsor,
        violationType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to notify spiritual sponsor:', error);
    }
  };

  const sendProgressReport = async (progress: ProgressReport) => {
    if (!sponsor || !isElectron) return;

    try {
      await window.electronAPI.sendProgressReport({
        sponsor,
        progress,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to send progress report:', error);
    }
  };

  return {
    sponsor,
    setSpiritualSponsor,
    removeSponsor,
    notifyViolationAttempt,
    sendProgressReport
  };
};
