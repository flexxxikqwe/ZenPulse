import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Shield, 
  FileText, 
  HelpCircle, 
  RefreshCcw, 
  CreditCard, 
  Trash2, 
  RotateCcw,
  ChevronRight,
  AlertTriangle,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUserProfile } from '../context/UserProfileContext';
import { useToast } from '../components/ToastProvider';
import { accountService } from '../services/accountService';

interface Props {
  onBack: () => void;
}

interface SettingsRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}

const SettingsRow = ({ icon, title, subtitle, onClick, rightElement, destructive }: SettingsRowProps) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <button 
      onClick={onClick}
      aria-label={`${title}${subtitle ? `: ${subtitle}` : ''}`}
      className={`w-full flex items-center justify-between p-5 rounded-[24px] transition-all active:scale-[0.98] mb-3 border focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${
        isDark 
          ? 'bg-[#1A1D24] border-white/5 hover:bg-[#232730]' 
          : 'bg-white border-black/5 hover:bg-gray-50 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
          destructive 
            ? 'bg-red-500/10 text-red-500' 
            : (isDark ? 'bg-[#8B9CFF]/10 text-[#8B9CFF]' : 'bg-[#5C6AC4]/10 text-[#5C6AC4]')
        }`}>
          {React.cloneElement(icon as React.ReactElement, { "aria-hidden": "true" })}
        </div>
        <div className="text-left">
          <h3 className={`text-sm font-bold ${
            destructive ? 'text-red-500' : (isDark ? 'text-[#F3F4F6]' : 'text-[#111111]')
          }`}>{title}</h3>
          {subtitle && (
            <p className={`text-[10px] font-bold ${isDark ? 'text-[#9CA3AF] opacity-70' : 'text-[#4B5563] opacity-90'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {rightElement || <ChevronRight size={16} className="opacity-30" aria-hidden="true" />}
    </button>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  return (
    <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ml-4 mt-8 ${
      isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
    }`}>
      {children}
    </h2>
  );
};

export const SettingsScreen = ({ onBack }: Props) => {
  const { currentTheme, toggleTheme } = useTheme();
  const { resetProfile, restoreSubscription, userProfile } = useUserProfile();
  const { showToast } = useToast();
  const isDark = currentTheme === 'dark';
  const shouldReduceMotion = useReducedMotion();
  const [confirmAction, setConfirmAction] = useState<'reset' | 'delete' | null>(null);

  const handleMockAction = (action: string) => {
    showToast(`${action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} will be available soon.`, 'info');
  };

  const handleRestore = () => {
    restoreSubscription();
    showToast('Subscription restored successfully.', 'success');
  };

  const handleReset = () => {
    accountService.mockResetProgress(userProfile);
    resetProfile();
    showToast('Progress has been reset.', 'success');
    onBack();
  };

  const handleDelete = () => {
    accountService.mockDeleteAccount(userProfile);
    resetProfile();
    showToast('Account deleted successfully.', 'success');
    onBack();
  };

  return (
    <motion.div 
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 100 }}
      className={`fixed inset-0 z-50 flex flex-col overflow-y-auto no-scrollbar transition-colors duration-300 ${isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'}`}
    >
      <div className="pt-16 pb-10 px-6 flex flex-col min-h-full max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <button 
            onClick={onBack}
            aria-label="Go back"
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform shrink-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${
              isDark ? 'bg-[#1A1D24] text-[#F3F4F6]' : 'bg-white text-[#111111] shadow-sm border border-black/5'
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>Settings</h1>
        </div>

        {/* Appearance */}
        <SectionTitle>Appearance</SectionTitle>
        <SettingsRow 
          icon={isDark ? <Moon size={20} /> : <Sun size={20} />}
          title="Appearance"
          subtitle={isDark ? "Dark Mode Active" : "Light Mode Active"}
          onClick={toggleTheme}
          rightElement={
            <div className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-[#8B9CFF]' : 'bg-gray-200'}`}>
              <motion.div 
                animate={{ x: isDark ? 26 : 2 }}
                className="w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm"
              />
            </div>
          }
        />

        {/* Subscription */}
        <SectionTitle>Subscription</SectionTitle>
        <SettingsRow 
          icon={<CreditCard size={20} />}
          title="Manage Subscription"
          subtitle="View and change your plan"
          onClick={() => handleMockAction('manage_subscription')}
        />
        <SettingsRow 
          icon={<RefreshCcw size={20} />}
          title="Restore Purchases"
          subtitle="Recover previous transactions"
          onClick={handleRestore}
        />

        {/* Support & Feedback */}
        <SectionTitle>Support & Feedback</SectionTitle>
        <SettingsRow 
          icon={<HelpCircle size={20} />}
          title="Contact Support"
          subtitle="Get help with your account"
          onClick={() => handleMockAction('contact_support')}
        />

        {/* Legal */}
        <SectionTitle>Legal</SectionTitle>
        <SettingsRow 
          icon={<Shield size={20} />}
          title="Privacy Policy"
          onClick={() => handleMockAction('privacy_policy')}
        />
        <SettingsRow 
          icon={<FileText size={20} />}
          title="Terms of Service"
          onClick={() => handleMockAction('terms_of_service')}
        />

        {/* Account Actions */}
        <SectionTitle>Account Actions</SectionTitle>
        <SettingsRow 
          icon={<RotateCcw size={20} />}
          title="Reset Progress"
          subtitle="Clear all data and onboarding"
          onClick={() => setConfirmAction('reset')}
        />
        <SettingsRow 
          icon={<Trash2 size={20} />}
          title="Delete Account"
          subtitle="Permanently remove your data"
          destructive
          onClick={() => setConfirmAction('delete')}
        />

        {/* Version Info */}
        <div className="mt-12 pb-8 text-center">
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-[#9CA3AF] opacity-60' : 'text-[#4B5563] opacity-80'}`}>
            ZenPulse v1.2.4 (Build 108)
          </p>
          <p className={`text-[9px] font-medium mt-1 ${isDark ? 'text-[#9CA3AF] opacity-40' : 'text-[#4B5563] opacity-60'}`}>
            Made with mindfulness in London
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-desc"
        >
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-sm rounded-[32px] p-8 border shadow-2xl ${
              isDark ? 'bg-[#1A1D24] border-white/10' : 'bg-white border-black/5'
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertTriangle size={24} aria-hidden="true" />
              </div>
              <h3 id="confirm-title" className={`text-lg font-bold ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
                {confirmAction === 'reset' ? 'Reset Progress?' : 'Delete Account?'}
              </h3>
            </div>
            
            <p id="confirm-desc" className={`text-sm font-medium mb-8 leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
              {confirmAction === 'reset' 
                ? 'Are you sure you want to reset all your preferences and progress? This cannot be undone.'
                : 'Are you sure you want to delete your account? This action is permanent and all your data will be lost.'}
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmAction === 'reset' ? handleReset : handleDelete}
                className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold text-sm active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 outline-none"
              >
                {confirmAction === 'reset' ? 'Yes, Reset Progress' : 'Yes, Delete Account'}
              </button>
              <button 
                onClick={() => setConfirmAction(null)}
                className={`w-full py-4 rounded-2xl font-bold text-sm active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${
                  isDark ? 'bg-white/5 text-[#F3F4F6]' : 'bg-black/5 text-[#111111]'
                }`}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
