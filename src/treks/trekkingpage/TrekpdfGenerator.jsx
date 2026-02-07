// components/TrekPdfGenerator.jsx
import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const TrekPdfGenerator = ({ trekData }) => {
  const pdfRef = useRef();

  const handleDownloadPdf = async () => {
    const element = pdfRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${trekData.treks[0].slug}.pdf`);
  };

  const trek = trekData.treks[0];

  return (
    <>
      <button
        onClick={handleDownloadPdf}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Download PDF
      </button>

      {/* Hidden PDF container */}
      <div
        ref={pdfRef}
        className="w-[800px] p-8 bg-white text-gray-900"
        style={{ display: "none" }}
      >
        {/* Hero Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{trek.title}</h1>
          <p className="text-gray-700">
            <strong>Region:</strong> {trek.region_slug} |{" "}
            <strong>Duration:</strong> {trek.duration} |{" "}
            <strong>Max Altitude:</strong> {trek.max_altitude}
          </p>
          {trek.hero_section?.image_path && (
            <img
              src={trek.hero_section.image_path}
              alt={trek.title}
              className="my-4 w-full object-cover"
            />
          )}
        </div>

        {/* Highlights */}
        {trek.highlights?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Highlights</h2>
            <ul className="list-disc list-inside space-y-1">
              {trek.highlights.map((h, i) => (
                <li key={i}>
                  <strong>{h.title}:</strong> {h.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Itinerary */}
        {trek.itinerary_days?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Itinerary</h2>
            {trek.itinerary_days.map((day) => (
              <div key={day.day} className="mb-3">
                <h3 className="font-bold">
                  Day {day.day}: {day.title}
                </h3>
                <p>{day.description}</p>
                <p className="text-sm text-gray-600">
                  Accommodation: {day.accommodation}, Altitude: {day.altitude},{" "}
                  Duration: {day.duration}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Gallery */}
        {trek.gallery_images?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Gallery</h2>
            <div className="grid grid-cols-1 gap-4">
              {trek.gallery_images.map((img, i) => (
                <img
                  key={i}
                  src={img.image_path}
                  alt={img.title}
                  className="w-full object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TrekPdfGenerator;
