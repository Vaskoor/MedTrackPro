import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { format } from 'date-fns';
import { FileText, Download } from 'lucide-react';

export default function MedicalRecordsPage() {
  const { data: records, isLoading, error } = useQuery({
    queryKey: ['medical-records'],
    queryFn: () => api.get('/medical-records').then(res => res.data),
  });

  if (isLoading) return <div className="text-center py-10">Loading records...</div>;
  if (error) return <div className="text-red-500">Error loading records</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Medical Records</h1>
      <div className="grid gap-4">
        {records?.map((rec: any) => (
          <div key={rec.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-500" />
              <div>
                <p className="font-semibold">{rec.title}</p>
                <p className="text-sm text-gray-600">{rec.type} • {format(new Date(rec.date), 'PPP')}</p>
                <p className="text-sm">{rec.description}</p>
              </div>
            </div>
            {rec.fileUrl && (
              <a href={rec.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                <Download size={20} />
              </a>
            )}
          </div>
        ))}
        {(!records || records.length === 0) && <p className="text-gray-500">No medical records found.</p>}
      </div>
    </div>
  );
}