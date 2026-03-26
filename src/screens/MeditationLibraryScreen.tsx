import React, { useMemo, useEffect, useState, useRef } from 'react';
import { Settings, User, Sparkles, Clock, Target, Trophy, Bookmark, Search, X, Filter, ChevronDown } from 'lucide-react';
import { Meditation } from '../data/meditations';
import { meditationService } from '../services/meditationService';
import { useTheme } from '../context/ThemeContext';
import { useUserProfile } from '../context/UserProfileContext';
import { MeditationCard } from '../components/MeditationCard';
import { RecommendedMeditationCard } from '../components/RecommendedMeditationCard';
import { ContinueCard } from '../components/ContinueCard';
import { ProgressRing } from '../components/ProgressRing';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { analytics } from '../services/analyticsService';
import { subscriptionService } from '../services/subscriptionService';

interface Props {
  onOpenPaywall: () => void;
  onOpenMood: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onSelectMeditation: (meditation: Meditation) => void;
  viewMode?: 'explore' | 'saved';
  onViewModeChange?: (mode: 'explore' | 'saved') => void;
}

export const MeditationLibraryScreen = React.memo(({ 
  onOpenPaywall, 
  onOpenMood, 
  onOpenSettings, 
  onOpenProfile, 
  onSelectMeditation,
  viewMode: controlledViewMode,
  onViewModeChange
}: Props) => {
  const { currentTheme } = useTheme();
  const { userProfile, recommendedMeditationId } = useUserProfile();
  const isDark = currentTheme === 'dark';
  const isPremium = useMemo(() => subscriptionService.isPremium(userProfile), [userProfile]);
  const shouldReduceMotion = useReducedMotion();
  const [allMeditations, setAllMeditations] = useState<Meditation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localViewMode, setLocalViewMode] = useState<'explore' | 'saved'>('explore');

  const viewMode = controlledViewMode || localViewMode;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    duration: null as string | null,
    difficulty: null as string | null,
    type: null as string | null,
    favorites: false
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isSearchMode = searchQuery.trim() !== '' || 
    activeFilters.duration !== null || 
    activeFilters.difficulty !== null || 
    activeFilters.type !== null;

  useEffect(() => {
    analytics.trackEvent({ name: 'library_viewed' });
    
    const fetchMeditations = async () => {
      try {
        setIsLoading(true);
        const data = await meditationService.getMeditations();
        setAllMeditations(data || []);
      } catch (error) {
        console.error("Failed to fetch meditations:", error);
        setAllMeditations([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeditations();
  }, []);

  const handleSwitchMode = (mode: 'explore' | 'saved') => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    } else {
      setLocalViewMode(mode);
    }
    analytics.trackEvent({ name: 'library_mode_switched', properties: { mode } });
    // Clear search when switching to saved to show all favorites
    if (mode === 'saved') {
      setSearchQuery('');
      setActiveFilters(prev => ({ ...prev, favorites: false }));
    }
  };

  // Greeting Logic - Stable
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const name = (userProfile?.username || 'ZenSeeker').split(' ')[0];
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  }, [userProfile?.username]);

  const primaryGoal = userProfile?.goals?.[0] || 'stress';
  const goalLabel = useMemo(() => primaryGoal.charAt(0).toUpperCase() + primaryGoal.slice(1), [primaryGoal]);

  // Personalized Recommendation Logic
  const recommendationData = useMemo(() => {
    if (allMeditations.length === 0) return { recommendedMeditation: null, recommendationReason: "" };

    const aiFound = allMeditations.find(m => m.id === recommendedMeditationId);
    if (aiFound && recommendedMeditationId !== "focus_01") {
      return { 
        recommendedMeditation: aiFound, 
        recommendationReason: "AI Mood Check" 
      };
    }

    let filtered = allMeditations.filter(m => m.tags?.includes(primaryGoal));
    if (filtered.length === 0) filtered = [...allMeditations];

    const preferredDuration = userProfile?.preferredDuration || 15;
    filtered.sort((a, b) => {
      const diffA = Math.abs((a.durationMinutes || 0) - preferredDuration);
      const diffB = Math.abs((b.durationMinutes || 0) - preferredDuration);
      return diffA - diffB;
    });

    return { 
      recommendedMeditation: filtered[0] || allMeditations[0], 
      recommendationReason: `For your goal: ${goalLabel}` 
    };
  }, [allMeditations, recommendedMeditationId, primaryGoal, userProfile?.preferredDuration, goalLabel]);

  const { recommendedMeditation, recommendationReason } = recommendationData;
  
  // Favorites Section
  const favoriteMeditations = useMemo(() => {
    if (allMeditations.length === 0 || !userProfile?.favoriteIds) return [];
    return userProfile.favoriteIds
      .map(id => allMeditations.find(m => m.id === id))
      .filter((m): m is Meditation => !!m);
  }, [allMeditations, userProfile?.favoriteIds]);

  // Continue Session Logic
  const continueSession = useMemo(() => {
    if (allMeditations.length === 0) return null;

    const activeProgress = [...(userProfile?.meditationProgress || [])]
      .filter(p => (p.progressPercent || 0) > 0 && (p.progressPercent || 0) < 99)
      .sort((a, b) => (b.lastPositionSeconds || 0) - (a.lastPositionSeconds || 0))[0];
    
    if (!activeProgress) return null;
    
    const meditation = allMeditations.find(m => m.id === activeProgress.meditationId);
    if (!meditation) return null;

    return { meditation, progressPercent: activeProgress.progressPercent || 0 };
  }, [allMeditations, userProfile?.meditationProgress]);

  // Featured Section
  const featuredMeditations = useMemo(() => {
    return allMeditations.filter(m => m.isFeatured).slice(0, 3);
  }, [allMeditations]);

  // New & Trending Section
  const newMeditations = useMemo(() => {
    return allMeditations.filter(m => m.isNew).slice(0, 3);
  }, [allMeditations]);

  // Goal-based Section
  const goalMeditations = useMemo(() => {
    return allMeditations
      .filter(m => m.tags?.includes(primaryGoal) && m.id !== recommendedMeditation?.id && !m.isFeatured)
      .slice(0, 3);
  }, [allMeditations, primaryGoal, recommendedMeditation?.id]);

  // Duration-based Section
  const durationMeditations = useMemo(() => {
    const preferredDuration = userProfile?.preferredDuration || 15;
    return allMeditations
      .filter(m => 
        Math.abs((m.durationMinutes || 0) - preferredDuration) <= 5 && 
        !m.tags?.includes(primaryGoal) && 
        !m.isFeatured && 
        !m.isNew
      )
      .slice(0, 3);
  }, [allMeditations, userProfile?.preferredDuration, primaryGoal]);

  // Group meditations by category (remaining)
  const sections = useMemo(() => {
    const groups: { [key: string]: Meditation[] } = {};
    const excludedIds = new Set([
      ...featuredMeditations.map(m => m.id),
      ...newMeditations.map(m => m.id),
      ...goalMeditations.map(m => m.id),
      ...durationMeditations.map(m => m.id),
      recommendedMeditation?.id
    ]);

    allMeditations.forEach(m => {
      if (excludedIds.has(m.id)) return;
      const category = m.category || 'Uncategorized';
      if (!groups[category]) groups[category] = [];
      groups[category].push(m);
    });
    return Object.keys(groups).map(category => ({
      title: category,
      data: groups[category]
    })).filter(s => s.data.length > 0);
  }, [allMeditations, featuredMeditations, newMeditations, goalMeditations, durationMeditations, recommendedMeditation?.id]);

  const dailyProgress = useMemo(() => {
    if (!userProfile?.dailyGoalMinutes) return 0;
    return Math.min(1, (userProfile.totalMinutesToday || 0) / userProfile.dailyGoalMinutes);
  }, [userProfile?.totalMinutesToday, userProfile?.dailyGoalMinutes]);

  // Search & Filter Logic
  const filteredMeditations = useMemo(() => {
    if (!isSearchMode && searchQuery.trim() === '') return [];

    const sourceList = viewMode === 'saved' ? favoriteMeditations : allMeditations;

    return sourceList.filter(m => {
      // Search Query Match
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(query);
        const matchesInstructor = m.instructor?.toLowerCase().includes(query);
        const matchesCategory = m.category?.toLowerCase().includes(query);
        const matchesBenefits = m.benefits?.some(b => b.toLowerCase().includes(query));
        const matchesTags = m.tags?.some(t => t.toLowerCase().includes(query));
        
        if (!matchesTitle && !matchesInstructor && !matchesCategory && !matchesBenefits && !matchesTags) {
          return false;
        }
      }

      // Duration Filter
      if (activeFilters.duration) {
        const duration = m.durationMinutes || 0;
        if (activeFilters.duration === 'short' && duration > 10) return false;
        if (activeFilters.duration === 'medium' && (duration <= 10 || duration > 20)) return false;
        if (activeFilters.duration === 'long' && duration <= 20) return false;
      }

      // Difficulty Filter
      if (activeFilters.difficulty && m.difficulty?.toLowerCase() !== activeFilters.difficulty) {
        return false;
      }

      // Type Filter (Free/Premium)
      if (activeFilters.type) {
        const isMeditationPremium = m.premiumRequired;
        if (activeFilters.type === 'free' && isMeditationPremium) return false;
        if (activeFilters.type === 'premium' && !isMeditationPremium) return false;
      }

      return true;
    });
  }, [allMeditations, favoriteMeditations, searchQuery, activeFilters, isSearchMode, viewMode]);

  useEffect(() => {
    if (searchQuery.length >= 3) {
      const timer = setTimeout(() => {
        analytics.trackEvent({ name: 'search_performed', properties: { query: searchQuery } });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const toggleFilter = (type: keyof typeof activeFilters, value: any) => {
    const isCurrentlyActive = activeFilters[type] === value;
    setActiveFilters(prev => ({
      ...prev,
      [type]: isCurrentlyActive ? null : value
    }));
    analytics.trackEvent({ 
      name: 'filter_toggled', 
      properties: { filterType: String(type), value: isCurrentlyActive ? 'none' : String(value) } 
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveFilters({
      duration: null,
      difficulty: null,
      type: null,
      favorites: false
    });
    analytics.trackEvent({ name: 'filters_cleared' });
  };

  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${
      isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'
    }`}>
      {/* FIXED HEADER */}
      <header className={`pt-16 px-8 pb-2 flex flex-col z-20 ${
        isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenProfile}
              aria-label="My Profile"
              className="relative active:scale-90 transition-all"
            >
              <ProgressRing 
                progress={dailyProgress} 
                size={40} 
                strokeWidth={3}
                activeColor={isDark ? '#8B9CFF' : '#5C6AC4'}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${
                  isDark ? 'bg-[#1A1D24] text-[#F3F4F6] border-white/5' : 'bg-white text-[#111111] border-black/5'
                }`}>
                  <User size={16} />
                </div>
              </ProgressRing>
            </button>
            <div>
              <h1 className={`text-lg font-bold tracking-tight leading-tight ${
                isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'
              }`}>{greeting}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {userProfile?.currentStreak && userProfile.currentStreak > 0 && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm ${
                isDark ? 'bg-[#1A1D24] border-white/5 text-[#F3F4F6]' : 'bg-white border-black/5 text-[#111111]'
              }`}>
                <Trophy size={12} className="text-amber-500" />
                <span className="text-[10px] font-black">{userProfile.currentStreak}</span>
              </div>
            )}
            <button 
              onClick={onOpenSettings}
              aria-label="Settings"
              className={`w-9 h-9 rounded-full flex items-center justify-center border active:scale-90 transition-all shadow-sm ${
                isDark ? 'bg-[#1A1D24] text-[#F3F4F6] border-white/5' : 'bg-white text-[#111111] border-black/5'
              }`}
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* MODE SWITCHER - MOVED UP */}
        <div className="flex items-center justify-center mb-6">
          <div className={`flex p-1 rounded-2xl w-full border ${
            isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5'
          }`}>
            <button
              onClick={() => handleSwitchMode('explore')}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                viewMode === 'explore'
                  ? (isDark ? 'bg-white text-[#0F1115] shadow-lg' : 'bg-[#111111] text-white shadow-lg')
                  : (isDark ? 'text-[#9CA3AF] hover:text-[#F3F4F6]' : 'text-[#4B5563] hover:text-[#111111]')
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => handleSwitchMode('saved')}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                viewMode === 'saved'
                  ? (isDark ? 'bg-white text-[#0F1115] shadow-lg' : 'bg-[#111111] text-white shadow-lg')
                  : (isDark ? 'text-[#9CA3AF] hover:text-[#F3F4F6]' : 'text-[#4B5563] hover:text-[#111111]')
              }`}
            >
              Saved
              {favoriteMeditations.length > 0 && (
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${
                  viewMode === 'saved'
                    ? (isDark ? 'bg-[#0F1115] text-white' : 'bg-white text-[#111111]')
                    : (isDark ? 'bg-white/10 text-[#9CA3AF]' : 'bg-black/10 text-[#4B5563]')
                }`}>
                  {favoriteMeditations.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
            <Search size={16} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={viewMode === 'saved' ? "Search your collection..." : "Search sessions, instructors..."}
            className={`w-full h-11 pl-11 pr-11 rounded-2xl border text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-primary/20 ${
              isDark 
                ? 'bg-[#1A1D24] border-white/5 text-[#F3F4F6] placeholder-[#9CA3AF]/40' 
                : 'bg-white border-black/5 text-[#111111] placeholder-[#4B5563]/40'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                isDark ? 'hover:bg-white/5 text-[#9CA3AF]' : 'hover:bg-black/5 text-[#4B5563]'
              }`}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
          {[
            { id: 'short', label: '< 10m', type: 'duration' },
            { id: 'medium', label: '10-20m', type: 'duration' },
            { id: 'long', label: '20m+', type: 'duration' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => toggleFilter('duration', f.id as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${
                activeFilters.duration === f.id
                  ? (isDark ? 'bg-[#8B9CFF] border-[#8B9CFF] text-black' : 'bg-[#5C6AC4] border-[#5C6AC4] text-white')
                  : (isDark ? 'bg-[#1A1D24] border-white/5 text-[#9CA3AF]' : 'bg-white border-black/5 text-[#4B5563]')
              }`}
            >
              {f.label}
            </button>
          ))}

          {[
            { id: 'beginner', label: 'Beginner', type: 'difficulty' },
            { id: 'intermediate', label: 'Intermediate', type: 'difficulty' },
            { id: 'advanced', label: 'Advanced', type: 'difficulty' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => toggleFilter('difficulty', f.id as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${
                activeFilters.difficulty === f.id
                  ? (isDark ? 'bg-[#8B9CFF] border-[#8B9CFF] text-black' : 'bg-[#5C6AC4] border-[#5C6AC4] text-white')
                  : (isDark ? 'bg-[#1A1D24] border-white/5 text-[#9CA3AF]' : 'bg-white border-black/5 text-[#4B5563]')
              }`}
            >
              {f.label}
            </button>
          ))}

          {[
            { id: 'free', label: 'Free', type: 'type' },
            { id: 'premium', label: 'Premium', type: 'type' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => toggleFilter('type', f.id as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${
                activeFilters.type === f.id
                  ? (isDark ? 'bg-[#8B9CFF] border-[#8B9CFF] text-black' : 'bg-[#5C6AC4] border-[#5C6AC4] text-white')
                  : (isDark ? 'bg-[#1A1D24] border-white/5 text-[#9CA3AF]' : 'bg-white border-black/5 text-[#4B5563]')
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>


      {/* SCROLLABLE CONTENT */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-8 pb-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className={`w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mb-4 ${
              isDark ? 'border-[#8B9CFF]' : 'border-[#5C6AC4]'
            }`} />
            <p className={`text-xs font-bold uppercase tracking-widest ${
              isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'
            }`}>Preparing your space...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {isSearchMode || searchQuery.trim() !== '' ? (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                key="search-results"
                className="pt-4"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
                    {filteredMeditations.length} {filteredMeditations.length === 1 ? 'Result' : 'Results'} {viewMode === 'saved' ? 'in Saved' : ''}
                  </h2>
                  <button
                    onClick={clearFilters}
                    className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'}`}
                  >
                    Clear All
                  </button>
                </div>

                {filteredMeditations.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {filteredMeditations.map((meditation, idx) => (
                      <motion.div
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: shouldReduceMotion ? 0 : idx * 0.05 }}
                        key={`search-${meditation.id}`}
                      >
                        <MeditationCard 
                          meditation={meditation}
                          isSubscribed={isPremium}
                          onPress={onSelectMeditation}
                          onOpenPaywall={onOpenPaywall}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div 
                    role="status"
                    aria-live="polite"
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                      isDark ? 'bg-white/5 text-[#9CA3AF]' : 'bg-black/5 text-[#4B5563]'
                    }`}>
                      <Search size={32} opacity={0.3} />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
                      No sessions found
                    </h3>
                    <p className={`text-sm font-medium max-w-[240px] ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                      Try adjusting your filters or search terms to find what you're looking for.
                    </p>
                    <button
                      onClick={clearFilters}
                      className={`mt-8 px-8 py-3 rounded-full font-bold text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${
                        isDark ? 'bg-white/10 text-[#F3F4F6]' : 'bg-black/10 text-[#111111]'
                      }`}
                    >
                      Reset Search
                    </button>
                  </div>
                )}
              </motion.div>
            ) : viewMode === 'saved' ? (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                key="saved-view"
                className="pt-4"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
                    Your Collection
                  </h2>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#9CA3AF] opacity-60' : 'text-[#4B5563] opacity-80'}`}>
                    {favoriteMeditations.length} {favoriteMeditations.length === 1 ? 'Session' : 'Sessions'}
                  </span>
                </div>

                {favoriteMeditations.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {favoriteMeditations.map((meditation, idx) => (
                      <motion.div
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: shouldReduceMotion ? 0 : idx * 0.05 }}
                        key={`saved-${meditation.id}`}
                      >
                        <MeditationCard 
                          meditation={meditation}
                          isSubscribed={isPremium}
                          onPress={onSelectMeditation}
                          onOpenPaywall={onOpenPaywall}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                      isDark ? 'bg-white/5 text-[#9CA3AF]' : 'bg-black/5 text-[#4B5563]'
                    }`}>
                      <Bookmark size={32} opacity={0.3} />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
                      Your collection is empty
                    </h3>
                    <p className={`text-sm font-medium max-w-[240px] ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                      Save sessions you love to find them quickly later.
                    </p>
                    <button
                      onClick={() => handleSwitchMode('explore')}
                      className={`mt-8 px-8 py-3 rounded-full font-bold text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${
                        isDark ? 'bg-white/10 text-[#F3F4F6]' : 'bg-black/10 text-[#111111]'
                      }`}
                    >
                      Explore Sessions
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                key="library-sections"
              >
                {/* Continue Session */}
                {continueSession && (
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                    key="continue-section"
                  >
                    <ContinueCard 
                      meditation={continueSession.meditation}
                      progressPercent={continueSession.progressPercent}
                      onPress={onSelectMeditation}
                    />
                  </motion.div>
                )}

                {/* AI Recommendation */}
                {recommendedMeditation && (
                  <motion.section
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.1 }}
                    key="recommended-section"
                    className="mb-16"
                    aria-labelledby="daily-pick-title"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h2 id="daily-pick-title" className={`text-xl font-bold tracking-tight ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
                        Daily Pick
                      </h2>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#9CA3AF] opacity-60' : 'text-[#4B5563] opacity-80'}`}>
                        Personalized
                      </span>
                    </div>
                    <RecommendedMeditationCard 
                      meditation={recommendedMeditation}
                      isSubscribed={isPremium}
                      onPress={onSelectMeditation}
                      onOpenPaywall={onOpenPaywall}
                      recommendationReason={recommendationReason}
                    />
                  </motion.section>
                )}

                {/* Featured Section */}
                {featuredMeditations.length > 0 && (
                  <motion.section 
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.15 }}
                    key="featured-section"
                    className="mb-16"
                    aria-labelledby="featured-title"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h2 id="featured-title" className={`text-xl font-bold tracking-tight ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
                        Featured Sessions
                      </h2>
                      <Sparkles size={18} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} aria-hidden="true" />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {featuredMeditations.map((meditation, idx) => (
                        <motion.div
                          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: shouldReduceMotion ? 0 : 0.2 + (idx * 0.1) }}
                          key={`featured-${meditation.id}`}
                        >
                          <MeditationCard 
                            meditation={meditation}
                            isSubscribed={isPremium}
                            onPress={onSelectMeditation}
                            onOpenPaywall={onOpenPaywall}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* AI Mood Check Quick Access */}
                <motion.button
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  onClick={onOpenMood}
                  key="mood-check-section"
                  aria-label="Open AI Mood Check"
                  className={`w-full p-6 rounded-[32px] border flex items-center gap-5 active:scale-[0.98] transition-all shadow-md group mb-16 ${
                    isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-transform group-hover:rotate-12 ${
                    isDark ? 'bg-[#8B9CFF]/10 text-[#8B9CFF]' : 'bg-[#5C6AC4]/10 text-[#5C6AC4]'
                  }`}>
                    <Sparkles size={28} className={shouldReduceMotion ? '' : 'animate-pulse'} aria-hidden="true" />
                  </div>
                  <div className="text-left flex-1">
                    <h2 className={`text-base font-bold uppercase tracking-wider ${
                      isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'
                    }`}>AI Mood Check</h2>
                    <p className={`text-sm font-medium ${
                      isDark ? 'text-[#9CA3AF] opacity-70' : 'text-[#4B5563] opacity-90'
                    }`}>Find the perfect session for now</p>
                  </div>
                </motion.button>

                {/* New & Trending Section */}
                {newMeditations.length > 0 && (
                  <motion.section 
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.25 }}
                    key="new-section"
                    className="mb-16"
                    aria-labelledby="new-trending-title"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h2 id="new-trending-title" className={`text-xl font-bold tracking-tight ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
                        New & Trending
                      </h2>
                      <div className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">
                        Latest
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {newMeditations.map((meditation, idx) => (
                        <motion.div
                          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: shouldReduceMotion ? 0 : 0.3 + (idx * 0.1) }}
                          key={`new-${meditation.id}`}
                        >
                          <MeditationCard 
                            meditation={meditation}
                            isSubscribed={isPremium}
                            onPress={onSelectMeditation}
                            onOpenPaywall={onOpenPaywall}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* Goal-based Section */}
                {goalMeditations.length > 0 && (
                  <motion.section 
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.3 }}
                    key="goal-section"
                    className="mb-16"
                    aria-labelledby="goal-title"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDark ? 'bg-[#8B9CFF]/10 text-[#8B9CFF]' : 'bg-[#5C6AC4]/10 text-[#5C6AC4]'}`}>
                        <Target size={20} aria-hidden="true" />
                      </div>
                      <h2 id="goal-title" className={`text-xl font-bold tracking-tight ${
                        isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'
                      }`}>For your {primaryGoal}</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {goalMeditations.map((meditation, idx) => (
                        <motion.div
                          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: shouldReduceMotion ? 0 : 0.4 + (idx * 0.1) }}
                          key={meditation.id}
                        >
                          <MeditationCard 
                            meditation={meditation}
                            isSubscribed={isPremium}
                            onPress={onSelectMeditation}
                            onOpenPaywall={onOpenPaywall}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* Duration-based Section */}
                {durationMeditations.length > 0 && (
                  <motion.section 
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.5 }}
                    key="duration-section"
                    className="mb-16"
                    aria-labelledby="duration-title"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDark ? 'bg-[#8B9CFF]/10 text-[#8B9CFF]' : 'bg-[#5C6AC4]/10 text-[#5C6AC4]'}`}>
                        <Clock size={20} aria-hidden="true" />
                      </div>
                      <h2 id="duration-title" className={`text-xl font-bold tracking-tight ${
                        isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'
                      }`}>Perfect {userProfile?.preferredDuration || 15}m sessions</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {durationMeditations.map((meditation, idx) => (
                        <motion.div
                          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: shouldReduceMotion ? 0 : 0.6 + (idx * 0.1) }}
                          key={meditation.id}
                        >
                          <MeditationCard 
                            meditation={meditation}
                            isSubscribed={isPremium}
                            onPress={onSelectMeditation}
                            onOpenPaywall={onOpenPaywall}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* All Categories */}
                <div className="mt-20 mb-10">
                  <h2 className={`text-xs font-bold uppercase tracking-[0.3em] ${
                    isDark ? 'text-[#9CA3AF] opacity-60' : 'text-[#4B5563] opacity-80'
                  }`}>Explore All</h2>
                </div>

                {sections.map((section, sIdx) => (
                  <motion.section 
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.8 + (sIdx * 0.1) }}
                    key={section.title} 
                    className="mb-12"
                    aria-labelledby={`section-title-${sIdx}`}
                  >
                    <h2 id={`section-title-${sIdx}`} className={`text-xl font-bold tracking-tight mb-8 ${
                      isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'
                    }`}>{section.title}</h2>
                    <div className="grid grid-cols-1 gap-2">
                      {section.data.map((meditation, mIdx) => (
                        <motion.div
                          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: shouldReduceMotion ? 0 : 0.9 + (sIdx * 0.1) + (mIdx * 0.05) }}
                          key={meditation.id}
                        >
                          <MeditationCard 
                            meditation={meditation}
                            isSubscribed={isPremium}
                            onPress={onSelectMeditation}
                            onOpenPaywall={onOpenPaywall}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
});
