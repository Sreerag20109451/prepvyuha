const KEY = "prepvyuha_local_uid";

export function getOrCreateLocalUserId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = `local_${crypto.randomUUID()}`;
    window.localStorage.setItem(KEY, id);
  }
  return id;
}
