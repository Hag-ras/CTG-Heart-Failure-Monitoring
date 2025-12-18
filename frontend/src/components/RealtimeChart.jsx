import React, { useState, useEffect } from 'react';
import { getProcessedSignal, getAvailableRecords } from '../services/api';
import LineChart from './LineChart';

const RealtimeChart = ({ onDataLoaded }) => {
  // State for the data
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  // State for the UI
  const [recordList, setRecordList] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('none');

  // --- NEW: Fetch the list of records when the component loads ---
  useEffect(() => {
    const fetchRecords = async () => {
      const records = await getAvailableRecords();
      setRecordList(records);
      if (records.length > 0) {
        setSelectedRecord(records[0]); // Set the first record as the default selection
      }
    };
    fetchRecords();
  }, []); // The empty array [] means this effect runs only once on mount

  const handleFetchData = async () => {
    if (!selectedRecord) {
      setError("Please select a record from the dropdown.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setOriginalData([]);
    setFilteredData([]);
    onDataLoaded({ zeros: [], poles: [] });

    try {
        const response = await getProcessedSignal(selectedRecord); // Use the selected record
        if (response) {
          setOriginalData(response.original_data);
          setFilteredData(response.filtered_data);
          setActiveChart('filtered');
          onDataLoaded({ zeros: response.zeros, poles: response.poles });
        } else {
          throw new Error('No response from server.');
        }
    } catch (err) {
        setError('Failed to fetch data. Is the backend server running correctly? Check terminal for errors.');
    } finally {
        setIsLoading(false);
    }
  };

  const chartData = activeChart === 'original' ? originalData : filteredData;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-cyan-300">Fetal Heart Rate (FHR)</h2>
        {filteredData.length > 0 && (
            <div className="flex gap-2">
                <button onClick={() => setActiveChart('original')} className={`px-3 py-1 text-sm rounded ${activeChart === 'original' ? 'bg-cyan-600' : 'bg-gray-600'}`}>Original</button>
                <button onClick={() => setActiveChart('filtered')} className={`px-3 py-1 text-sm rounded ${activeChart === 'filtered' ? 'bg-cyan-600' : 'bg-gray-600'}`}>Filtered</button>
            </div>
        )}
      </div>
      
      <div className="w-full h-96 bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
        {isLoading && <p className="text-gray-400">Loading data for {selectedRecord}...</p>}
        {error && <p className="text-red-400 px-4">{error}</p>}
        {!isLoading && !error && chartData.length === 0 && (
          <p className="text-gray-400">Select a record and click the button to fetch data.</p>
        )}
        {chartData.length > 0 && <LineChart data={chartData} />}
      </div>

      {/* --- Controls with Dropdown --- */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <select
          value={selectedRecord}
          onChange={(e) => setSelectedRecord(e.target.value)}
          className="bg-gray-600 border border-gray-500 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5"
          disabled={isLoading}
        >
          {recordList.length === 0 ? (
            <option>Loading records...</option>
          ) : (
            recordList.map(record => <option key={record} value={record}>{record}</option>)
          )}
        </select>

        <button 
          onClick={handleFetchData}
          disabled={isLoading || !selectedRecord}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : `Fetch and Process Record`}
        </button>
      </div>
    </div>
  );
};

export default RealtimeChart;
