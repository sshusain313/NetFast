import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Check if the app is running inside Electron
 * @returns boolean indicating if running in Electron
 */
export function isElectron(): boolean {
  return !!(window as any).electronAPI;
}

/**
 * Get Electron platform information
 * @returns platform info or null if not in Electron
 */
export function getElectronPlatform(): string | null {
  if (isElectron()) {
    return (window as any).electronAPI.platform;
  }
  return null;
}

/**
 * Log or show a message indicating Electron status
 */
export function logElectronStatus(): void {
  if (isElectron()) {
    const platform = getElectronPlatform();
    const message = `🚀 NetFast is running in Electron on ${platform}`;
    
    // Log to console
    console.log(message);
    
    // Show alert (optional - you can remove this if you don't want alerts)
    // alert(message);
    
    // You could also use a toast notification here
    // toast.success(message);
  } else {
    console.log('🌐 NetFast is running in the browser');
  }
}
