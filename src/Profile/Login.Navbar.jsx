

// src/components/LoginNavbar.jsx - Premium Optimized Version
import { useEffect, useState } from "react";
import { 
  Menu, 
  MenuButton, 
  MenuItem, 
  MenuItems, 
  Transition, 
  Dialog, 
  DialogPanel, 
  DialogTitle 
} from '@headlessui/react';
import LoginForm from "./Login/LoginForm";
import { 
  X, 
  LogOut, 
  User, 
  ChevronDown, 
  AlertTriangle, 
  CreditCard,
} from "lucide-react";
import { getAccessToken, logout, getCurrentUser } from "../api/auth/auth.api.js";

const LoginNavbar = ({ className = "" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Enhanced avatar logic with fallback
  const getUserAvatar = (email, name) => {
    if (!email) return { type: 'icon', content: <User className="w-4 h-4" /> };
    
    if (name) {
      const initials = name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      return { type: 'text', content: initials };
    }
    
    return { type: 'text', content: email.charAt(0).toUpperCase() };
  };

  // Generate consistent color from email
  const getAvatarColor = (email) => {
    if (!email) return 'from-gray-500 to-gray-600';
    
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-green-500 to-green-600',
      'from-yellow-500 to-yellow-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
    ];
    
    const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Extract name from email if no name provided
  const getDisplayName = (email, name) => {
    if (name) return name;
    if (email) return email.split('@')[0];
    return 'User';
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = getAccessToken();
      setIsAuthenticated(Boolean(token));

      if (token) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [isModalOpen]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setIsAuthenticated(false);
      setUser(null);
      setShowLogoutConfirm(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      setIsAuthenticated(false);
      setShowLogoutConfirm(false);
      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  // Navigation handler for mobile - closes menu after navigation
  const handleNavigation = (url) => {
    window.location.href = url;
  };

  const avatar = user ? getUserAvatar(user.email, user.name) : null;
  const avatarColor = user ? getAvatarColor(user.email) : 'from-gray-500 to-gray-600';
  const displayName = user ? getDisplayName(user.email, user.name) : '';

  return (
    <>
      {isAuthenticated ? (
        <Menu as="div" className={`relative ${className}`}>
          {/* Mobile & Desktop Menu Button */}
          <MenuButton 
            className="group flex items-center gap-3 sm:gap-2.5 
                       px-1 sm:px-0 py-2 sm:py-2 
                       rounded-xl
                       bg-white/95 backdrop-blur-sm
                       border border-gray-200/80
                       hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100/50
                       active:scale-[0.97]
                       transition-all duration-200 ease-out
                       focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-1
                       min-h-[44px] touch-manipulation"
            aria-label="User menu"
          >
            {/* Avatar - Responsive sizing */}
            <div 
              className={`relative w-8 h-8 sm:w-9 sm:h-9 
                         rounded-full bg-gradient-to-br ${avatarColor}
                         flex items-center justify-center text-white 
                         text-sm font-semibold
                         shadow-md ring-2 ring-white 
                         group-hover:ring-gray-50 
                         group-hover:shadow-lg
                         transition-all duration-200`}
            >
              {avatar?.type === 'text' ? (
                <span>{avatar.content}</span>
              ) : (
                avatar?.content
              )}
              {/* Online status indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 
                             bg-emerald-500 rounded-full border-2 border-white 
                             shadow-sm" 
                    aria-hidden="true" />
            </div>
            
            {/* User info - Hidden on mobile, shown on tablet+ */}
            <div className="hidden md:flex flex-col items-start min-w-0 max-w-[120px] lg:max-w-[150px]">
              <span className="text-sm font-semibold text-gray-900 truncate w-full">
                {displayName}
              </span>
              <span className="text-xs text-gray-500 truncate w-full">
                {user?.email}
              </span>
            </div>
            
            {/* Chevron */}
            <ChevronDown 
              className="w-4 h-4 text-gray-400 
                       group-hover:text-gray-600 
                       transition-all duration-200
                       group-hover:translate-y-0.5" 
              aria-hidden="true"
            />
          </MenuButton>

          {/* Premium Dropdown Menu */}
          <Transition
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95 translate-y-[-10px]"
            enterTo="transform opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems 
              className="absolute right-0 mt-3
                       w-[calc(100vw-2rem)] max-w-[300px] sm:max-w-xs md:w-80
                       origin-top-right 
                       bg-white rounded-2xl 
                       shadow-2xl shadow-gray-900/10
                       ring-1 ring-black/5
                       backdrop-blur-xl
                       focus:outline-none z-50 overflow-hidden"
            >
              {/* User Info Header */}
              <div className="px-4 sm:px-5 py-4 sm:py-5 
                            bg-gradient-to-br from-gray-50/80 to-white 
                            border-b border-gray-100">
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div 
                    className={`w-12 h-12 sm:w-14 sm:h-14 
                               rounded-xl bg-gradient-to-br ${avatarColor}
                               flex items-center justify-center text-white 
                               text-lg font-bold shadow-lg`}
                  >
                    {avatar?.type === 'text' ? (
                      <span>{avatar.content}</span>
                    ) : (
                      avatar?.content
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-bold text-gray-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2 px-2">
                {/* View Profile */}
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className={`${
                        focus ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-gray-900' : 'text-gray-700'
                      } group flex items-center w-full 
                         px-3 sm:px-4 py-3.5 sm:py-4
                         text-sm sm:text-base rounded-xl
                         transition-all duration-200 ease-out
                         min-h-[52px] touch-manipulation`}
                    >
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 
                                    rounded-xl 
                                    ${focus ? 'bg-blue-100' : 'bg-blue-50'}
                                    flex items-center justify-center flex-shrink-0
                                    transition-colors duration-200`}>
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-3 sm:ml-3.5 flex-1 text-left min-w-0">
                        <p className="font-semibold truncate">View Profile</p>
                        <p className="text-xs text-gray-500 truncate">Manage your account</p>
                      </div>
                    </button>
                  )}
                </MenuItem>

                {/* My Bookings */}
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => handleNavigation('/bookings')}
                      className={`${
                        focus ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-gray-900' : 'text-gray-700'
                      } group flex items-center w-full 
                         px-3 sm:px-4 py-3.5 sm:py-4
                         text-sm sm:text-base rounded-xl
                         transition-all duration-200 ease-out
                         min-h-[52px] touch-manipulation`}
                    >
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 
                                    rounded-xl 
                                    ${focus ? 'bg-emerald-100' : 'bg-emerald-50'}
                                    flex items-center justify-center flex-shrink-0
                                    transition-colors duration-200`}>
                        <CreditCard className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="ml-3 sm:ml-3.5 flex-1 text-left min-w-0">
                        <p className="font-semibold truncate">My Bookings</p>
                        <p className="text-xs text-gray-500 truncate">View trek history</p>
                      </div>
                    </button>
                  )}
                </MenuItem>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-2" 
                   aria-hidden="true" />

              {/* Logout Section */}
              <div className="py-2 px-2">
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={handleLogoutClick}
                      className={`${
                        focus ? 'bg-red-50 text-red-700' : 'text-red-600'
                      } group flex items-center w-full 
                         px-3 sm:px-4 py-3.5 sm:py-4
                         text-sm sm:text-base font-semibold rounded-xl
                         transition-all duration-200 ease-out
                         min-h-[52px] touch-manipulation`}
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span>Log out</span>
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      ) : (
        // Not authenticated - Premium Login Button
        <div className={`flex items-center justify-end ${className}`}>
          <button
            onClick={openModal}
            className="group relative px-6 sm:px-8 py-2.5 sm:py-3
                     text-sm font-semibold text-white 
                     bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600
                     hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700
                     active:scale-[0.97]
                     rounded-xl 
                     shadow-lg shadow-blue-500/30
                     hover:shadow-xl hover:shadow-blue-600/40
                     transition-all duration-300 ease-out
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     min-h-[44px] touch-manipulation
                     overflow-hidden"
            aria-label="Log in"
          >
            {/* Shine effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent 
                           translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></span>
            <span className="relative">Log in</span>
          </button>
        </div>
      )}

      {/* Premium Login Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center 
                     bg-gradient-to-br from-black/70 via-black/60 to-black/70 
                     backdrop-blur-md animate-fadeIn px-0 sm:px-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-modal-title"
        >
          <div
            className="relative bg-white 
                       rounded-t-3xl sm:rounded-3xl 
                       shadow-2xl w-full sm:max-w-md 
                       max-h-[92vh] sm:max-h-[90vh] 
                       overflow-y-auto 
                       animate-slideUp sm:animate-none
                       border-t border-gray-100 sm:border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 sm:top-5 sm:right-5
                       text-gray-400 hover:text-gray-700 
                       hover:bg-gray-100
                       transition-all duration-200
                       p-2.5 rounded-full
                       min-h-[44px] min-w-[44px] touch-manipulation
                       flex items-center justify-center
                       z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <LoginForm 
              onClose={closeModal} 
              onSuccess={() => {
                closeModal();
                setIsAuthenticated(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Premium Logout Confirmation */}
      <Transition show={showLogoutConfirm}>
        <Dialog onClose={handleLogoutCancel} className="relative z-[200]">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-end sm:items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel 
                className="w-full max-w-sm 
                         transform overflow-hidden 
                         rounded-t-3xl sm:rounded-3xl 
                         bg-white p-6 sm:p-7
                         shadow-2xl transition-all 
                         border-t border-gray-100 sm:border"
              >
                {/* Icon */}
                <div className="flex items-center justify-center 
                              w-14 h-14 sm:w-16 sm:h-16
                              mx-auto mb-4 sm:mb-5
                              rounded-full bg-gradient-to-br from-red-50 to-red-100
                              shadow-lg shadow-red-100">
                  <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" />
                </div>

                {/* Title */}
                <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
                  Log out?
                </DialogTitle>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-7 leading-relaxed">
                  You'll need to sign in again to access your bookings and account settings.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleLogoutCancel}
                    disabled={isLoggingOut}
                    className="flex-1 px-5 py-3.5 sm:py-3
                             text-sm font-semibold text-gray-700 
                             bg-gray-100 hover:bg-gray-200
                             rounded-xl
                             active:scale-[0.97]
                             transition-all duration-200
                             focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
                             disabled:opacity-50 disabled:cursor-not-allowed
                             min-h-[48px] touch-manipulation order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogoutConfirm}
                    disabled={isLoggingOut}
                    className="flex-1 px-5 py-3.5 sm:py-3
                             text-sm font-semibold text-white 
                             bg-gradient-to-r from-red-600 to-red-700
                             hover:from-red-700 hover:to-red-800
                             active:scale-[0.97]
                             rounded-xl shadow-lg shadow-red-500/30
                             hover:shadow-xl hover:shadow-red-600/40
                             transition-all duration-200
                             focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2
                             min-h-[48px] touch-manipulation order-1 sm:order-2"
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Logging out...</span>
                      </>
                    ) : (
                      'Yes, log out'
                    )}
                  </button>
                </div>
              </DialogPanel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default LoginNavbar;
