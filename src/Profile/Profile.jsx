// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  Loader2,
  Shield,
  Bell,
  Globe,
  ChevronRight,
} from "lucide-react";
import { getCurrentUser, getAccessToken } from "../api/auth/auth.api";
import { fetchUserBookings } from "../api/service/bookingServices";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    dateOfBirth: "",
  });

  // Avatar upload state
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Check authentication and load user data
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      toast.error("Please log in to view your profile");
      navigate("/");
      return;
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        location: currentUser.location || "Kathmandu, Nepal",
        bio: currentUser.bio || "",
        dateOfBirth: currentUser.dateOfBirth || "",
      });
      setAvatarPreview(currentUser.avatar || null);
    }

    setLoading(false);
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Load user bookings
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchUserBookings();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setBookingsLoading(false);
      }
    };
    loadBookings();
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save profile
  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setSaving(true);

    try {
      // Simulate API call - Replace with your actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Implement your actual API call here
      // const response = await updateUserProfile(formData, avatarFile);

      toast.success("Profile updated successfully! 🎉");
      setIsEditing(false);

      // Update local user state
      setUser({ ...user, ...formData });
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "Kathmandu, Nepal",
      bio: user.bio || "",
      dateOfBirth: user.dateOfBirth || "",
    });
    setAvatarPreview(user.avatar || null);
    setAvatarFile(null);
    setErrors({});
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name, email) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email ? email.charAt(0).toUpperCase() : "U";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#1F7A63] mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
        
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F2A44]">
            My Profile
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-6">
              {/* Avatar Section */}
              <div className="relative mb-6">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover ring-4 ring-gray-100"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1F7A63] to-[#0F2A44] 
                                  flex items-center justify-center text-white text-2xl sm:text-3xl font-bold 
                                  ring-4 ring-gray-100">
                      {getUserInitials(formData.name, formData.email)}
                    </div>
                  )}

                  {/* Edit Avatar Button */}
                  {isEditing && (
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#1F7A63] 
                               rounded-full flex items-center justify-center cursor-pointer 
                               hover:bg-[#186854] transition-colors shadow-lg group"
                    >
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="text-center mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                  {formData.name || "User"}
                </h2>
                <p className="text-sm text-gray-500 mb-3">{formData.email}</p>
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{formData.location || "Location not set"}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 py-4 border-t border-b border-gray-100">
                <div className="text-center">
                  <p className="text-lg sm:text-xl font-bold text-[#1F7A63]">{bookings.length}</p>
                  <p className="text-xs text-gray-600">Bookings</p>
                </div>
                <div className="text-center border-x border-gray-100">
                  <p className="text-lg sm:text-xl font-bold text-[#1F7A63]">0</p>
                  <p className="text-xs text-gray-600">Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-lg sm:text-xl font-bold text-[#1F7A63]">0</p>
                  <p className="text-xs text-gray-600">Saved</p>
                </div>
              </div>

              {/* Member Since */}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Card Header */}
              <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-100 
                            flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Personal Information
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Update your personal details and information
                  </p>
                </div>

                {/* Edit/Cancel Button */}
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                             text-[#1F7A63] bg-[#1F7A63]/10 rounded-lg hover:bg-[#1F7A63]/20 
                             transition-colors self-start sm:self-auto"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                             text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 
                             transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                             self-start sm:self-auto"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="px-6 sm:px-8 py-6 sm:py-8">
                <div className="space-y-5 sm:space-y-6">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 
                                     w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing || saving}
                        placeholder="Enter your full name"
                        className={`
                          w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3
                          text-sm sm:text-base
                          rounded-lg border transition-all
                          ${errors.name
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-[#1F7A63] focus:border-[#1F7A63]'
                          }
                          focus:ring-2 focus:outline-none
                          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                        `}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 
                                     w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing || saving}
                        placeholder="your.email@example.com"
                        className={`
                          w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3
                          text-sm sm:text-base
                          rounded-lg border transition-all
                          ${errors.email
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-[#1F7A63] focus:border-[#1F7A63]'
                          }
                          focus:ring-2 focus:outline-none
                          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                        `}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 
                                      w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing || saving}
                        placeholder="+977 98XXXXXXXX"
                        className={`
                          w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3
                          text-sm sm:text-base
                          rounded-lg border transition-all
                          ${errors.phone
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-[#1F7A63] focus:border-[#1F7A63]'
                          }
                          focus:ring-2 focus:outline-none
                          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                        `}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 
                                       w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                      <input
                        id="location"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        disabled={!isEditing || saving}
                        placeholder="City, Country"
                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3
                                 text-sm sm:text-base
                                 rounded-lg border border-gray-300
                                 focus:ring-2 focus:ring-[#1F7A63] focus:border-[#1F7A63] focus:outline-none
                                 transition-all
                                 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 
                                         w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                      <input
                        id="dateOfBirth"
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        disabled={!isEditing || saving}
                        max={new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3
                                 text-sm sm:text-base
                                 rounded-lg border border-gray-300
                                 focus:ring-2 focus:ring-[#1F7A63] focus:border-[#1F7A63] focus:outline-none
                                 transition-all
                                 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing || saving}
                      rows={4}
                      maxLength={500}
                      placeholder="Tell us about yourself..."
                      className={`
                        w-full px-4 py-3 text-sm sm:text-base
                        rounded-lg border transition-all resize-none
                        ${errors.bio
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-[#1F7A63] focus:border-[#1F7A63]'
                        }
                        focus:ring-2 focus:outline-none
                        disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                      `}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.bio ? (
                        <p className="text-xs sm:text-sm text-red-500">{errors.bio}</p>
                      ) : (
                        <div></div>
                      )}
                      <p className="text-xs text-gray-500">
                        {formData.bio.length}/500
                      </p>
                    </div>
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 sm:py-3
                               text-sm sm:text-base font-semibold
                               bg-[#1F7A63] text-white rounded-lg
                               hover:bg-[#186854] focus:bg-[#186854]
                               focus:ring-4 focus:ring-[#1F7A63]/30 focus:outline-none
                               transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center justify-center gap-2
                               transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* My Bookings Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-100">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">My Bookings</h3>
              </div>
              <div className="p-6">
                {bookingsLoading ? (
                  <div className="text-center py-4"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No bookings yet.</p>
                    <button onClick={() => navigate('/trekking-in-nepal')} className="mt-2 text-[#1F7A63] font-medium hover:underline">Explore Treks</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.booking_ref} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="mb-4 sm:mb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">{booking.trek_title || booking.trek_slug}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${booking.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                              {booking.status?.toUpperCase() || 'PENDING'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {booking.start_date}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">Ref: {booking.booking_ref}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/bookings/${booking.booking_ref}`)}
                          className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Settings Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Security Card */}
              <button
                onClick={() => navigate("/settings/security")}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6
                         hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 
                                  flex items-center justify-center">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                        Security
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Password & security
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 
                                         transition-colors" />
                </div>
              </button>

              {/* Notifications Card */}
              <button
                onClick={() => navigate("/settings/notifications")}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6
                         hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-50 
                                  flex items-center justify-center">
                      <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                        Notifications
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Manage preferences
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 
                                         transition-colors" />
                </div>
              </button>

              {/* Language Card */}
              <button
                onClick={() => navigate("/settings/language")}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6
                         hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-50 
                                  flex items-center justify-center">
                      <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                        Language
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500">English (US)</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 
                                         transition-colors" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
