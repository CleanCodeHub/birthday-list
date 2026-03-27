import { useState, useEffect } from 'react';
import { Users, Baby, MessageSquare, CreditCard as Edit2, Trash2, Save, X, LogOut, Cake } from 'lucide-react';
import { RSVP, api } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';

interface AdminPanelProps {
  rsvps: RSVP[];
  onUpdate: () => void;
  onLogout: () => void;
}

export function AdminPanel({ rsvps, onUpdate, onLogout }: AdminPanelProps) {
  const { t } = useLanguage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', attending: true, adults: 0, kids: 0, comment: '' });
  const [birthdayPersonName, setBirthdayPersonName] = useState('');
  const [isEditingBirthday, setIsEditingBirthday] = useState(false);
  const attendingRsvps = rsvps.filter(r => r.attending);
  const notAttendingRsvps = rsvps.filter(r => !r.attending);
  const totalAdults = attendingRsvps.reduce((sum, rsvp) => sum + rsvp.adults, 0);
  const totalKids = attendingRsvps.reduce((sum, rsvp) => sum + rsvp.kids, 0);
  const totalGuests = totalAdults + totalKids;

  useEffect(() => {
    loadBirthdayInfo();
  }, []);

  const loadBirthdayInfo = async () => {
    try {
      const info = await api.getBirthdayInfo();
      if (info) {
        setBirthdayPersonName(info.birthday_person_name);
      }
    } catch (err) {
      console.error('Failed to load birthday info', err);
    }
  };

  const handleSaveBirthdayName = async () => {
    try {
      await api.updateBirthdayInfo(birthdayPersonName);
      setIsEditingBirthday(false);
      onUpdate();
    } catch (err) {
      console.error('Failed to update birthday name', err);
    }
  };

  const handleEdit = (rsvp: RSVP) => {
    setEditingId(rsvp.id);
    setEditForm({
      name: rsvp.name,
      attending: rsvp.attending,
      adults: rsvp.adults,
      kids: rsvp.kids,
      comment: rsvp.comment || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', attending: true, adults: 0, kids: 0, comment: '' });
  };

  const handleSave = async (id: string) => {
    try {
      await api.updateRsvp(id, {
        name: editForm.name,
        attending: editForm.attending,
        adults: editForm.attending ? editForm.adults : 0,
        kids: editForm.attending ? editForm.kids : 0,
        comment: editForm.comment || null,
      });
      setEditingId(null);
      onUpdate();
    } catch (err) {
      console.error('Failed to update RSVP', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this RSVP?')) return;

    try {
      await api.deleteRsvp(id);
      onUpdate();
    } catch (err) {
      console.error('Failed to delete RSVP', err);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm(t.admin.confirmDeleteAll)) return;
    if (!confirm(t.admin.confirmDeleteAll)) return;

    try {
      await api.deleteAllRsvps();
      onUpdate();
    } catch (err) {
      console.error('Failed to delete all RSVPs', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <Lock className="w-6 h-6" />
          <h2 className="text-2xl font-bold">{t.admin.dashboard}</h2>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all"
        >
          <LogOut className="w-4 h-4" />
          {t.admin.logout}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Cake className="w-6 h-6 text-pink-500" />
          <h3 className="text-xl font-bold text-gray-800">{t.admin.birthdayPerson}</h3>
        </div>
        {isEditingBirthday ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={birthdayPersonName}
              onChange={(e) => setBirthdayPersonName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter birthday person's name"
            />
            <button
              onClick={handleSaveBirthdayName}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              {t.admin.save}
            </button>
            <button
              onClick={() => {
                setIsEditingBirthday(false);
                loadBirthdayInfo();
              }}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              {t.admin.cancel}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-pink-600">{birthdayPersonName}</p>
            <button
              onClick={() => setIsEditingBirthday(true)}
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              {t.admin.edit}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">{t.admin.totalGuests}</p>
              <p className="text-4xl font-bold">{totalGuests}</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">{t.admin.adults}</p>
              <p className="text-4xl font-bold">{totalAdults}</p>
            </div>
            <Users className="w-12 h-12 text-emerald-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium mb-1">{t.admin.kids}</p>
              <p className="text-4xl font-bold">{totalKids}</p>
            </div>
            <Baby className="w-12 h-12 text-amber-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Guest List</h2>
          {rsvps.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {t.admin.deleteAll}
            </button>
          )}
        </div>

        {rsvps.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No RSVPs yet.</p>
        ) : (
          <div className="space-y-4">
            {rsvps.map((rsvp) => (
              <div
                key={rsvp.id}
                className="border border-gray-200 rounded-xl p-5 hover:border-red-300 hover:shadow-md transition-all"
              >
                {editingId === rsvp.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Name"
                    />
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">{t.admin.attendingQuestion}</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setEditForm({ ...editForm, attending: true })}
                          className={`py-2 px-4 rounded-lg font-medium transition-all ${
                            editForm.attending
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {t.admin.yes}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditForm({ ...editForm, attending: false })}
                          className={`py-2 px-4 rounded-lg font-medium transition-all ${
                            !editForm.attending
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {t.admin.no}
                        </button>
                      </div>
                    </div>
                    {editForm.attending && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">{t.admin.adults}</label>
                          <input
                            type="number"
                            min="0"
                            value={editForm.adults}
                            onChange={(e) =>
                              setEditForm({ ...editForm, adults: parseInt(e.target.value) || 0 })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">{t.admin.kids}</label>
                          <input
                            type="number"
                            min="0"
                            value={editForm.kids}
                            onChange={(e) =>
                              setEditForm({ ...editForm, kids: parseInt(e.target.value) || 0 })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                    <textarea
                      value={editForm.comment}
                      onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Comment"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(rsvp.id)}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        {t.admin.save}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        {t.admin.cancel}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{rsvp.name}</h3>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full font-medium text-sm ${
                          rsvp.attending
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {rsvp.attending ? t.admin.attending : t.admin.notAttending}
                        </span>
                      </div>
                      {rsvp.attending && (
                        <div className="flex gap-2">
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium text-sm">
                            {rsvp.adults} {rsvp.adults === 1 ? t.admin.adult : t.admin.adultsPlural}
                          </span>
                          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium text-sm">
                            {rsvp.kids} {rsvp.kids === 1 ? t.admin.kid : t.admin.kidsPlural}
                          </span>
                        </div>
                      )}
                    </div>

                    {rsvp.comment && (
                      <div className="flex gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg mb-3">
                        <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                        <p className="text-sm">{rsvp.comment}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(rsvp)}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        {t.admin.edit}
                      </button>
                      <button
                        onClick={() => handleDelete(rsvp.id)}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {t.admin.delete}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Lock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}
