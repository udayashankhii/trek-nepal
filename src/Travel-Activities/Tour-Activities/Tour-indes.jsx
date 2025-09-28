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
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 to-white/90 py-12 px-4">
      <section className="max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary backdrop-blur-lg bg-white bg-opacity-30 inline-block px-8 py-4 rounded-3xl shadow-xl">
          Adventure Activities in Pokhara
        </h1>
        <p className="mt-6 text-lg md:text-xl font-medium text-gray-700 max-w-2xl mx-auto backdrop-blur-md bg-white/60 rounded-xl p-6">
          Push your limits in Nepal’s adventure capital! Explore world-class experiences—ATV riding, bungee jumping, rafting, and breathtaking flights—seriously crafted for bold travelers.
        </p>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {activities.map((act, i) => (
          <div
            key={i}
            className="bg-white/70 backdrop-blur-lg border border-slate-200 rounded-2xl shadow-lg overflow-hidden flex flex-col hover:scale-105 hover:shadow-2xl transition duration-300"
          >
            <img src={act.img} alt={act.title} className="h-48 object-cover w-full" />
            <div className="flex-1 flex flex-col p-5">
              <h2 className="font-bold text-xl mb-2 text-teal-900">{act.title}</h2>
              <p className="text-gray-700 flex-1 mb-3">{act.description}</p>
              <div className="flex items-center justify-between text-sm mt-auto">
                <span className="font-semibold text-primary">{act.price}</span>
                <span className="text-gray-600">⏱ {act.duration}</span>
              </div>
              <div className="flex items-center mt-2 gap-2 text-yellow-500">
                <span>★{act.reviews}</span>
                <span className="text-gray-500">({act.reviewsCount} reviews)</span>
              </div>
              <a
                href={act.link}
                className="mt-4 inline-block text-white font-bold bg-gradient-to-r from-teal-500 to-blue-500 px-4 py-2 rounded-md shadow hover:shadow-lg transition"
              >
                Book Now
              </a>
            </div>
          </div>
        ))}
      </div>
      <footer className="text-center mt-12 text-sm text-gray-500">
        <span>
          Nepal Adventure Tours &copy; {new Date().getFullYear()} | Your Trusted Local Experts
        </span>
      </footer>
    </div>
  );
}
