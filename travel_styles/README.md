# Travel Styles Seeding

This command ensures the **Hiking** travel style plus the **Sivapuri Heritage Hike** tour exist with metadata, itinerary, highlights, pricing, and gallery images.

### How to run
1. Activate your Python environment (if necessary) and ensure the database is migrated.
1. From the project root run:
   ```
   python manage.py seed_travel_styles
   ```

The command is idempotent—it updates the travel style and tour if they already exist, and it refreshes itinerary, highlights, cost, pricing, and gallery images.

### Use case
- Frontend travel-style dropdown and detail pages will consume the seeded data without additional work.
- If you ever need to tweak the tour content, edit the constants inside `travel_styles/management/commands/seed_travel_styles.py` and rerun the command.
- The frontend now exposes an admin dashboard at `/travel-admin` that shows every travel style alongside its linked tours, highlights orphan tours, and links back to the Django admin/import tools for editing or seeding more data. Run the seed command first so this page has real content to display.
