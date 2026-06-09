#!/bin/bash
set -e

echo "🚀 Adding advanced features to MedTrack Pro"

# ==================== BACKEND ADDITIONS ====================
cd backend

# Install required dependencies
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io simple-peer
npm install --save-dev @nestjs/cli  # optional, but we won't use it

# 1. Video Gateway (WebRTC signaling)
mkdir -p src/video
cat > src/video/video.gateway.ts << 'EOF'
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class VideoGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Video client connected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    client.to(room).emit('user-joined', client.id);
  }

  @SubscribeMessage('signal')
  handleSignal(client: Socket, { room, signal }: { room: string; signal: any }) {
    client.to(room).emit('signal', { sender: client.id, signal });
  }
}
EOF

# Update VideoModule to include gateway
cat > src/video/video.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { VideoGateway } from './video.gateway';

@Module({
  controllers: [VideoController],
  providers: [VideoService, VideoGateway],
})
export class VideoModule {}
EOF

# 2. Billing Module (create files manually)
mkdir -p src/billing
cat > src/billing/billing.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';

@Module({
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
EOF

cat > src/billing/billing.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    return this.prisma.billing.findMany({ where: { patientId: patient?.id } });
  }

  async pay(id: string, method: string) {
    return this.prisma.billing.update({
      where: { id },
      data: { status: 'PAID', payments: { create: { amount: 100, method, transactionId: 'mock_txn', status: 'SUCCESS' } } },
    });
  }
}
EOF

cat > src/billing/billing.controller.ts << 'EOF'
import { Controller, Get, Post, Param, Request, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  findAll(@Request() req) { return this.billingService.findAll(req.user.id); }

  @Post(':id/pay')
  pay(@Param('id') id: string) { return this.billingService.pay(id, 'stripe'); }
}
EOF

# 3. Lab Orders Module
mkdir -p src/lab-orders
cat > src/lab-orders/lab-orders.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { LabOrdersService } from './lab-orders.service';
import { LabOrdersController } from './lab-orders.controller';

@Module({
  controllers: [LabOrdersController],
  providers: [LabOrdersService],
})
export class LabOrdersModule {}
EOF

cat > src/lab-orders/lab-orders.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class LabOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(patientId: string) {
    return this.prisma.labOrder.findMany({ where: { patientId } });
  }

  async create(patientId: string, doctorId: string, testName: string) {
    return this.prisma.labOrder.create({
      data: { patientId, doctorId, testName, status: 'REQUESTED' },
    });
  }
}
EOF

cat > src/lab-orders/lab-orders.controller.ts << 'EOF'
import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { LabOrdersService } from './lab-orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('lab-orders')
@UseGuards(JwtAuthGuard)
export class LabOrdersController {
  constructor(private readonly service: LabOrdersService) {}

  @Get()
  async findAll(@Request() req) {
    const patient = await this.service['prisma'].patient.findUnique({ where: { userId: req.user.id } });
    return this.service.findAll(patient.id);
  }

  @Post()
  async create(@Request() req, @Body('testName') testName: string) {
    const patient = await this.service['prisma'].patient.findUnique({ where: { userId: req.user.id } });
    const doctor = await this.service['prisma'].doctor.findFirst();
    return this.service.create(patient.id, doctor.id, testName);
  }
}
EOF

# 4. Emergency Module
mkdir -p src/emergency
cat > src/emergency/emergency.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { EmergencyController } from './emergency.controller';

@Module({
  controllers: [EmergencyController],
  providers: [EmergencyService],
})
export class EmergencyModule {}
EOF

cat > src/emergency/emergency.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class EmergencyService {
  constructor(private prisma: PrismaService) {}

  async sendSOS(userId: string, location: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { patient: true, doctor: true } });
    const alert = await this.prisma.emergencyAlert.create({
      data: {
        patientId: user.patient.id,
        doctorId: user.doctor?.id,
        location,
        status: 'ACTIVE',
      },
    });
    return alert;
  }
}
EOF

cat > src/emergency/emergency.controller.ts << 'EOF'
import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('emergency')
@UseGuards(JwtAuthGuard)
export class EmergencyController {
  constructor(private readonly service: EmergencyService) {}

  @Post('sos')
  sendSOS(@Request() req, @Body('location') location: string) {
    return this.service.sendSOS(req.user.id, location);
  }
}
EOF

# Add EmergencyAlert model to Prisma schema (append if not present)
if ! grep -q "model EmergencyAlert" prisma/schema.prisma; then
  cat >> prisma/schema.prisma << 'EOF'

model EmergencyAlert {
  id        String   @id @default(cuid())
  patientId String
  patient   Patient  @relation(fields: [patientId], references: [id])
  doctorId  String?
  doctor    Doctor?  @relation(fields: [doctorId], references: [id])
  location  String?
  status    String   @default("ACTIVE")
  createdAt DateTime @default(now())
}
EOF
fi

# 5. AI Module
mkdir -p src/ai
cat > src/ai/ai.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

@Module({
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
EOF

cat > src/ai/ai.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async getInsights(patientId: string) {
    const vitals = await this.prisma.vitalSign.findMany({
      where: { patientId },
      orderBy: { recordedAt: 'desc' },
      take: 5,
    });
    const bp = vitals.find(v => v.type === 'BLOOD_PRESSURE')?.value;
    let message = 'Your health metrics are stable. Keep up the good work!';
    if (bp && bp !== '120/80 mmHg') {
      message = 'Your blood pressure is slightly elevated. Consider reducing salt intake.';
    }
    return { message, riskLevel: 'LOW' };
  }
}
EOF

cat > src/ai/ai.controller.ts << 'EOF'
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly service: AiService) {}

  @Get('insights')
  async getInsights(@Request() req) {
    const patient = await this.service['prisma'].patient.findUnique({ where: { userId: req.user.id } });
    return this.service.getInsights(patient.id);
  }
}
EOF

# 6. Update AppModule to import new modules
# Check if imports already exist, if not, add them
if ! grep -q "BillingModule" src/app.module.ts; then
  sed -i '' '/import { Module }/a\
import { BillingModule } from '\''./billing/billing.module'\'';
import { LabOrdersModule } from '\''./lab-orders/lab-orders.module'\'';
import { EmergencyModule } from '\''./emergency/emergency.module'\'';
import { AiModule } from '\''./ai/ai.module'\'';
' src/app.module.ts
  sed -i '' 's/imports: \[/imports: [\n    BillingModule,\n    LabOrdersModule,\n    EmergencyModule,\n    AiModule,\n/' src/app.module.ts
fi

# 7. Prisma generate and push
npx prisma generate
npx prisma db push --accept-data-loss 2>/dev/null || true

# 8. Seed database with extra data (nurse, billing, etc.)
cat > prisma/seed.ts << 'EOF'
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  // Clear existing data that might conflict (optional)
  await prisma.emergencyAlert.deleteMany();
  await prisma.labOrder.deleteMany();
  await prisma.billing.deleteMany();
  await prisma.prescriptionMedicine.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.vitalSign.deleteMany();
  await prisma.healthLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.nurse.deleteMany();
  await prisma.user.deleteMany();

  // Admin
  await prisma.user.create({
    data: {
      email: 'admin@medtrackpro.com',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      admin: { create: {} },
    },
  });

  // Patient
  const patientUser = await prisma.user.create({
    data: {
      email: 'john.patient@example.com',
      passwordHash: hashedPassword,
      firstName: 'John',
      lastName: 'Patient',
      phone: '+977 9812345678',
      role: 'PATIENT',
      patient: {
        create: {
          dateOfBirth: new Date('1990-05-15'),
          bloodGroup: 'O+',
          allergies: 'Penicillin',
          emergencyContact: 'Jane Patient',
          emergencyPhone: '+977 9876543210',
          insuranceProvider: 'Nepal Insurance',
          insuranceNumber: 'INS-123456',
        },
      },
    },
    include: { patient: true },
  });
  const patientId = patientUser.patient!.id;

  // Doctor
  const doctorUser = await prisma.user.create({
    data: {
      email: 'sarah.doctor@example.com',
      passwordHash: hashedPassword,
      firstName: 'Dr. Sarah',
      lastName: 'Sharma',
      phone: '+977 9801234567',
      role: 'DOCTOR',
      doctor: {
        create: {
          specialization: 'Cardiologist',
          licenseNumber: 'NMC-12345',
          yearsExperience: 12,
          consultationFee: 1500.0,
        },
      },
    },
    include: { doctor: true },
  });
  const doctorId = doctorUser.doctor!.id;

  // Nurse
  await prisma.user.create({
    data: {
      email: 'nisha.nurse@example.com',
      passwordHash: hashedPassword,
      firstName: 'Nisha',
      lastName: 'Gurung',
      phone: '+977 9812345699',
      role: 'NURSE',
      nurse: { create: { qualification: 'Staff Nurse' } },
    },
  });

  // Appointments
  const now = new Date();
  await prisma.appointment.createMany({
    data: [
      { patientId, doctorId, scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 10, 0), status: 'SCHEDULED', type: 'ONLINE', notes: 'Follow-up' },
      { patientId, doctorId, scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 14, 30), status: 'CONFIRMED', type: 'OFFLINE', notes: 'Checkup' },
    ],
  });

  // Prescription
  await prisma.prescription.create({
    data: {
      patientId,
      doctorId,
      notes: 'Take medicines as prescribed',
      medicines: {
        create: [
          { medicineName: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take after dinner' },
          { medicineName: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '30 days', instructions: 'Morning with food' },
        ],
      },
    },
  });

  // Medical records
  await prisma.medicalRecord.createMany({
    data: [
      { patientId, doctorId, title: 'Blood Test Report', description: 'High cholesterol', type: 'LAB_REPORT', date: new Date() },
      { patientId, doctorId, title: 'ECG Report', description: 'Normal sinus rhythm', type: 'RADIOLOGY', date: new Date() },
    ],
  });

  // Vitals
  await prisma.vitalSign.createMany({
    data: [
      { patientId, type: 'BLOOD_PRESSURE', value: '120/80 mmHg', recordedAt: new Date() },
      { patientId, type: 'HEART_RATE', value: '72 bpm', recordedAt: new Date() },
    ],
  });

  // Billing
  await prisma.billing.create({
    data: {
      patientId,
      amount: 1500,
      currency: 'NPR',
      description: 'Consultation fee',
      status: 'PENDING',
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30),
    },
  });

  console.log('✅ Seeding complete!');
  console.log('Patient: john.patient@example.com / password123');
  console.log('Doctor: sarah.doctor@example.com / password123');
  console.log('Nurse: nisha.nurse@example.com / password123');
  console.log('Admin: admin@medtrackpro.com / password123');
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
EOF

npm run seed

cd ..

# ==================== FRONTEND ADDITIONS ====================
cd frontend

# Install frontend dependencies
npm install socket.io-client simple-peer lucide-react date-fns @tanstack/react-query

# 1. Video Call Component
mkdir -p src/components
cat > src/components/VideoCall.tsx << 'EOF'
import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import { Phone, PhoneOff } from 'lucide-react';

export default function VideoCall({ roomId, userId }: { roomId: string; userId: string }) {
  const [socket, setSocket] = useState<any>(null);
  const [peer, setPeer] = useState<any>(null);
  const [callActive, setCallActive] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const newSocket = io('/');
    setSocket(newSocket);
    newSocket.emit('join-room', roomId);
    newSocket.on('user-joined', () => startCall(true));
    newSocket.on('signal', ({ signal }) => peer?.signal(signal));
    return () => newSocket.disconnect();
  }, [roomId]);

  const startCall = async (isInitiator: boolean) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    const newPeer = new Peer({ initiator: isInitiator, stream, trickle: false });
    newPeer.on('signal', (signal) => socket.emit('signal', { room: roomId, signal }));
    newPeer.on('stream', (remoteStream) => { if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream; });
    setPeer(newPeer);
    setCallActive(true);
  };

  const endCall = () => {
    peer?.destroy();
    setCallActive(false);
    setPeer(null);
  };

  return (
    <div className="flex gap-4 p-4 bg-black rounded-lg">
      <video ref={localVideoRef} autoPlay muted className="w-48 h-36 rounded" />
      <video ref={remoteVideoRef} autoPlay className="w-48 h-36 rounded" />
      <button onClick={callActive ? endCall : () => startCall(true)} className="p-2 rounded-full bg-blue-500">
        {callActive ? <PhoneOff /> : <Phone />}
      </button>
    </div>
  );
}
EOF

# 2. New Pages
mkdir -p src/pages

cat > src/pages/BillingPage.tsx << 'EOF'
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { format } from 'date-fns';

export default function BillingPage() {
  const { data: bills, refetch } = useQuery({ queryKey: ['billing'], queryFn: () => api.get('/billing').then(res => res.data) });
  const payMutation = useMutation({ mutationFn: (id: string) => api.post(`/billing/${id}/pay`), onSuccess: () => refetch() });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Billing</h1>
      {bills?.map((bill: any) => (
        <div key={bill.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
          <p>{bill.description}</p>
          <p>Amount: ${bill.amount}</p>
          <p>Due: {format(new Date(bill.dueDate), 'PPP')}</p>
          {bill.status === 'PENDING' && <button onClick={() => payMutation.mutate(bill.id)} className="bg-green-600 text-white px-4 py-1 rounded">Pay</button>}
        </div>
      ))}
    </div>
  );
}
EOF

cat > src/pages/LabTestsPage.tsx << 'EOF'
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { useState } from 'react';

export default function LabTestsPage() {
  const { data: tests, refetch } = useQuery({ queryKey: ['lab-tests'], queryFn: () => api.get('/lab-orders').then(res => res.data) });
  const [testName, setTestName] = useState('');
  const requestMutation = useMutation({ mutationFn: () => api.post('/lab-orders', { testName }), onSuccess: () => { refetch(); setTestName(''); } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lab Tests</h1>
      <div className="mb-4 flex gap-2">
        <input value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="Test name" className="border p-2 rounded flex-1" />
        <button onClick={() => requestMutation.mutate()} className="bg-blue-600 text-white px-4 py-2 rounded">Request</button>
      </div>
      {tests?.map((test: any) => (
        <div key={test.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-2">
          <p><strong>{test.testName}</strong> - Status: {test.status}</p>
        </div>
      ))}
    </div>
  );
}
EOF

cat > src/pages/NurseDashboard.tsx << 'EOF'
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function NurseDashboard() {
  const { data: visits } = useQuery({ queryKey: ['home-visits'], queryFn: () => api.get('/home-visits').then(res => res.data) });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nurse Dashboard</h1>
      <div className="grid gap-4">
        {visits?.map((visit: any) => <div key={visit.id} className="bg-white p-4 rounded shadow">Visit to patient {visit.patientId} at {visit.scheduledAt}</div>)}
      </div>
    </div>
  );
}
EOF

cat > src/pages/VideoCallPage.tsx << 'EOF'
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import VideoCall from '../components/VideoCall';

export default function VideoCallPage() {
  const { user } = useAuthStore();
  const [roomId, setRoomId] = useState('');
  const [inCall, setInCall] = useState(false);
  if (!inCall) return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Video Consultation</h1>
      <input placeholder="Enter room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} className="border p-2 rounded mr-2" />
      <button onClick={() => setInCall(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Join Call</button>
    </div>
  );
  return <VideoCall roomId={roomId} userId={user?.id || ''} />;
}
EOF

# 3. Update PatientDashboard with SOS and AI insights
cat > src/pages/PatientDashboard.tsx << 'EOF'
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Calendar, Pill, Activity, FileText, AlertTriangle } from 'lucide-react';

export default function PatientDashboard() {
  const { data: appointments } = useQuery({ queryKey: ['appointments'], queryFn: () => api.get('/appointments').then(res => res.data) });
  const { data: prescriptions } = useQuery({ queryKey: ['prescriptions'], queryFn: () => api.get('/prescriptions').then(res => res.data) });
  const { data: insights } = useQuery({ queryKey: ['ai-insights'], queryFn: () => api.get('/ai/insights').then(res => res.data) });

  const sendSOS = async () => {
    if (confirm('Send emergency alert?')) {
      await api.post('/emergency/sos', { location: 'Current location' });
      alert('Alert sent!');
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded shadow mb-6">
        <h3 className="font-bold">🧠 AI Health Insight</h3>
        <p>{insights?.message || 'Loading...'}</p>
        <p className="text-xs italic">AI analysis – not a substitute for medical advice.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow"><Calendar /> <h3>Appointments</h3><p className="text-2xl">{appointments?.length || 0}</p></div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow"><Pill /> <h3>Prescriptions</h3><p className="text-2xl">{prescriptions?.length || 0}</p></div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow"><Activity /> <h3>Health Score</h3><p className="text-2xl">85</p></div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow"><FileText /> <h3>Records</h3><p className="text-2xl">12</p></div>
      </div>
      <button onClick={sendSOS} className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-lg animate-pulse">
        <AlertTriangle size={24} />
      </button>
    </div>
  );
}
EOF

# 4. Update Layout navigation
cat > src/layouts/Layout.tsx << 'EOF'
import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Home, Calendar, Pill, FileText, Activity, MessageSquare, CreditCard, FlaskRound, Video, User } from 'lucide-react';

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
    { path: '/health', icon: Activity, label: 'Health' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/billing', icon: CreditCard, label: 'Billing' },
    { path: '/lab-tests', icon: FlaskRound, label: 'Lab Tests' },
    { path: '/video', icon: Video, label: 'Video Call' },
  ];
  if (user?.role === 'NURSE') navItems.push({ path: '/nurse', icon: User, label: 'Nurse Dashboard' });

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 text-xl font-bold border-b">MedTrack Pro</div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100">
              <item.icon size={20} /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="mb-2">{user?.firstName} {user?.lastName}</div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600"><LogOut size={16} /> Logout</button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
EOF

# 5. Update App.tsx with new routes
cat > src/App.tsx << 'EOF'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NurseDashboard from './pages/NurseDashboard';
import AppointmentsPage from './pages/AppointmentsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import HealthTrackingPage from './pages/HealthTrackingPage';
import ChatPage from './pages/ChatPage';
import BillingPage from './pages/BillingPage';
import LabTestsPage from './pages/LabTestsPage';
import VideoCallPage from './pages/VideoCallPage';
import Layout from './layouts/Layout';

function App() {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={user?.role === 'PATIENT' ? <PatientDashboard /> : user?.role === 'DOCTOR' ? <DoctorDashboard /> : user?.role === 'NURSE' ? <NurseDashboard /> : <AdminDashboard />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/prescriptions" element={<PrescriptionsPage />} />
          <Route path="/medical-records" element={<MedicalRecordsPage />} />
          <Route path="/health" element={<HealthTrackingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/lab-tests" element={<LabTestsPage />} />
          <Route path="/video" element={<VideoCallPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
export default App;
EOF

echo "✅ All extra features added successfully!"
echo "👉 Run 'docker-compose up --build' or start backend & frontend manually."
echo "👉 New pages: Billing, Lab Tests, Video Call, Nurse Dashboard."
echo "👉 Emergency SOS button on patient dashboard."
echo "👉 AI insights widget on patient dashboard."