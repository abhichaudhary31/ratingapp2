import React from 'react';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  gifUrl?: string | null;
  title?: string;
  message?: string;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({ isOpen, onClose, gifUrl, title, message }) => {
  if (!isOpen || !gifUrl) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-8 rounded-2xl shadow-2xl border border-fuchsia-500/50 w-full max-w-md text-center transform transition-all duration-300 scale-95"
        style={{ transform: isOpen ? 'scale(1)' : 'scale(0.95)' }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
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

        <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-fuchsia-500 mb-4">
            {title}
            </h2>
            <img src={gifUrl} alt="Celebration" className="w-full max-w-xs mx-auto rounded-lg shadow-lg my-4" />
            <p className="text-gray-300 text-lg">
            {message}
            </p>
        </div>

      </div>
    </div>
  );
};

export default CelebrationModal;