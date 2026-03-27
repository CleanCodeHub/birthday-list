import { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { api } from '../lib/api';
import { useLanguage } from '../i18n/LanguageContext';

interface AdminLoginProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminLogin({ onClose, onSuccess }: AdminLoginProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await api.login(email, password);

      if (result.error) {
        setError('Invalid credentials');
        setIsSubmitting(false);
        return;
      }

      onSuccess();
    } catch (err) {
      setError('Invalid credentials');
      console.error(err);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-red-500 to-orange-600 p-3 rounded-xl">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{t.login.title}</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              {t.login.email}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder={t.login.emailPlaceholder}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              {t.login.password}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder={t.login.password}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-red-600 hover:to-orange-700 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {isSubmitting ? t.login.loggingIn : t.login.login}
          </button>
        </form>
      </div>
    </div>
  );
}
