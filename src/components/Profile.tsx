import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../storage/authStorage.ts';
import { useThemeStore } from '../storage/themeStorage.ts';
import { LogOut, Moon, Sun, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from '../lib/api';

export function Profile() {
  const { user, setUser } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const newData = await api.getData();
      setData(newData);
    } catch (error) {
      console.error('Error fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    api.getProfile()
        .then((res) => {
          setUser(res.user);
        })
        .catch(() => {
          setUser(null);
          navigate('/');
        });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl"
    >
      <div className="glass p-8 rounded-2xl shadow-custom dark:shadow-white ">
        <div className="flex justify-between items-center mb-8">
          <motion.h2
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text"
          >
            Профиль
          </motion.h2>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors"
            >
              {isDark ? (
                <Sun className="w-6 h-6 text-yellow-400" />
              ) : (
                <Moon className="w-6 h-6 text-gray-600" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="button-gradient px-4 py-2 rounded-lg text-white flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Выход</span>
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 rounded-xl bg-white/10 dark:bg-gray-800/10"
        >
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Email: <span className="font-semibold">{user?.email}</span>
          </p>
        </motion.div>

        <div className="border-t border-gray-200/20 dark:border-gray-700/20 pt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Данные сервера с кэшированием
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchData}
              disabled={loading}
              className="button-gradient px-4 py-2 rounded-lg text-white flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Обновить</span>
            </motion.button>
          </div>
          
          <AnimatePresence mode="wait">
            {data ? (
              <motion.pre
                key="data"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-black/5 dark:bg-white/5 p-6 rounded-xl overflow-auto font-mono text-sm dark:text-white"
              >
                {JSON.stringify(data, null, 2)}
              </motion.pre>
            ) : (
              <motion.p
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-600 dark:text-gray-400 text-center py-8"
              >
                Нажми , чтобы обновить данные
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}