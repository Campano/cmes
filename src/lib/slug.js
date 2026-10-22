/** Same rules as the old Docusaurus parseFrontMatter hook. */
export function slugify(s) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function withSlash(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return p.endsWith('/') ? p : `${p}/`;
}
