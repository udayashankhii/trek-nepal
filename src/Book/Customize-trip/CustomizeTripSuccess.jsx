import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle, MessageCircle } from "lucide-react";

const formatDate = (value) => {
  if (!value) return "Flexible / TBD";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
};

export default function CustomizeTripSuccess() {
  const { requestId } = useParams();
  const location = useLocation();
  const summary = location.state?.summary;
  const validRequestId = Boolean(requestId && requestId !== "undefined");

  const summaryRows = [
    {
      label: "Trip",
      value: summary?.tripName || "Custom itinerary",
    },
    {
      label: "Preferred date",
      value: formatDate(summary?.date),
    },
    {
      label: "Group size",
      value: summary?.group || "Details coming soon",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 py-16">
      <div className="mx-auto max-w-4xl space-y-10 px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
          <CheckCircle className="mx-auto text-emerald-500" size={52} />
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            Request received
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Thanks! Our team will reply within 24 hours (often faster).
          </p>
          {validRequestId ? (
            <p className="mt-4 text-lg font-semibold text-slate-800">
              Request ID:
              <span className="ml-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {requestId}
              </span>
            </p>
          ) : (
            <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Your request was submitted, but we couldn’t load the ID.
            </p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-900">Summary highlights</h2>
            <div className="space-y-3">
              {summaryRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{row.label}</p>
                  <p className="text-sm font-semibold text-slate-900">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-900">Next steps</h2>
            <p className="text-sm text-slate-500">
              While we prepare your custom quote, feel free to explore more treks or contact our team directly.
            </p>
            <div className="space-y-3">
              <a
                href="https://wa.me/9779801234567"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                <MessageCircle size={16} />
                WhatsApp us now
              </a>
              <Link
                to="/trekking-in-nepal"
                className="flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Browse treks
              </Link>
              <Link
                to="/last-minute"
                className="flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                View fixed departures
              </Link>
              {validRequestId ? null : (
                <Link
                  to="/customize-trip"
                  className="flex items-center justify-center gap-2 rounded-full border border-amber-400 px-4 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-50"
                >
                  Return to Customize Trip
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
