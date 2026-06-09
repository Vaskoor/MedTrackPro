import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { format } from 'date-fns';
import { FlaskRound as Flask } from 'lucide-react';

export default function LabTestsPage() {
  const { data: tests, refetch } = useQuery({
    queryKey: ['lab-tests'],
    queryFn: () => api.get('/lab-orders').then(res => res.data),
  });

  const requestTest = useMutation({
    mutationFn: (testName: string) => api.post('/lab-orders', { testName }),
    onSuccess: () => refetch(),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Laboratory Tests</h1>
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Test name (e.g., CBC, Lipid Profile)"
          id="testName"
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={() => {
            const input = document.getElementById('testName') as HTMLInputElement;
            requestTest.mutate(input.value);
            input.value = '';
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Request Test
        </button>
      </div>
      <div className="space-y-4">
        {tests?.map((test: any) => (
          <div key={test.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between">
            <div>
              <p className="font-semibold">{test.testName}</p>
              <p className="text-sm">Status: {test.status}</p>
              <p className="text-sm">Ordered: {format(new Date(test.orderedAt), 'PPP')}</p>
            </div>
            {test.resultUrl && (
              <a href={test.resultUrl} target="_blank" className="text-blue-600">
                View Results
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}