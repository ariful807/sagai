import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CallModal: React.FC = () => {
  const { activeCall, endCall } = useApp();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeCall?.status === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [activeCall?.status]);

  if (!activeCall || !activeCall.isOpen || !activeCall.user) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="relative w-full max-w-sm h-[520px] bg-gradient-to-b from-slate-900 via-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col justify-between p-6 text-center text-white">

        {/* Top details */}
        <div className="space-y-2 pt-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-xs">
            {activeCall.type === 'video' ? <Video className="w-3.5 h-3.5 text-blue-400" /> : <Phone className="w-3.5 h-3.5 text-emerald-400" />}
            <span>sagai {activeCall.type === 'video' ? 'ভিডিও কল' : 'অডিও কল'}</span>
          </div>

          <h3 className="text-2xl font-black">{activeCall.user.name}</h3>

          <p className="text-xs text-gray-400 font-medium">
            {activeCall.status === 'calling' && 'রিং হচ্ছে (Calling)...'}
            {activeCall.status === 'connected' && `সংযুক্ত · ${formatDuration(callDuration)}`}
            {activeCall.status === 'ended' && 'কল শেষ হয়েছে'}
          </p>
        </div>

        {/* Center: Avatar with animated pulse rings */}
        <div className="relative flex items-center justify-center">
          {activeCall.status === 'calling' && (
            <>
              <div className="absolute w-36 h-36 rounded-full bg-blue-500/20 animate-ping" />
              <div className="absolute w-48 h-48 rounded-full bg-blue-500/10 animate-pulse" />
            </>
          )}

          <div className="relative z-10 w-28 h-28 rounded-full ring-4 ring-[#1877f2] overflow-hidden shadow-xl">
            <img
              src={activeCall.user.avatar}
              alt={activeCall.user.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom Call Controls */}
        <div className="space-y-4 pb-2">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3.5 rounded-full transition-colors ${
                isMuted ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title={isMuted ? 'আনমিউট' : 'মিউট'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {activeCall.type === 'video' && (
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-3.5 rounded-full transition-colors ${
                  isVideoOff ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                title={isVideoOff ? 'ক্যামেরা চালু' : 'ক্যামেরা বন্ধ'}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>
            )}

            <button
              onClick={endCall}
              className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg hover:scale-105 active:scale-95"
              title="কল শেষ করুন"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
