import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function HistoryChart({ history }) {
  const data = {
    labels: history.map((_, i) => `Attempt ${i + 1}`),
    datasets: [
      {
        label: 'Predicted Cost (PHP)',
        data: history.map(h => h.bill),
        borderColor: '#10b981', // Emerald
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Energy (kWh)',
        data: history.map(h => h.kwh),
        borderColor: '#06b6d4', // Cyan
        backgroundColor: 'rgba(6, 182, 212, 0.5)',
        yAxisID: 'y1',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: { color: '#334155' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
      },
      x: {
        grid: { display: false }
      }
    },
    plugins: {
      legend: { labels: { color: '#cbd5e1' } }
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-xl h-full">
      <h3 className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-4">Session History</h3>
      {history.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <div className="h-64 flex items-center justify-center text-slate-500 italic">
          Make a prediction to see trends
        </div>
      )}
    </div>
  );
}