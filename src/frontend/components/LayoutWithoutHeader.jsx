import React from 'react';
import Footer from './Footer';

const LayoutWithoutHeader = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Main content fills available space */}
      <main className="flex-grow-1 d-flex">
        {children}
          </main>
      {/* Reuse Footer Component */}
      <Footer />
    </div>
  );
};

export default LayoutWithoutHeader;