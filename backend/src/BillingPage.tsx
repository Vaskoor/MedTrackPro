import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { format } from 'date-fns';
import { CreditCard } from 'lucide-react';

export default function BillingPage() {
  const { data: bills, refetch } = useQuery({
    queryKey: ['billing'],
    queryFn: () => api.get('/billing').then(res => res.data),
  });

  const payBill = async (billId: string) => {
    // Simulate Stripe payment
    await api.post(`/billing/${billId}/pay`, { method: 'stripe' });
    refetch();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Billing & Payments</h1>
      <div className="space-y-4">
        {bills?.map((bill: any) => (
          <div key={bill.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{bill.description}</p>
                <p className="text-sm text-gray-600">Due: {format(new Date(bill.dueDate), 'PPP')}</p>
                <p className="text-xl font-bold mt-2">${bill.amount}</p>
              </div>
              <div>
                {bill.status === 'PAID' ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Paid</span>
                ) : (
                  <button
                    onClick={() => payBill(bill.id)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    <CreditCard size={16} /> Pay Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {(!bills || bills.length === 0) && <p>No bills.</p>}
      </div>
    </div>
  );
}