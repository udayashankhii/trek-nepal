import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { fetchBookingDetail } from "../../api/service/bookingServices";

const formatMoney = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingRef =
    searchParams.get("bookingRef") ||
    searchParams.get("booking_ref") ||
    searchParams.get("bookingId") ||
    "";
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const isReceiptAvailable = useMemo(() => Boolean(booking?.receipt_url), [booking]);
  const summaryItems = [
    { label: "Booking Reference", value: booking?.booking_ref },
    { label: "Trek", value: booking?.trek_title },
    { label: "Travel Dates", value: `${booking?.start_date} – ${booking?.end_date}` },
    { label: "Party Size", value: booking?.party_size },
    {
      label: "Total Paid",
      value: formatMoney(Number(booking?.total_amount || 0), booking?.currency || "USD"),
    },
  ];

  useEffect(() => {
    if (!bookingRef) {
      setError("Booking reference missing.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchBookingDetail({ bookingRef })
      .then((data) => {
        setBooking(data);
      })
      .catch((err) => {
        setError(err.message || "Unable to load booking.");
      })
      .finally(() => setLoading(false));
  }, [bookingRef]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Fetching booking confirmation…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 rounded-full bg-gray-900 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-indigo-50">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-3xl bg-white p-10 shadow-2xl space-y-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-14 h-14 text-emerald-500" />
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-500">
                Payment complete
              </p>
              <h1 className="text-3xl font-bold text-gray-900">Booking confirmed</h1>
              <p className="text-sm text-gray-600">
                A confirmation email and receipt have been sent to {booking?.lead_email}.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
            <div className="rounded-3xl border border-gray-200 bg-slate-50 p-6 space-y-3 text-sm text-slate-700">
              {summaryItems.map((item) => (
                <div key={item.label} className="flex justify-between border-b border-gray-200 pb-3 last:border-none last:pb-0">
                  <span className="font-semibold text-gray-900">{item.label}</span>
                  <span className="text-right">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Receipt & email</p>
              <p className="text-sm text-gray-600">
                A receipt has been emailed to {booking?.lead_email} and is available below.
              </p>
              {isReceiptAvailable ? (
                <a
                  href={booking.receipt_url}
                  rel="noreferrer"
                  target="_blank"
                  className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-center text-white transition hover:bg-emerald-700"
                >
                  Download Receipt
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex w-full items-center justify-center rounded-full border border-dashed border-emerald-200 px-6 py-3 text-center text-emerald-600"
                >
                  Receipt will arrive shortly
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-center text-slate-900 hover:bg-slate-50"
            >
              Back to homepage
            </button>
          </div>

          <p className="text-center text-sm text-slate-500">
            Need help? Reach us at support@evertreknepal.com or reply to the confirmation email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
