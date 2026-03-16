import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Award, Clock, CheckCircle2 } from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { useTheme } from '../context/ThemeContext';
import { MeditationProgressCard } from '../components/MeditationProgressCard';

interface ProfileScreenProps {
  onBack: () => void;
  onResumeMeditation: (meditationId: string) => void;
}

export const ProfileScreen = ({ onBack, onResumeMeditation }: ProfileScreenProps) => {
  const { userProfile } = useUserProfile();
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed inset-0 z-50 flex flex-col overflow-y-auto no-scrollbar transition-colors duration-300 ${
        isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'
      }`}
    >
      <div className="pt-16 pb-10 px-8 flex flex-col h-full max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-6 mb-10">
          <button 
            onClick={onBack}
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform shrink-0 ${
              isDark ? 'bg-[#1A1D24] text-[#F3F4F6]' : 'bg-white text-[#111111]'
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
            My Profile
          </h1>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-6 mb-10">
          <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center border-2 ${
            isDark ? 'bg-[#1A1D24] border-white/5 text-[#8B9CFF]' : 'bg-white border-black/5 text-[#5C6AC4]'
          }`}>
            <User size={40} />
          </div>
          <div>
            <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
              {userProfile.username}
            </h2>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                userProfile.isPremium 
                  ? (isDark ? 'bg-[#8B9CFF]/20 text-[#8B9CFF]' : 'bg-[#5C6AC4]/20 text-[#5C6AC4]')
                  : (isDark ? 'bg-white/5 text-[#9CA3AF]' : 'bg-black/5 text-[#6B7280]')
              }`}>
                {userProfile.isPremium ? 'Premium Member' : 'Free Plan'}
              </span>
              {userProfile.isPremium && <Award size={14} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} />}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className={`p-6 rounded-[28px] border ${isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5'}`}>
            <CheckCircle2 size={20} className="text-emerald-500 mb-3" />
            <p className={`text-2xl font-bold mb-1 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
              {userProfile.totalMeditationsCompleted}
            </p>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
              Completed
            </p>
          </div>
          <div className={`p-6 rounded-[28px] border ${isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5'}`}>
            <Clock size={20} className="text-amber-500 mb-3" />
            <p className={`text-2xl font-bold mb-1 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
              {userProfile.totalMeditationMinutes}
            </p>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
              Minutes
            </p>
          </div>
        </div>

        {/* Progress List */}
        <div className="flex-1">
          <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
            Recent Activity
          </h3>
          {userProfile.meditationProgress.length > 0 ? (
            userProfile.meditationProgress.map((progress) => (
              <MeditationProgressCard 
                key={progress.meditationId} 
                progress={progress} 
                onResume={() => onResumeMeditation(progress.meditationId)}
              />
            ))
          ) : (
            <div className={`p-10 text-center rounded-[32px] border border-dashed ${
              isDark ? 'border-white/10' : 'border-black/10'
            }`}>
              <p className={`text-sm font-medium ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                No meditations started yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
