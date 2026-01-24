export function openCustomizeTripForm({
  navigate,
  slug,
  tripName,
  source,
  preferredDate,
  extraState,
}) {
  const navigationState = { ...(extraState ?? {}) };
  if (source) {
    navigationState.source = source;
  }
  if (tripName) {
    navigationState.tripName = tripName;
  }
  if (preferredDate && !navigationState.preferredDates) {
    navigationState.preferredDates = [{ start: preferredDate }];
  }
  if (slug) {
    navigationState.trekId = slug;
    const encodedSlug = encodeURIComponent(slug);
    navigate(`/customize-trip?trip=${encodedSlug}`, { state: navigationState });
    return;
  }
  navigate("/customize-trip", { state: navigationState });
}
