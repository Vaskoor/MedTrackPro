import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Home, Calendar, Pill, FileText, Activity, MessageSquare, User } from 'lucide-react';

interface LayoutProps { children: ReactNode; }

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = () => { logout(); navigate('/login'); };
  
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/prescriptions', icon: Pill, label: 'Prescriptions' },
    { path: '/medical-records', icon: FileText, label: 'Records' },
    { path: '/health', icon: Activity, label: 'Health Tracking' },
    { path: '/chat', icon: MessageSquare, label: 'Messages' },
  ];
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 text-xl font-bold border-b">MedTrack Pro</div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <item.icon size={20} /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center gap-2 mb-2"><User size={16} /> {user?.firstName} {user?.lastName}</div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600"><LogOut size={16} /> Logout</button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
