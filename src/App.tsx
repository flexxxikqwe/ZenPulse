/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppNavigator } from './navigation/AppNavigator';
import { ThemeProvider } from './context/ThemeContext';
import { UserProfileProvider } from './context/UserProfileContext';
import { ToastProvider } from './components/ToastProvider';
import { useEffect } from 'react';

import { analytics } from './services/analyticsService';

export default function App() {
  useEffect(() => {
    analytics.trackEvent({ name: 'app_opened' });
  }, []);

  return (
    <ThemeProvider>
      <UserProfileProvider>
        <ToastProvider>
          <div className="bg-bg-soft dark:bg-dark-bg-soft min-h-screen md:py-8 transition-colors duration-300">
            <AppNavigator />
          </div>
        </ToastProvider>
      </UserProfileProvider>
    </ThemeProvider>
  );
}
