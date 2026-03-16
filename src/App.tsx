/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppNavigator } from './navigation/AppNavigator';
import { ThemeProvider } from './context/ThemeContext';
import { UserProfileProvider } from './context/UserProfileContext';

export default function App() {
  return (
    <ThemeProvider>
      <UserProfileProvider>
        <div className="bg-bg-soft dark:bg-dark-bg-soft min-h-screen md:py-8 transition-colors duration-300">
          <AppNavigator />
        </div>
      </UserProfileProvider>
    </ThemeProvider>
  );
}
