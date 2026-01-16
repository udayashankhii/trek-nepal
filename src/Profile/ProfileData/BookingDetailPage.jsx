import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    CheckCircle,
    Calendar,
    Users,
    MapPin,
    Clock,
    CreditCard,
    Download,
    ArrowLeft,
    Loader2,
    AlertCircle
} from "lucide-react";
import { fetchBookingDetail } from "../../api/bookingServices";

export default function BookingDetailPage() {
    const { bookingRef } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBooking = async () => {
            if (!bookingRef) return;
            try {
                setLoading(true);
                const data = await fetchBookingDetail(bookingRef);
                setBooking(data);
            } catch (err) {
                console.error("Failed to load booking:", err);
                setError(err.message || "Unable to load booking details");
            } finally {
                setLoading(false);
            }
        };

        loadBooking();
    }, [bookingRef]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Unavailable</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (!booking) return null;

    const isPaid = booking.status === "paid" || booking.status === "confirmed";
    const statusColor = isPaid ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50";

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link
                    to="/profile"
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Bookings
                </Link>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10 text-white text-center">
                        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Booking Confirmed</h1>
                        <p className="text-blue-100 text-lg">
                            Thank you, {booking.lead_first_name}! Your adventure awaits.
                        </p>
                    </div>

                    <div className="p-8">
                        {/* Reference Number */}
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                            <div className="text-center sm:text-left mb-4 sm:mb-0">
                                <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
                                <p className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
                                    {booking.booking_ref}
                                </p>
                            </div>
                            <div className={`px-4 py-2 rounded-full font-semibold text-sm ${statusColor}`}>
                                {booking.status?.toUpperCase() || "CONFIRMED"}
                            </div>
                        </div>

                        {/* Trek Details */}
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            Trip Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Trek Name</p>
                                    <p className="font-semibold text-gray-900 text-lg">
                                        {booking.trek_title || booking.trek_slug}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Dates</p>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>
                                            {booking.start_date} <span className="text-gray-400">→</span> {booking.end_date}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Travelers</p>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span>{booking.party_size} {booking.party_size === 1 ? 'Person' : 'People'}</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                    <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                                        <CreditCard className="w-4 h-4 text-gray-400" />
                                        <span>
                                            {new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: booking.currency || 'USD'
                                            }).format(booking.total_amount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lead Guest */}
                        <div className="border-t border-gray-100 pt-8 mb-8">
                            <h3 className="font-semibold text-gray-900 mb-4">Lead Guest Information</h3>
                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Name</p>
                                    <p className="font-medium text-gray-900">{booking.lead_title} {booking.lead_first_name} {booking.lead_last_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Email</p>
                                    <p className="font-medium text-gray-900">{booking.lead_email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Phone</p>
                                    <p className="font-medium text-gray-900">{booking.lead_phone}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Country</p>
                                    <p className="font-medium text-gray-900">{booking.country}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => window.print()}
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Receipt
                            </button>
                            <button
                                onClick={() => navigate(`/treks/${booking.trek_slug}`)}
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 transition-colors"
                            >
                                View Trek Details
                            </button>
                        </div>

                    </div>
                </div>

                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>Need help? Contact us at <a href="mailto:support@evertreknepal.com" className="text-blue-600 hover:underline">support@evertreknepal.com</a></p>
                </div>
            </div>
        </div>
    );
}
