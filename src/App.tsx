import { useEffect, useState } from 'react';
import { Cake } from 'lucide-react';
import { api, RSVP } from './lib/supabase';
import { RsvpForm } from './components/RsvpForm';
import { RsvpSummary } from './components/RsvpSummary';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';

function App() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const fetchRsvps = async () => {
    try {
      const data = await api.getRsvps();
      setRsvps(data);
    } catch (err) {
      console.error('Failed to fetch RSVPs', err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRsvps();

    api.checkSession().then((session) => {
      setIsAdmin(session.authenticated);
    });

    const interval = setInterval(fetchRsvps, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleCakeClick = () => {
    setClickCount((prev) => prev + 1);
    if (clickCount + 1 >= 5) {
      setShowAdminLogin(true);
      setClickCount(0);
    }
  };

  const handleAdminLogin = () => {
    setShowAdminLogin(false);
    setIsAdmin(true);
  };

  const handleLogout = async () => {
    await api.logout();
    setIsAdmin(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} onSuccess={handleAdminLogin} />
      )}

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={handleCakeClick}
              className="focus:outline-none transition-transform hover:scale-110"
              aria-label="Admin access"
            >
              <Cake className="w-12 h-12 text-emerald-600" />
            </button>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Birthday Party RSVP
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let us know if you're coming! We can't wait to celebrate together.
          </p>
        </div>

        {isAdmin ? (
          <div>
            {isLoading ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading RSVPs...</p>
                </div>
              </div>
            ) : (
              <AdminPanel rsvps={rsvps} onUpdate={fetchRsvps} onLogout={handleLogout} />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <RsvpForm onSuccess={fetchRsvps} />
            </div>

            <div>
              {isLoading ? (
                <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading RSVPs...</p>
                  </div>
                </div>
              ) : (
                <RsvpSummary rsvps={rsvps} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
