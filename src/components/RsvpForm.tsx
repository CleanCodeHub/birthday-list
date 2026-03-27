import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { api } from '../lib/supabase';

interface RsvpFormProps {
  onSuccess: () => void;
}

export function RsvpForm({ onSuccess }: RsvpFormProps) {
  const [name, setName] = useState('');
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (adults === 0 && kids === 0) {
      setError('Please specify at least one adult or kid attending');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await api.createRsvp({
        name: name.trim(),
        adults,
        kids,
        comment: comment.trim() || null,
      });

      if (result.error) {
        setError('Failed to submit RSVP. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setName('');
      setAdults(0);
      setKids(0);
      setComment('');
      onSuccess();
    } catch (err) {
      setError('Failed to submit RSVP. Please try again.');
      console.error(err);
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl">
          <UserPlus className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">RSVP to the Party</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
          Your Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          placeholder="Enter your name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="adults" className="block text-sm font-semibold text-gray-700 mb-2">
            Adults
          </label>
          <input
            type="number"
            id="adults"
            min="0"
            value={adults}
            onChange={(e) => setAdults(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="kids" className="block text-sm font-semibold text-gray-700 mb-2">
            Kids
          </label>
          <input
            type="number"
            id="kids"
            min="0"
            value={kids}
            onChange={(e) => setKids(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
          Comment (Optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
          placeholder="Any dietary restrictions, wishes, or messages..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-teal-700 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
      >
        {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
      </button>
    </form>
  );
}
