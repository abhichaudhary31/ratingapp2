
import React from 'react';

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-1.383-.597 15.25 15.25 0 0 1-4.244-3.17c-2.78-2.589-3.797-6.246-3.797-8.91C2.25 5.052 4.026 3 6.364 3c1.614 0 3.076.623 4.136 1.649.333-.332.68-.64 1.04-.928A5.196 5.196 0 0 1 17.636 3c2.338 0 4.114 2.052 4.114 4.862 0 2.664-1.017 6.321-3.797 8.91a15.25 15.25 0 0 1-4.244 3.17 15.247 15.247 0 0 1-1.383.597l-.022.012-.007.003Z" />
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-4">
        <HeartIcon className="w-10 h-10 text-red-500 animate-pulse" />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-fuchsia-500">
          Love-Graph
        </h1>
        <HeartIcon className="w-10 h-10 text-red-500 animate-pulse" />
      </div>
      <p className="mt-2 text-lg text-gray-400">Your Shared Emotional Journey</p>
    </header>
  );
};

export default Header;
