# EverTrek Nepal - Technical Architecture Documentation

## 1. System Overview

EverTrek Nepal is a modern web application designed for a trekking and tour booking agency. It provides a comprehensive platform for users to browse treks, view detailed itineraries, and book trips. The system is built on a React-based frontend with a separate backend API.

- **Frontend**: A Single Page Application (SPA) built with React and Vite.
- **Backend**: A set of RESTful APIs handling business logic, data persistence, and authentication.
- **Database**: A database to store information about treks, bookings, users, and content.
- **Deployment**: The frontend is intended for static hosting (e.g., cPanel, Vercel, Netlify), while the backend is deployed separately.

## 2. Production Readiness Assessment

- **Rating**: 6.5 / 10
- **Summary**: The application has a modern and solid foundation with React 19 and Vite 6. However, there are several areas that need improvement to be considered production-ready for high concurrency, including issues with global data prefetching, overlapping UI libraries, and a lack of monitoring.

### 2.1. Key Risks
- **Global Prefetching**: The application prefetches all trek data on initial load, which will cause significant backend load with many users.
- **Overlapping UI Libraries**: The use of Tailwind CSS, MUI, Emotion, and Headless UI together increases the bundle size.
- **API Configuration**: The production API URL configuration is not robust and could fall back to a localhost address.

### 2.2. Critical Upgrades Recommended
1.  **Remove Global Prefetching**: Gate the prefetching of trek data to specific routes or user interactions.
2.  **Consolidate UI Frameworks**: Choose one primary UI framework to reduce bundle size.
3.  **Harden API Configuration**: Ensure the build process fails if the production API URL is not set.
4.  **Tune Revalidation Strategy**: Adjust the SWR `revalidateOnFocus` setting to prevent traffic spikes.
5.  **Improve Caching**: Implement limits and persistence for the in-memory cache.

## 3. Frontend Architecture

The frontend is a Single Page Application built using React.

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: A mix of Tailwind CSS, MUI, Emotion, and Headless UI. This is a point of concern for bundle size.
- **Routing**: `react-router-dom` is used for client-side routing. Routes are defined in `src/App.jsx` and use `React.lazy` for code-splitting, which is a good practice for performance.
- **State Management**: The application uses a combination of React's built-in state management (`useState`, `useContext`) and SWR for remote data fetching and caching.
- **Component Structure**: The components are organized by feature/domain in the `src/` directory (e.g., `src/blog`, `src/treks`, `src/Book`).

## 4. Backend and API Architecture

The backend consists of a set of RESTful APIs that the frontend consumes.

- **API Design**: The API follows REST principles, with endpoints for resources like treks, bookings, and authentication.
- **Authentication**: Authentication is token-based. The `src/api/auth/auth.api.js` file handles login, logout, and token management (storing the token in `localStorage`).
- **Services**: The API is structured into services, such as `trekService.js`, which encapsulates the logic for fetching trek-related data.
- **Data Fetching**: The frontend uses an Axios instance for making API requests, with SWR for caching and revalidation.

## 5. Database Schema

The database schema is designed to support the core features of the application. Based on the data files and components, the main entities are:

- **Treks**: Contains details about each trek, such as name, duration, price, and a detailed itinerary.
- **Tours**: Similar to treks, but for shorter tour packages.
- **Users**: Stores user information, including authentication credentials.
- **Bookings**: Links users to the treks they have booked, including details like the number of people and selected dates.
- **Blog Posts**: Content for the blog.
- **Reviews**: User reviews for treks.

## 6. Key Features and Logic

### 6.1. Trek and Itinerary Logic
- Trek data is managed in `src/data/` and fetched via API services.
- The `TrekDetailPage.jsx` component displays the details of a single trek, including an overview, itinerary, costs, and gallery.

### 6.2. Booking System
- The booking process is handled in the `src/Book/` directory.
- `TrekBooking.jsx` provides the main form for booking a trek.
- The system integrates with a payment gateway (Stripe is mentioned in the dependencies) to handle payments.

### 6.3. Content Management
- The blog is managed through components in `src/blog/`.
- It appears that blog posts are currently managed as static data or fetched from a simple API endpoint. A more robust CMS would be beneficial for a production environment.

## 7. Third-Party Integrations

- **Stripe**: For payment processing.
- **Leaflet**: For interactive maps to display trek routes.
- **Framer Motion & GSAP**: For animations.
- **Recharts**: For displaying charts (potentially for user profiles or admin dashboards).

## 8. Performance and Scalability

### 8.1. Performance
- **Code-Splitting**: The use of `React.lazy` is a major plus for performance.
- **Caching**: SWR provides caching and revalidation, and there is a custom cache manager, but it is in-memory and per-tab.
- **Image Optimization**: The `OptimizedImage.jsx` component suggests that image loading is being handled efficiently.

### 8.2. Scalability
- The global prefetching of trek data is a major scalability risk.
- The backend API's performance under load is unknown and would need to be tested.
- The database design will need to be optimized with appropriate indexing to handle a large number of treks and bookings.

## 9. Security

- **Authentication**: The token-based authentication is standard, but the security of the backend endpoints needs to be ensured (e.g., proper authorization checks).
- **Input Validation**: All user input on both the client and server should be validated to prevent XSS and other injection attacks.
- **Dependencies**: Regular audits of npm packages are needed to identify and patch vulnerabilities.

## 10. SEO and Discoverability

- **`robots.txt` and `sitemap.xml`**: Basic files are in place, but the sitemap is static and should be dynamically generated.
- **Meta Tags**: A `MetaData.jsx` component is used to dynamically set meta tags, which is good. However, the main `index.html` is missing default meta tags.
- **Rendering**: As a client-side rendered app, it may face challenges with SEO. Server-side rendering (SSR) or static site generation (SSG) should be considered.

## 11. Improvement Roadmap

1.  **Address Critical Upgrades**: Implement the critical upgrades identified in the production readiness assessment.
2.  **Implement SSR/SSG**: For better SEO and initial page load performance.
3.  **Introduce Monitoring**: Add client-side error tracking and performance monitoring (e.g., Sentry).
4.  **Dynamic Sitemap**: Create a script to generate the sitemap dynamically.
5.  **Consolidate UI Libraries**: Decide on a single UI library to reduce complexity and bundle size.
6.  **Backend Load Testing**: Perform load testing on the backend API to identify and address bottlenecks.
7.  **Security Audit**: Conduct a full security audit of the application.
