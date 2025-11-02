import React, { useState, useEffect, useRef } from 'react';
import { EMOJI_MAP } from '../constants';

interface RatingInputProps {
  personName: string;
  personKey: 'person1' | 'person2';
  onSave: (person: 'person1' | 'person2', rating: number, note: string) => void;
  color: 'teal' | 'fuchsia';
  initialRating?: number;
  initialNote?: string;
}

const RatingInput: React.FC<RatingInputProps> = ({ personName, personKey, onSave, color, initialRating, initialNote }) => {
  type Status = 'idle' | 'pending' | 'saved';

  const [rating, setRating] = useState(initialRating !== undefined ? initialRating : 0);
  const [note, setNote] = useState(initialNote || '');
  const [status, setStatus] = useState<Status>(initialRating !== undefined ? 'saved' : 'idle');
  const [countdown, setCountdown] = useState(60);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingRatingRef = useRef(0);
  const pendingNoteRef = useRef('');

  // Effect to sync the component's state with the initialRating prop from Firebase.
  useEffect(() => {
    // If a submission is in progress for this component, ignore prop changes. The real-time
    // listener will eventually update the prop again and this effect will set the final 'saved' state.
    if (status === 'pending') {
      return;
    }

    const isAlreadySaved = initialRating !== undefined;
    setRating(isAlreadySaved ? initialRating : 0);
    setNote(initialNote || '');
    setStatus(isAlreadySaved ? 'saved' : 'idle');

    // Clean up timers if the rating was already saved or component is reset
    if (isAlreadySaved) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [initialRating, initialNote]); // Only depends on the prop from parent, not local status.

  // General cleanup effect for component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status !== 'idle') return;
    setRating(Number(e.target.value));
  };
  
  const handleSave = () => {
    if (status !== 'idle') return;

    // Store the rating that will be saved after the delay
    pendingRatingRef.current = rating;
    pendingNoteRef.current = note;
    
    setStatus('pending');
    setCountdown(60);
    
    // Visually reset the component to its default state
    setRating(0);
    setNote('');

    // Start countdown timer for UI
    intervalRef.current = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Set timer to actually save the data after 1 minute
    timeoutRef.current = setTimeout(() => {
      onSave(personKey, pendingRatingRef.current, pendingNoteRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }, 60000); // 1 minute
  };
  
  const handleEdit = () => {
    setStatus('idle');
  };

  const getButtonText = () => {
    switch (status) {
      case 'idle':
        return `Save Rating (${rating})`;
      case 'pending':
        return `Submitting in ${countdown}s...`;
      // 'saved' is now handled by different JSX
      default:
        return 'Save Rating';
    }
  };

  const gradientClass = color === 'teal' 
    ? 'from-teal-500 to-cyan-500' 
    : 'from-fuchsia-600 to-purple-600';

  const accentColorClass = color === 'teal' ? 'accent-teal-400' : 'accent-fuchsia-500';
  const ringColorClass = color === 'teal' ? 'focus:ring-teal-500' : 'focus:ring-fuchsia-500';
  const textColorClass = color === 'teal' ? 'text-teal-400' : 'text-fuchsia-400';
  
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 flex flex-col items-center">
      <h3 className={`text-xl font-bold ${textColorClass}`}>{personName}'s Rating</h3>
      <p className="text-sm text-gray-400 mb-4">How are you feeling today?</p>
      
      <div className="text-6xl sm:text-7xl my-4 transition-transform duration-300 ease-in-out transform hover:scale-125">
        {EMOJI_MAP[rating]}
      </div>

      <div className="w-full px-2">
        <input
          type="range"
          min="-5"
          max="5"
          step="1"
          value={rating}
          onChange={handleRatingChange}
          disabled={status !== 'idle'}
          className={`w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer ${accentColorClass} disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        <div className="flex justify-between text-xs text-gray-500 w-full mt-2">
          <span>-5</span>
          <span>0</span>
          <span>5</span>
        </div>
      </div>
      
      <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={status !== 'idle'}
          placeholder="Add a note about your day..."
          rows={3}
          className={`mt-6 w-full bg-gray-700 rounded-lg p-3 text-sm text-gray-300 placeholder-gray-500 focus:ring-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${ringColorClass}`}
        />

      {status === 'saved' ? (
        <div className="mt-6 w-full flex flex-col items-center space-y-4">
            <p className="text-gray-300">Today's rating submitted!</p>
            <button
                onClick={handleEdit}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${ringColorClass}`}
            >
                Edit Rating
            </button>
        </div>
      ) : (
        <button
            onClick={handleSave}
            disabled={status === 'pending'}
            className={`mt-6 w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r ${gradientClass} ${ringColorClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800`}
        >
            {getButtonText()}
        </button>
      )}
    </div>
  );
};

export default RatingInput;