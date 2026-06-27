import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const GITHUB_URL = 'https://github.com/Funput/Funput';
const FACEBOOK_URL = 'https://www.facebook.com/FunputIME';
const DOCS_EDIT_BASE = `${GITHUB_URL}/tree/main/Docs`;

const config: Config = {
  title: 'Funput',
  tagline: 'Bộ gõ tiếng Việt cho macOS, Windows & Linux',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.funput.app',
  baseUrl: '/',

  organizationName: 'Funput',
  projectName: 'Funput',

  onBrokenLinks: 'throw',

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      },
    },
  ],

  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
    localeConfigs: {
      vi: {
        label: 'Tiếng Việt',
        direction: 'ltr',
        htmlLang: 'vi',
      },
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: DOCS_EDIT_BASE,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/funput-social-card.png',
    metadata: [
      {
        name: 'description',
        content:
          'Tài liệu Funput — bộ gõ tiếng Việt mã nguồn mở cho macOS, Windows và Linux.',
      },
      {
        name: 'keywords',
        content: 'Funput, bộ gõ tiếng Việt, Telex, VNI, input method',
      },
    ],
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Funput',
      logo: {
        alt: 'Funput logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tài liệu',
        },
        {
          href: 'https://funput.app',
          label: 'Website',
          position: 'right',
        },
        {
          href: GITHUB_URL,
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Tài liệu',
          items: [
            {
              label: 'Bắt đầu',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Dự án',
          items: [
            {
              label: 'GitHub',
              href: GITHUB_URL,
            },
            {
              label: 'Bản phát hành',
              href: `${GITHUB_URL}/releases`,
            },
            {
              label: 'Website',
              href: 'https://funput.app',
            },
            {
              label: 'Facebook',
              href: FACEBOOK_URL,
            },
          ],
        },
        {
          title: 'Khác',
          items: [
            {
              label: 'Giấy phép MIT',
              href: `${GITHUB_URL}/blob/main/LICENSE`,
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Funput`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
