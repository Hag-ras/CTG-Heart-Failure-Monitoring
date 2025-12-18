import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Your FastAPI backend URL
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// +++ NEW FUNCTION +++
/**
 * Fetches the list of available record names from the backend.
 */
export const getAvailableRecords = async () => {
  try {
    const response = await api.get('/analysis/records');
    return response.data;
  } catch (error) {
    console.error("Error fetching available records:", error);
    return []; // Return empty list on error
  }
};


/**
 * Fetches processed signal data for a specific record.
 * --- MODIFIED to accept a recordName ---
 */
export const getProcessedSignal = async (recordName) => {
  try {
    // Pass the recordName as a query parameter
    const response = await api.post('/analysis/process-signal', null, { 
        params: { record_name: recordName } 
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching processed signal for ${recordName}:`, error);
    return null;
  }
};

export default api;
