import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, User, Award, Clock, CheckCircle2, Settings, Edit3, LogOut, Trophy, Target, Sparkles, Bookmark } from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/ToastProvider';
import { MeditationProgressCard } from '../components/MeditationProgressCard';
import { ProgressRing } from '../components/ProgressRing';
import { subscriptionService } from '../services/subscriptionService';

interface ProfileScreenProps {
  onBack: () => void;
  onResumeMeditation: (meditationId: string) => void;
  onOpenPaywall: () => void;
  onOpenSettings: () => void;
  onViewFavorites?: () => void;
}

export const ProfileScreen = ({ onBack, onResumeMeditation, onOpenPaywall, onOpenSettings, onViewFavorites }: ProfileScreenProps) => {
  const { userProfile } = useUserProfile();
  const { currentTheme } = useTheme();
  const { showToast } = useToast();
  const isDark = currentTheme === 'dark';
  const isPremium = subscriptionService.isPremium(userProfile);
  const subLabel = subscriptionService.getSubscriptionLabel(userProfile);
  const shouldReduceMotion = useReducedMotion();

  const dailyProgress = React.useMemo(() => {
    if (!userProfile?.dailyGoalMinutes) return 0;
    return Math.min(1, (userProfile.totalMinutesToday || 0) / userProfile.dailyGoalMinutes);
  }, [userProfile?.totalMinutesToday, userProfile?.dailyGoalMinutes]);

  const handleEditProfile = () => {
    showToast('Profile editing will be available in the next update.', 'info');
  };

  const handleLogout = () => {
    showToast('Logout is disabled in this demo version.', 'info');
  };

  return (
    <motion.div 
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 100 }}
      className={`fixed inset-0 z-50 flex flex-col overflow-y-auto no-scrollbar transition-colors duration-300 ${
        isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'
      }`}
    >
      <div className="pt-16 pb-10 px-8 flex flex-col h-full max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              aria-label="Go back"
              className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform shrink-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${
                isDark ? 'bg-[#1A1D24] text-[#F3F4F6]' : 'bg-white text-[#111111] shadow-sm border border-black/5'
              }`}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
              My Profile
            </h1>
          </div>
          <button 
            onClick={onOpenSettings}
            aria-label="Open settings"
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform shrink-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${
              isDark ? 'bg-[#1A1D24] text-[#F3F4F6]' : 'bg-white text-[#111111] shadow-sm border border-black/5'
            }`}
          >
            <Settings size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-6 mb-10">
          <div className={`w-24 h-24 rounded-[40px] flex items-center justify-center border-2 shadow-xl ${
            isDark ? 'bg-[#1A1D24] border-white/5 text-[#8B9CFF]' : 'bg-white border-black/5 text-[#5C6AC4]'
          }`}>
            <User size={48} aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h2 className={`text-2xl font-bold mb-1 tracking-tight ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
              {userProfile?.username || 'ZenSeeker'}
            </h2>
            <p className={`text-xs font-bold mb-3 ${isDark ? 'text-[#9CA3AF] opacity-70' : 'text-[#4B5563] opacity-90'}`}>
              {userProfile?.email || 'seeker@zenpulse.app'}
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleEditProfile}
                className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}
              >
                <Edit3 size={12} />
                Edit
              </button>
              <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 opacity-80 hover:opacity-100 transition-opacity"
              >
                <LogOut size={12} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Subscription Status Badge */}
        <div className="flex items-center gap-2 mb-10">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-sm ${
            isPremium 
              ? (isDark ? 'bg-[#8B9CFF] text-black' : 'bg-[#5C6AC4] text-white')
              : (isDark ? 'bg-white/5 text-[#9CA3AF]' : 'bg-black/5 text-[#4B5563]')
          }`}>
            {subLabel}
          </span>
          {isPremium && (
            <motion.div
              animate={shouldReduceMotion ? {} : { rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Award size={16} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} aria-hidden="true" />
            </motion.div>
          )}
        </div>

        {/* Membership Section */}
        <section 
          aria-labelledby="membership-title"
          className={`p-6 rounded-[32px] mb-10 border ${
            isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 id="membership-title" className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
              Membership
            </h3>
            {!isPremium && (
              <button 
                onClick={onOpenPaywall}
                aria-label="Upgrade to Premium"
                className={`text-[10px] font-black uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'}`}
              >
                Upgrade
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isPremium ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'
              }`}>
                <CheckCircle2 size={16} aria-hidden="true" />
              </div>
              <span className={`text-xs font-bold ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                {isPremium ? 'Full Library Access' : 'Limited Library Access'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isPremium ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'
              }`}>
                <CheckCircle2 size={16} aria-hidden="true" />
              </div>
              <span className={`text-xs font-bold ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                {isPremium ? 'AI Mood Recommendations' : 'Standard Recommendations'}
              </span>
            </div>
            {isPremium && (
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500`}>
                  <CheckCircle2 size={16} aria-hidden="true" />
                </div>
                <span className={`text-xs font-bold ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                  Offline Listening Mode
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className={`p-6 rounded-[28px] border ${isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5'}`}>
            <Trophy size={20} className="text-amber-500 mb-3" aria-hidden="true" />
            <p className={`text-2xl font-bold mb-1 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
              {userProfile?.currentStreak || 0}
            </p>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
              Day Streak
            </p>
          </div>
          <div className={`p-6 rounded-[28px] border flex items-center justify-between ${isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5'}`}>
            <div>
              <Target size={20} className="text-[#8B9CFF] mb-3" aria-hidden="true" />
              <p className={`text-2xl font-bold mb-1 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
                {userProfile?.totalMinutesToday || 0}
                <span className="text-sm font-medium opacity-40 ml-1">/ {userProfile?.dailyGoalMinutes || 0}</span>
              </p>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                Daily Goal
              </p>
            </div>
            <div className="shrink-0">
              <ProgressRing 
                progress={dailyProgress} 
                size={48} 
                strokeWidth={4}
                activeColor={isDark ? '#8B9CFF' : '#5C6AC4'}
              >
                {dailyProgress >= 1 && <Sparkles size={16} className="text-amber-500" />}
              </ProgressRing>
            </div>
          </div>
          <div className={`p-6 rounded-[28px] border ${isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5'}`}>
            <CheckCircle2 size={20} className="text-emerald-500 mb-3" aria-hidden="true" />
            <p className={`text-2xl font-bold mb-1 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
              {userProfile?.totalMeditationsCompleted || 0}
            </p>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
              Completed
            </p>
          </div>
          <div className={`p-6 rounded-[28px] border ${isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5'}`}>
            <Clock size={20} className="text-[#8B9CFF] mb-3" aria-hidden="true" />
            <p className={`text-2xl font-bold mb-1 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
              {userProfile?.totalMeditationMinutes || 0}
            </p>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
              Total Minutes
            </p>
          </div>
          <button 
            onClick={onViewFavorites}
            className={`p-6 rounded-[28px] border text-left transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${isDark ? 'bg-[#1A1D24] border-white/5 hover:bg-[#232730]' : 'bg-white border-black/5 shadow-sm hover:bg-gray-50'}`}
          >
            <Bookmark size={20} className={`mb-3 ${isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'}`} aria-hidden="true" />
            <p className={`text-2xl font-bold mb-1 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
              {(userProfile?.favoriteIds || []).length}
            </p>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
              Saved
            </p>
          </button>
        </div>

        {/* Progress List */}
        <section className="flex-1" aria-labelledby="activity-title">
          <h3 id="activity-title" className={`text-lg font-bold mb-6 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
            Recent Activity
          </h3>
          {(userProfile?.meditationProgress || []).length > 0 ? (
            (userProfile?.meditationProgress || []).map((progress) => (
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
              <p className={`text-sm font-medium ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                No meditations started yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
};
