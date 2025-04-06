import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../storage/authStorage.ts';
import { LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import * as api from '../lib/api';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userData = isLogin
        ? await api.login(email, password)
        : await api.register(email, password);
      
      setUser(userData);
      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md"
    >
      <div className="glass p-8 rounded-2xl shadow-xl">
        <motion.h2 
          className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {isLogin ? 'Добро пожаловать' : 'Зарегистрировать аккаунт'}
        </motion.h2>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className="w-full button-gradient py-3 px-4 rounded-lg text-white font-medium shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLogin ? (
              <>
                <LogIn className="w-5 h-5" />
                <span>Войти</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Зарегестрироваться</span>
              </>
            )}
          </motion.button>
        </form>

        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline transition-all duration-200"
          >
            {isLogin
              ? "Нет аккаунта? Зарегестрироваться"
              : 'Уже есть аккаунт? Войти'}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}