import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { Profile } from './components/Profile';
import { useAuthStore } from './storage/authStorage.ts';
import { useThemeStore } from './storage/themeStorage.ts';
import { AnimatePresence } from 'framer-motion';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  const isDark = useThemeStore((state) => state.isDark);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <BrowserRouter>
      <div className={`min-h-screen ${isDark ? 'dark' : ''} animate-gradient bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex items-center justify-center p-4`}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<AuthForm />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;