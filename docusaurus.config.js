// @ts-check
const site = require('./src/data/site.json');

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
    // Decap writes a bare `image: cover.jpg`; Docusaurus only resolves co-located files with `./`.
    parseFrontMatter: async (params) => {
      const result = await params.defaultParseFrontMatter(params);
      const {image} = result.frontMatter;
      if (typeof image === 'string' && !/^(\.{0,2}\/|[a-z]+:)/i.test(image)) {
        result.frontMatter.image = `./${image}`;
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
        {type: 'dropdown', label: 'Seccions', items: site.sections},
        {to: '/calendari/', label: 'Calendari'},
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
