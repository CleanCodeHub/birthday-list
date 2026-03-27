import { Users, Baby, MessageSquare } from 'lucide-react';
import { RSVP } from '../lib/api';
import { useLanguage } from '../i18n/LanguageContext';

interface RsvpSummaryProps {
  rsvps: RSVP[];
}

export function RsvpSummary({ rsvps }: RsvpSummaryProps) {
  const { t } = useLanguage();
  const attendingRsvps = rsvps.filter(r => r.attending);
  const totalAdults = attendingRsvps.reduce((sum, rsvp) => sum + rsvp.adults, 0);
  const totalKids = attendingRsvps.reduce((sum, rsvp) => sum + rsvp.kids, 0);
  const totalGuests = totalAdults + totalKids;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">{t.summary.totalGuests}</p>
              <p className="text-4xl font-bold">{totalGuests}</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">{t.summary.adults}</p>
              <p className="text-4xl font-bold">{totalAdults}</p>
            </div>
            <Users className="w-12 h-12 text-emerald-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium mb-1">{t.summary.kids}</p>
              <p className="text-4xl font-bold">{totalKids}</p>
            </div>
            <Baby className="w-12 h-12 text-amber-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.summary.guestList}</h2>

        {rsvps.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{t.summary.noRsvps}</p>
        ) : (
          <div className="space-y-4">
            {rsvps.map((rsvp) => (
              <div
                key={rsvp.id}
                className={`border rounded-xl p-5 hover:shadow-md transition-all ${
                  rsvp.attending
                    ? 'border-gray-200 hover:border-emerald-300'
                    : 'border-gray-200 hover:border-red-300 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{rsvp.name}</h3>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full font-medium text-sm ${
                      rsvp.attending
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {rsvp.attending ? t.summary.attending : t.summary.notAttending}
                    </span>
                  </div>
                  {rsvp.attending && (
                    <div className="flex gap-4 text-sm">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                        {rsvp.adults} {rsvp.adults === 1 ? t.summary.adult : t.summary.adultsPlural}
                      </span>
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                        {rsvp.kids} {rsvp.kids === 1 ? t.summary.kid : t.summary.kidsPlural}
                      </span>
                    </div>
                  )}
                </div>

                {rsvp.comment && (
                  <div className="flex gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                    <p className="text-sm">{rsvp.comment}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
