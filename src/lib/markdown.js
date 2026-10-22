import site from '../../content/site.json';

function walk(node, fn) {
  fn(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, fn);
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function rewriteSiteTags(code) {
  return code
    .replace(/pathname:\/\/\//g, '/')
    .replace(/<Site\b([^>/]*)\/>/g, (_, attrs) => {
      const field = /field="(\w+)"/.exec(attrs)?.[1];
      const caption = /label="([^"]*)"/.exec(attrs)?.[1];
      const value = field ? (site[field] ?? '') : '';
      if (caption) {
        return `<a class="btn btn-accent" href="${escapeHtml(value)}">${escapeHtml(caption)}</a>`;
      }
      if (field === 'email') {
        // Plain text: GFM autolinks the address once (wrapping <a> here nested a second link).
        return escapeHtml(value);
      }
      return escapeHtml(value);
    });
}

/** CMS <Site field="…" /> in page source → HTML before MDX/markdown parse. */
export function siteTagsPlugin() {
  return {
    name: 'cmes-site-tags',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0];
      if (!/\.mdx?$/.test(file)) return;
      const next = rewriteSiteTags(code);
      return next === code ? undefined : next;
    },
  };
}

/** Co-located post images → /_posts/{folder}/{file}. */
export function remarkRewriteImages() {
  return function (tree, file) {
    const filepath = String(file.history?.[0] || file.path || '').replace(/\\/g, '/');
    const m = filepath.match(/\/content\/noticies\/([^/]+)\//);
    if (!m) return;
    const prefix = `/_posts/${m[1]}/`;
    walk(tree, (node) => {
      if (node.type === 'image' && node.url && !/^(https?:|\/\/|\/|#|data:)/i.test(node.url)) {
        node.url = prefix + node.url.replace(/^\.\//, '');
      }
    });
  };
}
