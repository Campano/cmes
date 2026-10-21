// @ts-check
const path = require('path');
const site = require('./src/data/site.json');

const slugify = (s) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** @type {import('@docusaurus/types').Config} */
module.exports = {
  title: site.title,
  tagline: site.tagline,
  favicon: 'img/favicon.png',
  url: 'https://cmesoller.com',
  baseUrl: '/',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  markdown: {
    format: 'detect',
    hooks: {onBrokenMarkdownLinks: 'throw'},
    parseFrontMatter: async (params) => {
      const result = await params.defaultParseFrontMatter(params);
      const fm = result.frontMatter;
      // The CMS writes a bare `image: cover.jpg`; Docusaurus only resolves co-located files with `./`.
      if (typeof fm.image === 'string' && !/^(\.{0,2}\/|[a-z]+:)/i.test(fm.image)) {
        fm.image = `./${fm.image}`;
      }
      // Posts without a slug get the WordPress-style URL /{first category}/{folder name without date}/.
      const folder = path.relative(path.join(__dirname, 'blog'), path.dirname(params.filePath));
      if (!fm.slug && fm.tags?.length && !folder.startsWith('..')) {
        fm.slug = `/${slugify(fm.tags[0])}/${folder.replace(/^\d{4}-\d{2}-\d{2}-/, '')}`;
      }
      return result;
    },
  },
  i18n: {defaultLocale: 'ca', locales: ['ca']},

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      }),
    ],
  ],

  plugins: [
    [
      './plugins/blog.js',
      {
        routeBasePath: '/',
        tagsBasePath: '/',
        archiveBasePath: 'blog',
        blogListComponent: '@site/src/components/Home',
        blogTitle: 'Actualitat CMES',
        blogDescription: site.tagline,
        blogSidebarTitle: 'Darreres notícies',
        postsPerPage: 10,
        showReadingTime: false,
        onUntruncatedBlogPosts: 'ignore',
        feedOptions: {type: 'rss', title: site.title, language: 'ca'},
      },
    ],
  ],

  themeConfig: {
    image: 'img/hero.jpg',
    colorMode: {defaultMode: 'dark', disableSwitch: true, respectPrefersColorScheme: false},
    navbar: {
      logo: {alt: 'CMES', src: 'img/logo.png'},
      items: [
        {to: '/el-club/', label: 'El club'},
        {
          type: 'dropdown',
          label: 'Blog',
          to: '/blog/',
          items: [
            {to: '/blog/', label: 'Totes les notícies'},
            ...site.sections,
            {to: '/actualitat/', label: 'Actualitat'},
          ],
        },
        {to: '/agenda/', label: 'Agenda'},
        {to: '/local-social/', label: 'Local social'},
        {to: '/contacte/', label: 'Contacte'},
        {to: '/fes-te-soci/', label: 'Fes-te soci', position: 'right', className: 'navbar-cta'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        ...site.social,
        {label: 'Avís legal', to: '/avis-legal/'},
        {label: 'Política de privacitat', to: '/politica-de-privacitat/'},
        {label: 'Política de cookies', to: '/politica-de-cookies/'},
      ],
      copyright: `© ${new Date().getFullYear()} CMES – ${site.tagline} · <a href="mailto:${site.email}">${site.email}</a><br/>Fotografia de portada: Guiem Raja Fotografia i Vídeo`,
    },
  },
};
