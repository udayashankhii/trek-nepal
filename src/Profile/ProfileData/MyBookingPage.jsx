import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { fetchUserBookings } from "../../api/service/bookingServices";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUserBookings();
        setBookings(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div
              key={b.booking_ref}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{b.trek_title}</p>
                <p className="text-sm text-gray-500">Ref: {b.booking_ref}</p>
              </div>
              <button
                onClick={() => navigate(`/bookings/${b.booking_ref}`)}
                className="text-blue-600 hover:underline"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
