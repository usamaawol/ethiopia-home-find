import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Building2, MapPin, PlusCircle, List, Shield, User,
  Languages, Moon, Sun, LogIn, UserPlus, ChevronLeft, Menu, X, LogOut,
} from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, isMobile }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, isOwner, isAdmin, logout, profile } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'nav.home', show: true },
    { path: '/browse', icon: Building2, label: 'nav.browse', show: true },
    { path: '/cities', icon: MapPin, label: 'nav.cities', show: true },
    { divider: true, show: isLoggedIn && isOwner },
    { path: '/add-listing', icon: PlusCircle, label: 'nav.addListing', show: isLoggedIn && isOwner },
    { path: '/my-listings', icon: List, label: 'nav.myListings', show: isLoggedIn && isOwner },
    { divider: true, show: isAdmin },
    { path: '/admin', icon: Shield, label: 'nav.adminDashboard', show: isAdmin },
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
    { code: 'om', label: 'Afaan Oromo', flag: '🇪🇹' },
  ];

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: isMobile ? -280 : 0, opacity: isMobile ? 0 : 1 },
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed left-0 top-0 h-full z-50 flex flex-col',
          'bg-sidebar text-sidebar-foreground',
          'border-r border-sidebar-border',
          isOpen ? 'w-64' : 'w-16',
          isMobile && !isOpen && 'pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-sm text-sidebar-foreground">HouseRent</span>
                  <span className="text-[10px] text-sidebar-primary">Connect</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={onToggle} className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
            {isMobile ? <X className="w-5 h-5" /> : isOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item, idx) => {
            if (!item.show) return null;
            if ('divider' in item && item.divider) {
              return <div key={idx} className="h-px bg-sidebar-border my-3" />;
            }
            const Icon = item.icon!;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path!}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  'hover:bg-sidebar-accent group',
                  isActive && 'bg-sidebar-accent border-l-2 border-sidebar-primary'
                )}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0 transition-colors', isActive ? 'text-sidebar-primary' : 'text-sidebar-muted group-hover:text-sidebar-foreground')} />
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={cn('text-sm font-medium whitespace-nowrap', isActive ? 'text-sidebar-foreground' : 'text-sidebar-muted group-hover:text-sidebar-foreground')}
                    >
                      {t(item.label!)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-sidebar-border space-y-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent transition-colors group"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-sidebar-primary" /> : <Moon className="w-5 h-5 text-sidebar-muted group-hover:text-sidebar-foreground" />}
            {isOpen && (
              <span className="text-sm text-sidebar-muted group-hover:text-sidebar-foreground">
                {theme === 'dark' ? t('theme.light') : t('theme.dark')}
              </span>
            )}
          </button>

          {/* Language selector */}
          {isOpen && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3">
                <Languages className="w-4 h-4 text-sidebar-muted" />
                <span className="text-xs text-sidebar-muted uppercase tracking-wider">{t('language')}</span>
              </div>
              <div className="flex gap-1 px-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                      'flex-1 py-1.5 px-2 rounded text-xs font-medium transition-all',
                      language === lang.code
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'bg-sidebar-accent text-sidebar-muted hover:text-sidebar-foreground'
                    )}
                  >
                    {lang.flag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Auth links */}
          <div className="space-y-1">
            {isLoggedIn ? (
              <>
                {/* User info */}
                {isOpen && profile && (
                  <div className="px-3 py-2 rounded-lg bg-sidebar-accent/50">
                    <p className="text-xs text-sidebar-muted truncate">{profile.email}</p>
                    <p className="text-xs text-sidebar-primary capitalize">{profile.role}</p>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    'hover:bg-sidebar-accent group'
                  )}
                >
                  <LogOut className="w-5 h-5 flex-shrink-0 text-sidebar-muted group-hover:text-sidebar-foreground" />
                  {isOpen && <span className="text-sm font-medium text-sidebar-muted group-hover:text-sidebar-foreground">{t('nav.logout')}</span>}
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    'hover:bg-sidebar-accent group',
                    location.pathname === '/login' && 'bg-sidebar-accent'
                  )}
                >
                  <LogIn className={cn('w-5 h-5 flex-shrink-0', location.pathname === '/login' ? 'text-sidebar-primary' : 'text-sidebar-muted group-hover:text-sidebar-foreground')} />
                  {isOpen && <span className={cn('text-sm font-medium', location.pathname === '/login' ? 'text-sidebar-foreground' : 'text-sidebar-muted group-hover:text-sidebar-foreground')}>{t('nav.login')}</span>}
                </NavLink>
                <NavLink
                  to="/register"
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    'hover:bg-sidebar-accent group',
                    location.pathname === '/register' && 'bg-sidebar-accent'
                  )}
                >
                  <UserPlus className={cn('w-5 h-5 flex-shrink-0', location.pathname === '/register' ? 'text-sidebar-primary' : 'text-sidebar-muted group-hover:text-sidebar-foreground')} />
                  {isOpen && <span className={cn('text-sm font-medium', location.pathname === '/register' ? 'text-sidebar-foreground' : 'text-sidebar-muted group-hover:text-sidebar-foreground')}>{t('nav.register')}</span>}
                </NavLink>
              </>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
