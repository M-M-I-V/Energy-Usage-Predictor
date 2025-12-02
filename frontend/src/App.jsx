import { useState, useEffect } from 'react';
import axios from 'axios';
import EnergyForm from './components/EnergyForm';
import ResultsCards from './components/ResultsCard';
import HistoryChart from './components/HistoryChart';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('Checking...');

  // Check if Backend is alive on load
  useEffect(() => {
    axios.get('/api/health')
      .then(() => setServerStatus('🟢 Online'))
      .catch(() => setServerStatus('🔴 Offline'));
  }, []);

  const handlePredict = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/predict', formData);
      const data = response.data;

      // Update current result
      setPrediction({
        kwh: data.predicted_energy_kwh,
        bill: data.estimated_bill
      });

      // Add to history for the chart
      setHistory(prev => [...prev, {
        kwh: data.predicted_energy_kwh,
        bill: data.estimated_bill,
        time: new Date().toLocaleTimeString()
      }]);

    } catch (error) {
      console.error("Error predicting:", error);
      alert("Failed to connect to the backend. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              ⚡ EnergyPredict AI
            </h1>
            <p className="text-slate-400 mt-1">Industrial consumption forecasting</p>
          </div>
          <div className="text-xs font-mono bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Server Status: {serverStatus}
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <EnergyForm onPredict={handlePredict} isLoading={loading} />
            
            <div className="mt-6 p-4 bg-slate-800 rounded-xl border border-slate-700 text-sm text-slate-400">
              <h4 className="font-bold text-slate-300 mb-2">ℹ️ How it works</h4>
              <p>This tool uses a Random Forest Regression model trained on 2,000 hours of synthetic factory data to estimate energy usage based on thermal dynamics and machine states.</p>
            </div>
          </div>

          {/* Right Column: Results & Chart */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Results */}
            {prediction && (
              <ResultsCards kwh={prediction.kwh} bill={prediction.bill} />
            )}

            {/* Chart */}
            <div className="flex-grow">
              <HistoryChart history={history} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;