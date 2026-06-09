import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Clean existing data (order matters due to foreign keys)
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
  await prisma.user.deleteMany();

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@medtrackpro.com',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      admin: { create: {} }
    }
  });

  // Create patient user and include the created patient record
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
          chronicDiseases: 'None',
          emergencyContact: 'Jane Patient',
          emergencyPhone: '+977 9876543210',
          insuranceProvider: 'Nepal Insurance',
          insuranceNumber: 'INS-123456'
        }
      }
    },
    include: { patient: true }
  });
  const patientId = patientUser.patient!.id;

  // Create doctor user and include the created doctor record
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
          consultationFee: 1500.00,
          availability: { monday: '9-17', tuesday: '9-17', wednesday: '9-17' }
        }
      }
    },
    include: { doctor: true }
  });
  const doctorId = doctorUser.doctor!.id;

  // Create second doctor
  const doctor2User = await prisma.user.create({
    data: {
      email: 'ramesh.doctor@example.com',
      passwordHash: hashedPassword,
      firstName: 'Dr. Ramesh',
      lastName: 'Khanal',
      phone: '+977 9812345670',
      role: 'DOCTOR',
      doctor: {
        create: {
          specialization: 'General Physician',
          licenseNumber: 'NMC-67890',
          yearsExperience: 8,
          consultationFee: 1000.00
        }
      }
    },
    include: { doctor: true }
  });
  const doctor2Id = doctor2User.doctor!.id;

  // Create appointments
  const now = new Date();
  await prisma.appointment.createMany({
    data: [
      {
        patientId: patientId,
        doctorId: doctorId,
        scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 10, 0),
        durationMinutes: 30,
        status: 'SCHEDULED',
        type: 'ONLINE',
        notes: 'Follow-up on heart health'
      },
      {
        patientId: patientId,
        doctorId: doctor2Id,
        scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 14, 30),
        durationMinutes: 30,
        status: 'CONFIRMED',
        type: 'OFFLINE',
        notes: 'General checkup'
      },
      {
        patientId: patientId,
        doctorId: doctorId,
        scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5, 11, 0),
        durationMinutes: 30,
        status: 'COMPLETED',
        type: 'ONLINE',
        notes: 'Initial consultation'
      }
    ]
  });

  // Create prescription
  await prisma.prescription.create({
    data: {
      patientId: patientId,
      doctorId: doctorId,
      date: new Date(),
      notes: 'Take medicines as prescribed',
      medicines: {
        create: [
          { medicineName: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take after dinner' },
          { medicineName: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '30 days', instructions: 'Morning with food' }
        ]
      }
    }
  });

  // Create medical records
  await prisma.medicalRecord.createMany({
    data: [
      {
        patientId: patientId,
        doctorId: doctorId,
        title: 'Blood Test Report',
        description: 'Lipid profile shows high cholesterol',
        type: 'LAB_REPORT',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10)
      },
      {
        patientId: patientId,
        doctorId: doctorId,
        title: 'ECG Report',
        description: 'Normal sinus rhythm',
        type: 'RADIOLOGY',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3)
      },
      {
        patientId: patientId,
        doctorId: doctor2Id,
        title: 'Physical Examination',
        description: 'Vitals stable, no abnormalities',
        type: 'CLINICAL_NOTE',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 15)
      }
    ]
  });

  // Create vital signs
  await prisma.vitalSign.createMany({
    data: [
      { patientId: patientId, type: 'BLOOD_PRESSURE', value: '120/80 mmHg', recordedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 9, 0) },
      { patientId: patientId, type: 'HEART_RATE', value: '72 bpm', recordedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 9, 5) },
      { patientId: patientId, type: 'TEMPERATURE', value: '98.6 °F', recordedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 9, 10) },
      { patientId: patientId, type: 'OXYGEN_SATURATION', value: '98%', recordedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 9, 15) }
    ]
  });

  // Create health logs
  await prisma.healthLog.createMany({
    data: [
      { patientId: patientId, date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), sleepHours: 7.5, activityMinutes: 45, waterIntake: 2000, steps: 8500, symptoms: 'None' },
      { patientId: patientId, date: new Date(now.getFullYear(), now.getMonth(), now.getDate()), sleepHours: 8, activityMinutes: 30, waterIntake: 1800, steps: 7200, symptoms: 'Mild headache' }
    ]
  });

  // Create notifications
  await prisma.notification.createMany({
    data: [
      { userId: patientUser.id, title: 'Appointment Reminder', message: 'You have an appointment with Dr. Sarah Sharma in 2 days', type: 'APPOINTMENT', isRead: false },
      { userId: patientUser.id, title: 'Medicine Reminder', message: 'Take Atorvastatin 10mg', type: 'MEDICINE', isRead: false },
      { userId: patientUser.id, title: 'Lab Report Ready', message: 'Your blood test results are available', type: 'LAB_RESULT', isRead: false }
    ]
  });

  // Create messages
  await prisma.message.createMany({
    data: [
      { senderId: doctorUser.id, receiverId: patientUser.id, content: 'Your reports look good. Continue the medication.', isRead: false, doctorId: doctorId, patientId: patientId },
      { senderId: patientUser.id, receiverId: doctorUser.id, content: 'Thank you doctor. When should I come for follow-up?', isRead: true, doctorId: doctorId, patientId: patientId }
    ]
  });

  console.log('✅ Database seeded successfully!');
  console.log('Login credentials:');
  console.log('   Patient: john.patient@example.com / password123');
  console.log('   Doctor:  sarah.doctor@example.com / password123');
  console.log('   Admin:   admin@medtrackpro.com / password123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
