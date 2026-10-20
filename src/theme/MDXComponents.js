import MDXComponents from '@theme-original/MDXComponents';
import site from '@site/src/data/site.json';

// Usage in .mdx content: <Site field="email" />, or <Site field="contactFormUrl" label="…" /> for a button.
function Site({field, label}) {
  const value = site[field];
  if (label) return <a className="button button--primary button--lg" href={value}>{label}</a>;
  return field === 'email' ? <a href={`mailto:${value}`}>{value}</a> : value;
}

export default {...MDXComponents, Site};
