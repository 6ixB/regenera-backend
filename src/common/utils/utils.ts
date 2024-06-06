export function stripNullValues(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value !== null),
  );
}
