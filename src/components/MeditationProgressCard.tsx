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
      isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
            {progress.meditationTitle}
          </h3>
          <p className={`text-xs font-medium ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            {progress.completed ? 'Completed' : `${progress.progressPercent}% complete`}
          </p>
        </div>
        {!progress.completed && (
          <button
            onClick={onResume}
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-all ${
              isDark ? 'bg-[#8B9CFF] text-black' : 'bg-[#5C6AC4] text-white'
            }`}
          >
            <Play size={18} fill="currentColor" />
          </button>
        )}
      </div>

      <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
        <div 
          className={`h-full transition-all duration-500 ${isDark ? 'bg-[#8B9CFF]' : 'bg-[#5C6AC4]'}`}
          style={{ width: `${progress.progressPercent}%` }}
        />
      </div>
    </div>
  );
};
