import { useState } from 'react';

export default function EnergyForm({ onPredict, isLoading }) {
  const [formData, setFormData] = useState({
    Hour: 12,
    Temperature: 25,
    Machine_Status: 'Running'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onPredict(formData);
  };

  const statusOptions = ['Off', 'Idle', 'Running'];

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        ⚙️ Machine Control Panel
      </h2>

      {/* Hour Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Hour of Day: <span className="text-cyan-400 font-bold">{formData.Hour}:00</span>
        </label>
        <input 
          type="range" min="0" max="23" 
          value={formData.Hour}
          onChange={(e) => setFormData({...formData, Hour: parseInt(e.target.value)})}
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Midnight</span>
          <span>Noon</span>
          <span>Midnight</span>
        </div>
      </div>

      {/* Temperature Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Factory Temperature (°C)
        </label>
        <input 
          type="number" 
          value={formData.Temperature}
          onChange={(e) => setFormData({...formData, Temperature: parseFloat(e.target.value)})}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
        />
      </div>

      {/* Status Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-300 mb-2">Machine Status</label>
        <div className="flex gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFormData({...formData, Machine_Status: status})}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                formData.Machine_Status === status
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg transform transition active:scale-95 disabled:opacity-50"
      >
        {isLoading ? 'Calculating...' : '🔮 Predict Energy Usage'}
      </button>
    </form>
  );
}