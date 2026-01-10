// src/components/LoginNavbar.jsx
import { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems, Transition, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import LoginForm from "./Login/LoginForm";
import { X, LogOut, User, Settings, ChevronDown, AlertTriangle } from "lucide-react";
import { getAccessToken, logout, getCurrentUser } from "../api/auth.api.js";

const LoginNavbar = ({ className = "" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Get user initials for avatar
  const getUserInitials = (email) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  // Check authentication status
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

    // Listen for storage changes (multi-tab sync)
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

  return (
    <>
      <div
        className={`inline-flex items-center rounded-full bg-[#f1f1f1] px-0 py-0
          shadow-sm border border-black/5 ${className}`}
        style={{ minHeight: "35px" }}
      >
        {isAuthenticated ? (
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center gap-2 px-2 py-1.5 rounded-full 
                                   hover:bg-white hover:shadow-sm transition-all duration-200
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                              flex items-center justify-center text-white text-xs font-semibold
                              shadow-sm">
                {getUserInitials(user?.email)}
              </div>
              
              {/* User email (optional - can remove for cleaner look) */}
              {user?.email && (
                <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate
                                 hidden sm:block">
                  {user.email}
                </span>
              )}
              
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </MenuButton>

            {/* Dropdown Menu */}
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right 
                                    bg-white rounded-lg shadow-lg ring-1 ring-black/5
                                    focus:outline-none z-50 divide-y divide-gray-100">
                {/* User Info Section */}
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {user?.email}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() => window.location.href = '/profile'}
                        className={`${
                          focus ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                        } group flex items-center w-full px-4 py-2 text-sm transition-colors`}
                      >
                        <User className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-500" />
                        View Profile
                      </button>
                    )}
                  </MenuItem>

                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() => window.location.href = '/settings'}
                        className={`${
                          focus ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                        } group flex items-center w-full px-4 py-2 text-sm transition-colors`}
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-500" />
                        Settings
                      </button>
                    )}
                  </MenuItem>
                </div>

                {/* Logout Section */}
                <div className="py-1">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={handleLogoutClick}
                        className={`${
                          focus ? 'bg-red-50 text-red-700' : 'text-red-600'
                        } group flex items-center w-full px-4 py-2 text-sm transition-colors`}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Log out
                      </button>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        ) : (
          <>
            <button
              onClick={openModal}
              className="px-2.5 py-1.5 text-sm font-medium rounded-full 
                       text-gray-700 hover:bg-white hover:shadow-sm transition-colors"
              aria-label="Log in"
            >
              Log in
            </button>

            <button
              onClick={openModal}
              className="px-2.5 py-1.5 text-sm font-medium rounded-full 
                       text-gray-700 hover:bg-white hover:shadow-sm transition-colors"
              aria-label="Register"
            >
              Register
            </button>
          </>
        )}
      </div>

      {/* Login Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center 
                     bg-black/50 backdrop-blur-sm animate-fadeIn"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-modal-title"
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md 
                       mx-4 max-h-[90vh] overflow-y-auto animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 
                         transition-colors z-10 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
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

      {/* Logout Confirmation Dialog */}
      <Transition show={showLogoutConfirm}>
        <Dialog onClose={handleLogoutCancel} className="relative z-[200]">
          {/* Backdrop */}
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          {/* Dialog positioning */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl 
                                      bg-white p-6 shadow-xl transition-all">
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 
                              rounded-full bg-red-100">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>

                {/* Title */}
                <DialogTitle className="text-lg font-semibold text-gray-900 text-center mb-2">
                  Confirm Logout
                </DialogTitle>

                {/* Description */}
                <p className="text-sm text-gray-500 text-center mb-6">
                  Are you sure you want to log out? You'll need to log in again to access your account.
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleLogoutCancel}
                    disabled={isLoggingOut}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 
                             bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors
                             focus:outline-none focus:ring-2 focus:ring-gray-300
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogoutConfirm}
                    disabled={isLoggingOut}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white 
                             bg-red-600 rounded-lg hover:bg-red-700 transition-colors
                             focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? 'Logging out...' : 'Yes, log out'}
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
