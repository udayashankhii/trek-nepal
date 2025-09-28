import React from "react";

const activities = [
  {
    title: "ATV Offroad Adventure",
    description:
      "Conquer Pokhara’s rugged trails on a thrilling ATV ride surrounded by Himalayan landscapes. Perfect for adrenaline junkies craving offbeat adventure.",
    img: "/images/atv-pokhara.jpg",
    price: "From $60",
    duration: "2 Hours",
    link: "/tours/atv-offroad-pokhara",
    reviews: 5.0,
    reviewsCount: 12,
  },
  {
    title: "Bungee Jumping",
    description:
      "Experience a heartbeat-skipping free fall with panoramic mountain views. Pokhara’s bungee is a bucket-list thrill for real daredevils.",
    img: "/images/bungee-pokhara.jpg",
    price: "From $65",
    duration: "1 Day",
    link: "/tours/bungee-pokhara",
    reviews: 4.9,
    reviewsCount: 18,
  },
  {
    title: "White Water Rafting",
    description:
      "Ride the wild rapids of the Seti River, guided by experts. Feel the rush and witness Pokhara’s raw beauty at river level.",
    img: "/images/rafting-pokhara.jpg",
    price: "From $65",
    duration: "Half Day",
    link: "/tours/rafting-pokhara",
    reviews: 5.0,
    reviewsCount: 9,
  },
  {
    title: "Zipline (Zip Flyer)",
    description:
      "Fly above Pokhara’s lush forests on Asia’s longest and steepest zipline. A once-in-a-lifetime way to see the valley from the sky.",
    img: "/images/zipline-pokhara.jpg",
    price: "From $99",
    duration: "3 Hours",
    link: "/tours/zipline-pokhara",
    reviews: 4.8,
    reviewsCount: 14,
  },
  {
    title: "Ultra Light Flight",
    description:
      "Soar over Phewa Lake and Annapurna peaks in a micro airplane; the most unique, picturesque sightseeing flight imaginable.",
    img: "/images/ultralight-pokhara.jpg",
    price: "From $160",
    duration: "1 Day",
    link: "/tours/ultralight-pokhara",
    reviews: 5.0,
    reviewsCount: 7,
  },
  {
    title: "Paragliding",
    description:
      "Glide gently above terraces and blue lakes harnessed to expert pilots—Pokhara is world-famous for this serene adventure.",
    img: "/images/paragliding-pokhara.jpg",
    price: "From $85",
    duration: "1 Day",
    link: "/tours/paragliding-pokhara",
    reviews: 5.0,
    reviewsCount: 20,
  },
];

export default function Tours() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100/60 to-white/90 py-12 px-5">
      <section className="max-w-5xl mx-auto mb-12 text-center px-4">
        <h1
          className="inline-block px-10 py-4 font-extrabold tracking-tight text-5xl md:text-6xl
            bg-white bg-opacity-30 backdrop-blur-lg rounded-3xl shadow-xl text-teal-900"
        >
          Adventure Activities in Pokhara
        </h1>
        <p
          className="mt-6 max-w-3xl mx-auto text-lg md:text-xl font-semibold text-gray-700
            bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-md"
        >
          Push your limits in Nepal’s adventure capital! Explore world-class
          experiences—ATV riding, bungee jumping, rafting, and breathtaking
          flights—seriously crafted for bold travelers.
        </p>
      </section>

      <section
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-4"
        aria-label="Adventure activities tours"
      >
        {activities.map((act, i) => (
          <a
            key={i}
            href={act.link}
            className="group flex flex-col bg-white/80 dark:bg-white/20 backdrop-blur-md border border-slate-300 rounded-2xl shadow-md hover:shadow-2xl transform-gpu hover:scale-[1.04] transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-teal-300"
            aria-label={`Book ${act.title} tour`}
          >
            <img
              src={act.img}
              alt={act.title}
              className="w-full h-56 object-cover rounded-t-2xl transition-transform duration-500 group-hover:scale-105"
            />
            <div className="flex flex-col flex-grow p-5">
              <h2 className="text-teal-900 text-2xl mb-3 font-semibold">{act.title}</h2>
              <p className="text-gray-700 flex-grow text-base leading-relaxed">{act.description}</p>
              <div className="mt-5 flex items-center justify-between text-sm text-gray-600 font-medium">
                <span className="text-teal-700 font-bold">{act.price}</span>
                <span>
                  <time dateTime={`PT${act.duration.replace(/[^0-9]/g, "")}H`}>
                    ⏱ {act.duration}
                  </time>
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-yellow-500 font-semibold">
                <span>★{act.reviews}</span>
                <span className="text-gray-500 font-normal">
                  ({act.reviewsCount} reviews)
                </span>
              </div>
              <button
                type="button"
                aria-label={`Book ${act.title}`}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-teal-600 hover:to-blue-700 transition"
              >
                Book Now
              </button>
            </div>
          </a>
        ))}
      </section>

      <footer className="text-center mt-16 mb-8 text-sm text-gray-500">
        Nepal Adventure Tours &copy; {new Date().getFullYear()} — Your trusted local experts
      </footer>
    </main>
  );
}
