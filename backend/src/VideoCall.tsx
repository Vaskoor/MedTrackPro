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
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const newSocket = io('/');
    setSocket(newSocket);
    newSocket.emit('join-room', roomId);
    newSocket.on('user-joined', (userId: string) => {
      startCall(true);
    });
    newSocket.on('signal', ({ signal, sender }) => {
      if (peer && !peer.destroyed) {
        peer.signal(signal);
      }
    });
    return () => { newSocket.disconnect(); };
  }, [roomId]);

  const startCall = async (isInitiator: boolean) => {
    const userMedia = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setStream(userMedia);
    if (localVideoRef.current) localVideoRef.current.srcObject = userMedia;
    const newPeer = new Peer({ initiator: isInitiator, stream: userMedia, trickle: false });
    newPeer.on('signal', (signal) => {
      socket.emit('signal', { room: roomId, signal });
    });
    newPeer.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    });
    setPeer(newPeer);
    setCallActive(true);
  };

  const endCall = () => {
    if (peer) peer.destroy();
    if (stream) stream.getTracks().forEach(track => track.stop());
    setCallActive(false);
    setPeer(null);
  };

  return (
    <div className="flex gap-4 p-4 bg-black rounded-lg">
      <div className="relative">
        <video ref={localVideoRef} autoPlay muted className="w-48 h-36 rounded bg-gray-800" />
        <span className="absolute bottom-1 left-1 text-xs text-white">You</span>
      </div>
      <div className="relative">
        <video ref={remoteVideoRef} autoPlay className="w-48 h-36 rounded bg-gray-800" />
        <span className="absolute bottom-1 left-1 text-xs text-white">Doctor</span>
      </div>
      <div className="flex flex-col gap-2">
        {!callActive ? (
          <button onClick={() => startCall(true)} className="p-2 bg-green-600 rounded-full">
            <Phone size={20} />
          </button>
        ) : (
          <button onClick={endCall} className="p-2 bg-red-600 rounded-full">
            <PhoneOff size={20} />
          </button>
        )}
      </div>
    </div>
  );
}