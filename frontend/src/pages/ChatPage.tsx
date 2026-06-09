// frontend/src/pages/ChatPage.tsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import io from 'socket.io-client';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

export default function ChatPage() {
  const { user, token } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);

  // Fetch list of doctors (for patient) or patients (for doctor)
  useEffect(() => {
    if (user?.role === 'PATIENT') {
      api.get('/doctors').then(res => setDoctors(res.data));
    } else if (user?.role === 'DOCTOR') {
      api.get('/patients').then(res => setDoctors(res.data)); // show patients as recipients
    }
  }, [user]);

  // Fetch conversation when doctor selected
  useEffect(() => {
    if (!selectedDoctorId) return;
    const fetchMessages = async () => {
      const res = await api.get(`/chat?with=${selectedDoctorId}`);
      setMessages(res.data);
    };
    fetchMessages();

    // Connect Socket.io
    const socketInstance = io('/'); // uses same origin, will be proxied
    setSocket(socketInstance);
    socketInstance.emit('join', { userId: user?.id });

    socketInstance.on('receiveMessage', (msg: Message) => {
      if (msg.senderId === selectedDoctorId || msg.receiverId === selectedDoctorId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => { socketInstance.disconnect(); };
  }, [selectedDoctorId, user?.id]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedDoctorId) return;
    const messageData = {
      receiverId: selectedDoctorId,
      content: newMessage,
    };
    const res = await api.post('/chat', messageData);
    const sentMsg = res.data;
    setMessages(prev => [...prev, sentMsg]);
    setNewMessage('');
    socket?.emit('sendMessage', sentMsg);
  };

  if (user?.role === 'PATIENT' && doctors.length === 0) {
    return <div className="p-6">No doctors available.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Sidebar – list of doctors/patients */}
      <div className="w-80 border-r dark:border-gray-700 p-4">
        <h2 className="font-bold mb-4">Chats</h2>
        <div className="space-y-2">
          {doctors.map(doc => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoctorId(doc.userId)}
              className={`w-full text-left p-3 rounded-lg transition ${
                selectedDoctorId === doc.userId
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <p className="font-medium">{doc.user?.firstName} {doc.user?.lastName}</p>
              <p className="text-sm text-gray-500">{doc.specialization || 'Patient'}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedDoctorId ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.senderId === user?.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t dark:border-gray-700 p-4 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
              />
              <button
                onClick={sendMessage}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a contact to start chatting
          </div>
        )}
      </div>
    </div>
  );
}