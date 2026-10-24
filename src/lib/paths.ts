/** Always generate base-prefixed site links (including local development). */
export function sitePath(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const suffix = path.replace(/^\/+/, '');
  return `${base}/${suffix}`;
}

export function plantPath(slug: string): string {
  return sitePath(`plants/${slug}/`);
}
