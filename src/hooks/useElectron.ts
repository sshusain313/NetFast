import { useState, useEffect } from 'react';
import { isElectron, getElectronPlatform } from '@/lib/utils';

export const useElectron = () => {
  const [isElectronApp, setIsElectronApp] = useState(false);
  const [platform, setPlatform] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkElectronStatus = () => {
      const electronStatus = isElectron();
      const platformInfo = getElectronPlatform();
      
      setIsElectronApp(electronStatus);
      setPlatform(platformInfo);
      setIsLoading(false);
    };

    checkElectronStatus();
  }, []);

  return {
    isElectron: isElectronApp,
    platform,
    isLoading,
    // Helper methods
    isWindows: platform === 'win32',
    isMac: platform === 'darwin',
    isLinux: platform === 'linux',
  };
};

export default useElectron; 