# Electron Detection Features

This document explains how to detect if NetFast is running inside Electron and how to use the provided utilities.

## Features

### 1. Automatic Detection
- The app automatically detects if it's running in Electron or browser
- Logs the status to console on app startup
- Shows a visual indicator in the header

### 2. Utility Functions

#### `isElectron()`
Returns `true` if running in Electron, `false` if in browser.

```typescript
import { isElectron } from '@/lib/utils';

if (isElectron()) {
  console.log('Running in Electron');
} else {
  console.log('Running in browser');
}
```

#### `getElectronPlatform()`
Returns the platform information (win32, darwin, linux) or `null` if not in Electron.

```typescript
import { getElectronPlatform } from '@/lib/utils';

const platform = getElectronPlatform();
// Returns: 'win32', 'darwin', 'linux', or null
```

#### `logElectronStatus()`
Logs the current environment status to console.

```typescript
import { logElectronStatus } from '@/lib/utils';

logElectronStatus();
// Console output: "🚀 NetFast is running in Electron on win32" or "🌐 NetFast is running in the browser"
```

### 3. React Hook

#### `useElectron()`
A React hook that provides Electron status and platform information.

```typescript
import { useElectron } from '@/hooks/useElectron';

const MyComponent = () => {
  const { isElectron, platform, isLoading, isWindows, isMac, isLinux } = useElectron();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isElectron ? (
        <p>Running in Electron on {platform}</p>
      ) : (
        <p>Running in browser</p>
      )}
    </div>
  );
};
```

### 4. Components

#### `ElectronStatus`
A badge component that shows the current environment.

```typescript
import ElectronStatus from '@/components/ElectronStatus';

// In your component
<ElectronStatus />
// Shows: "Electron (win32)" or "Browser"
```

#### `ElectronDemo`
A demo component that showcases all Electron detection features.

```typescript
import ElectronDemo from '@/components/ElectronDemo';

// In your component
<ElectronDemo />
```

## Usage Examples

### Conditional Rendering
```typescript
import { isElectron } from '@/lib/utils';

const MyComponent = () => {
  return (
    <div>
      {isElectron() ? (
        <ElectronOnlyFeature />
      ) : (
        <BrowserOnlyFeature />
      )}
    </div>
  );
};
```

### Platform-Specific Features
```typescript
import { useElectron } from '@/hooks/useElectron';

const PlatformSpecificComponent = () => {
  const { isWindows, isMac, isLinux } = useElectron();

  return (
    <div>
      {isWindows && <WindowsSpecificUI />}
      {isMac && <MacSpecificUI />}
      {isLinux && <LinuxSpecificUI />}
    </div>
  );
};
```

### Debugging
```typescript
import { logElectronStatus } from '@/lib/utils';

// Add this to any component for debugging
useEffect(() => {
  logElectronStatus();
}, []);
```

## How It Works

1. **Detection Method**: Checks for the presence of `window.electronAPI` which is exposed by the Electron preload script
2. **Platform Info**: Gets platform information from the Electron main process via the preload script
3. **Visual Indicators**: Shows badges and icons to indicate the current environment
4. **Console Logging**: Provides detailed logging for debugging purposes

## Testing

- **Browser**: Open the app in any web browser
- **Electron**: Run the Electron app using `npm run electron` or the appropriate command

The detection will automatically work in both environments and provide appropriate feedback. 