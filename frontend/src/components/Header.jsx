import React from 'react';
import { HeartPulse } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-800 shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <HeartPulse className="h-8 w-8 text-cyan-400 mr-2" />
          <h1 className="text-xl font-bold text-white">CTG Monitor</h1>
        </div>
        <div>
          <span className="text-gray-400">Task 06</span>
        </div>
      </nav>
    </header>
  );
};

export default Header;
