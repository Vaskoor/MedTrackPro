// frontend/src/pages/PrescriptionsPage.tsx
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { format } from 'date-fns';
import { Pill, Calendar, User, FileText } from 'lucide-react';

export default function PrescriptionsPage() {
  const { data: prescriptions, isLoading, error } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => api.get('/prescriptions').then(res => res.data),
  });

  if (isLoading) return <div className="text-center py-10">Loading prescriptions...</div>;
  if (error) return <div className="text-red-500">Error loading prescriptions</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Prescriptions</h1>
      <div className="space-y-6">
        {prescriptions?.map((pres: any) => (
          <div key={pres.id} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar size={14} /> {format(new Date(pres.date), 'PPP')}
                </p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm">
                Download PDF
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{pres.notes}</p>
            <h4 className="font-semibold mb-2 flex items-center gap-1">
              <Pill size={16} /> Medicines
            </h4>
            <div className="space-y-2">
              {pres.medicines?.map((med: any) => (
                <div key={med.id} className="border-l-4 border-blue-500 pl-3 py-1">
                  <p className="font-medium">{med.medicineName}</p>
                  <p className="text-sm text-gray-600">
                    {med.dosage} – {med.frequency} – Duration: {med.duration}
                  </p>
                  {med.instructions && <p className="text-xs text-gray-500 mt-1">💊 {med.instructions}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
        {(!prescriptions || prescriptions.length === 0) && (
          <p className="text-gray-500">No prescriptions found.</p>
        )}
      </div>
    </div>
  );
}