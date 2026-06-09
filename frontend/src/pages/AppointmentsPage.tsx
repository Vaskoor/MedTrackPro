import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { format } from 'date-fns';

export default function AppointmentsPage() {
  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => api.get('/appointments').then(res => res.data),
  });

  if (isLoading) return <div className="text-center py-10">Loading appointments...</div>;
  if (error) return <div className="text-red-500">Error loading appointments</div>;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'SCHEDULED': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
      <div className="space-y-4">
        {appointments?.map((apt: any) => (
          <div key={apt.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">{format(new Date(apt.scheduledAt), 'PPP')}</p>
              <p className="text-sm text-gray-600">{format(new Date(apt.scheduledAt), 'p')} • {apt.type}</p>
              <p className="text-sm mt-1">{apt.notes}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
              {apt.status}
            </span>
          </div>
        ))}
        {(!appointments || appointments.length === 0) && (
          <p className="text-gray-500">No appointments found.</p>
        )}
      </div>
    </div>
  );
}