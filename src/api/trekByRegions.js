// // Fetch treks filtered by region slug
// export const fetchTreksByRegion = async (regionSlug) => {
//   try {
//     const regionTrek= axios.create({
//  baseURL: "http://127.0.0.1:8000/api/treks/", // Django or FastAPI backend root
//  headers: {
//  "Content-Type": "application/json",
//  },
//  timeout: 8000,
// });

//     const data = response.data;
//     // Normalize array response if needed
//     if (Array.isArray(data)) return data;
//     if (Array.isArray(data.results)) return data.results;
//     if (Array.isArray(data.data)) return data.data;
//     return [];
//   } catch (error) {
//     console.error(`Error fetching treks for region ${regionSlug}:`, error);
//     return [];
//   }
// };