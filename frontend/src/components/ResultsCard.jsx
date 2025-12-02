const Card = ({ title, value, unit, color }) => (
  <div className={`p-6 rounded-xl shadow-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm transform transition hover:scale-105`}>
    <h3 className="text-slate-400 text-sm uppercase tracking-wider font-semibold">{title}</h3>
    <div className={`mt-2 text-4xl font-bold ${color}`}>
      {value} <span className="text-xl text-slate-500">{unit}</span>
    </div>
  </div>
);

export default function ResultCards({ kwh, bill }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card 
        title="Predicted Consumption" 
        value={kwh} 
        unit="kWh" 
        color="text-cyan-400" 
      />
      <Card 
        title="Estimated Cost" 
        value={`₱ ${bill.toLocaleString()}`} 
        unit="" 
        color="text-emerald-400" 
      />
    </div>
  );
}