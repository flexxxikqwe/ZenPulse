import React from 'react';
import { Play } from 'lucide-react';
import { MeditationProgress } from '../types/UserProfile';
import { useTheme } from '../context/ThemeContext';

interface MeditationProgressCardProps {
  progress: MeditationProgress;
  onResume: () => void;
}

export const MeditationProgressCard: React.FC<MeditationProgressCardProps> = ({ progress, onResume }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <div className={`p-5 rounded-[24px] border transition-all mb-4 ${
      isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5 shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
            {progress.meditationTitle}
          </h3>
          <p className={`text-xs font-bold ${isDark ? 'text-[#9CA3AF] opacity-80' : 'text-[#4B5563] opacity-90'}`}>
            {progress.completed ? 'Completed' : `${progress.progressPercent}% complete`}
          </p>
        </div>
        {!progress.completed && (
          <button
            onClick={onResume}
            aria-label={`Resume ${progress.meditationTitle}`}
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${
              isDark ? 'bg-[#8B9CFF] text-black' : 'bg-[#5C6AC4] text-white'
            }`}
          >
            <Play size={18} fill="currentColor" aria-hidden="true" />
          </button>
        )}
      </div>

      <div 
        className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-black/10'}`}
        role="progressbar"
        aria-valuenow={progress.progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Meditation progress"
      >
        <div 
          className={`h-full transition-all duration-500 ${isDark ? 'bg-[#8B9CFF]' : 'bg-[#5C6AC4]'}`}
          style={{ width: `${progress.progressPercent}%` }}
        />
      </div>
    </div>
  );
};
