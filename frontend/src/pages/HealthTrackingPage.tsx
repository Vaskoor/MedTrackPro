import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { format } from 'date-fns';

export default function HealthTrackingPage() {
  const { data: healthLogs, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.get('/health').then(res => res.data),
  });

  if (isLoading) return <div className="text-center py-10">Loading health data...</div>;
  if (error) return <div className="text-red-500">Error loading health data</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Health Tracking</h1>
      <div className="space-y-4">
        {healthLogs?.map((log: any) => (
          <div key={log.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <p className="font-semibold">{format(new Date(log.date), 'PPP')}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
              <p>😴 Sleep: {log.sleepHours} hrs</p>
              <p>🏃 Activity: {log.activityMinutes} min</p>
              <p>💧 Water: {log.waterIntake} ml</p>
              <p>👣 Steps: {log.steps}</p>
            </div>
            {log.symptoms && <p className="text-sm text-gray-600 mt-2">Symptoms: {log.symptoms}</p>}
          </div>
        ))}
        {(!healthLogs || healthLogs.length === 0) && <p className="text-gray-500">No health logs yet.</p>}
      </div>
    </div>
  );
}