// // src/api/mockData.js
// import everestBaseCamp from "../data/everestBaseCamp.js";

// const MOCK_DELAY = 10;

// export const MOCK_TREKS = {
//   "everest-base-camp-trek": {
//     ...everestBaseCamp,
//     slug: "everest-base-camp-trek",
//   },
// };

// export async function fetchTrek(slug) {
//   await new Promise((r) => setTimeout(r, MOCK_DELAY));
//   const trek = MOCK_TREKS[slug];
//   if (!trek) throw new Error(`Trek with slug '${slug}' not found`);
//   return trek;
// }

// export async function fetchAllTreks() {
//   await new Promise((r) => setTimeout(r, MOCK_DELAY));
//   return Object.values(MOCK_TREKS);
// }

// export async function fetchTreksBySlugs(slugs = []) {
//   const all = await fetchAllTreks();
//   return all.filter((t) => slugs.includes(t.slug));
// }
