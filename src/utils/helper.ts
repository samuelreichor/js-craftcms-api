export function getPreviewToken(): string | null {
  if (typeof window === 'undefined') return null;
  const windowUrl = window.location.search;
  const urlParams = new URLSearchParams(windowUrl);

  return urlParams.get('token');
}

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
