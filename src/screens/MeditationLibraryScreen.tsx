import React, { useMemo } from 'react';
import { Settings, User, Sparkles } from 'lucide-react';
import { meditations, Meditation } from '../data/meditations';
import { useTheme } from '../context/ThemeContext';
import { useSubscription } from '../hooks/useSubscription';
import { useUserProfile } from '../context/UserProfileContext';
import { MeditationCard } from '../components/MeditationCard';
import { RecommendedMeditationCard } from '../components/RecommendedMeditationCard';

interface Props {
  onOpenPaywall: () => void;
  onOpenMood: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onSelectMeditation: (meditation: Meditation) => void;
}

export const MeditationLibraryScreen = ({ 
  onOpenPaywall, 
  onOpenMood, 
  onOpenSettings, 
  onOpenProfile, 
  onSelectMeditation 
}: Props) => {
  const { currentTheme } = useTheme();
  const { isSubscribed } = useSubscription();
  const { recommendedMeditationId } = useUserProfile();
  const isDark = currentTheme === 'dark';

  // Safe Recommendation Lookup with Fallback
  const recommendedMeditation = useMemo(() => {
    const found = meditations.find(m => m.id === recommendedMeditationId);
    if (found) return found;
    // Fallback to first meditation if ID is invalid
    return meditations[0];
  }, [recommendedMeditationId]);

  // Group meditations by category
  const sections = useMemo(() => {
    const groups: { [key: string]: Meditation[] } = {};
    meditations.forEach(m => {
      if (!groups[m.category]) groups[m.category] = [];
      groups[m.category].push(m);
    });
    return Object.keys(groups).map(category => ({
      title: category,
      data: groups[category]
    }));
  }, []);

  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${
      isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'
    }`}>
      {/* FIXED HEADER */}
      <header className={`pt-16 px-8 pb-6 flex items-center justify-between z-10 ${
        isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'
      }`}>
        <div>
          <h1 className={`text-3xl font-bold tracking-tight leading-tight ${
            isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'
          }`}>ZenPulse</h1>
          <p className={`text-sm font-medium mt-1 ${
            isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
          }`}>Breathe in the present moment</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenSettings}
            className={`w-10 h-10 rounded-full flex items-center justify-center border active:scale-90 transition-all shadow-sm ${
              isDark ? 'bg-[#1A1D24] text-[#F3F4F6] border-white/5' : 'bg-white text-[#111111] border-black/5'
            }`}
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={onOpenProfile}
            className={`w-10 h-10 rounded-full flex items-center justify-center border active:scale-90 transition-all shadow-sm ${
              isDark ? 'bg-[#1A1D24] text-[#F3F4F6] border-white/5' : 'bg-white text-[#111111] border-black/5'
            }`}
          >
            <User size={20} />
          </button>
        </div>
      </header>

      {/* SCROLLABLE CONTENT */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-8 pb-24">
        {/* AI Recommendation */}
        <RecommendedMeditationCard 
          meditation={recommendedMeditation}
          isSubscribed={isSubscribed}
          onPress={onSelectMeditation}
          onOpenPaywall={onOpenPaywall}
        />

        {/* AI Mood Check Quick Access */}
        <button
          onClick={onOpenMood}
          className={`w-full p-6 rounded-[28px] border flex items-center gap-4 active:scale-[0.98] transition-all shadow-sm group mb-10 ${
            isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isDark ? 'bg-[#8B9CFF]/10 text-[#8B9CFF]' : 'bg-[#5C6AC4]/10 text-[#5C6AC4]'
          }`}>
            <Sparkles size={24} />
          </div>
          <div className="text-left flex-1">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${
              isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'
            }`}>AI Mood Check</h2>
            <p className={`text-xs font-medium ${
              isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
            }`}>Personalized guidance for today</p>
          </div>
        </button>

        {/* Meditation Sections */}
        {sections.map(section => (
          <div key={section.title} className="mb-10">
            <h2 className={`text-lg font-bold tracking-tight mb-6 ${
              isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'
            }`}>{section.title}</h2>
            <div className="space-y-0">
              {section.data.map(meditation => (
                <MeditationCard 
                  key={meditation.id}
                  meditation={meditation}
                  isSubscribed={isSubscribed}
                  onPress={onSelectMeditation}
                  onOpenPaywall={onOpenPaywall}
                />
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};
