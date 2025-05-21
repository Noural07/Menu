export const getParam = (key: string): string | null =>
  new URLSearchParams(window.location.search).get(key);

export const setParam = (key: string, value: string | number) => {
  const url = new URL(window.location.href);
  url.searchParams.set(key, String(value));
  window.history.replaceState({}, '', url);
};
