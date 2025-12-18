import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 mt-8 py-4">
      <div className="container mx-auto text-center text-sm text-gray-400">
        <p>&copy; {currentYear} CTG Heart Failure Monitoring Project. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

