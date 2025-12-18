import React, { useState } from 'react'; // Add useState here
import Header from './components/Header';
import Footer from './components/Footer';
import RealtimeChart from './components/RealtimeChart';
import ZPlane from './components/ZPlane';

function App() {
  // State to hold the filter coefficients
  const [filterCoeffs, setFilterCoeffs] = useState({ zeros: [], poles: [] });

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-cyan-400">
          Realtime Digital Filter Design
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-800 p-4 rounded-lg shadow-lg">
            {/* Pass the setter function to the chart component */}
            <RealtimeChart onDataLoaded={setFilterCoeffs} />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            {/* Pass the poles and zeros to the ZPlane component */}
            <ZPlane poles={filterCoeffs.poles} zeros={filterCoeffs.zeros} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
