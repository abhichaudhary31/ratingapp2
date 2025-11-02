import React from 'react';

interface GifModalProps {
  isOpen: boolean;
  onClose: () => void;
  gifUrl: string | null;
}

const GifModal: React.FC<GifModalProps> = ({ isOpen, onClose, gifUrl }) => {
  if (!isOpen || !gifUrl) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-800 p-2 rounded-lg shadow-2xl border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 text-white bg-gray-700 rounded-full h-8 w-8 flex items-center justify-center hover:bg-red-500 transition-colors z-10"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img src={gifUrl} alt="Celebration GIF" className="max-w-full max-h-[80vh] rounded-md" />
      </div>
    </div>
  );
};

export default GifModal;