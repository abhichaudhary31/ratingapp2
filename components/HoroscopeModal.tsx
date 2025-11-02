import React from 'react';

interface HoroscopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  horoscopes: { stuti: string; abhishek: string } | null;
  isLoading: boolean;
  error: string | null;
}

const HoroscopeModal: React.FC<HoroscopeModalProps> = ({ isOpen, onClose, horoscopes, isLoading, error }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-8 rounded-2xl shadow-2xl border border-blue-500/50 w-full max-w-lg text-left transform transition-all duration-300 scale-95"
        style={{ transform: isOpen ? 'scale(1)' : 'scale(0.95)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-6">
          Tomorrow's Horoscope
        </h2>
        
        {isLoading && (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-gray-300">Consulting the stars...</p>
            </div>
        )}

        {error && (
            <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
                <p className="font-bold">Oops!</p>
                <p>{error}</p>
            </div>
        )}
        
        {horoscopes && !isLoading && !error && (
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-teal-400 mb-2">Stuti (Pisces ♓)</h3>
                    <p className="text-gray-300">{horoscopes.stuti}</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-fuchsia-400 mb-2">Abhishek (Leo ♌)</h3>
                    <p className="text-gray-300">{horoscopes.abhishek}</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default HoroscopeModal;