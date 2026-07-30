import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {Props} from '@theme/Footer/Layout';

import styles from './styles.module.css';

type SocialLink = {
  label: string;
  href: string;
  path: string;
};

const GITHUB_ICON_PATH =
  'M12 .5C5.73.5.99 5.24.99 11.5c0 4.86 3.15 8.98 7.52 10.43.55.1.75-.24.75-.53 0-.26-.01-.95-.01-1.87-3.06.66-3.71-1.48-3.71-1.48-.5-1.28-1.22-1.62-1.22-1.62-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.69-1.48-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13a10.5 10.5 0 0 1 5.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.23-2.58 5.16-5.03 5.43.39.34.74 1.01.74 2.04 0 1.47-.01 2.66-.01 3.02 0 .29.2.64.76.53 4.36-1.45 7.51-5.57 7.51-10.43C23.01 5.24 18.27.5 12 .5z';

const FACEBOOK_ICON_PATH =
  'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z';

function SocialIcon({label, href, path}: SocialLink): ReactNode {
  return (
    <Link
      className={styles.socialLink}
      href={href}
      aria-label={label}
      title={label}>
      <svg
        className={styles.socialIcon}
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true">
        <path d={path} />
      </svg>
    </Link>
  );
}

/**
 * Brand-first footer: identity block on the left, link columns on the right,
 * and a separated bottom bar for legal/copyright.
 */
export default function FooterLayout({
  style,
  links,
  logo,
  copyright,
}: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const {githubUrl, facebookUrl} = siteConfig.customFields as {
    githubUrl?: string;
    facebookUrl?: string;
  };

  const socials: SocialLink[] = [
    githubUrl && {label: 'GitHub', href: githubUrl, path: GITHUB_ICON_PATH},
    facebookUrl && {
      label: 'Facebook',
      href: facebookUrl,
      path: FACEBOOK_ICON_PATH,
    },
  ].filter(Boolean) as SocialLink[];

  return (
    <footer
      className={clsx('footer', styles.footer, {
        'footer--dark': style === 'dark',
      })}>
      <div className="container container-fluid">
        <div className={styles.top}>
          <div className={styles.brand}>
            {logo && <div className={styles.brandLogo}>{logo}</div>}
            <p className={styles.tagline}>
              <Translate id="footer.tagline">
                Bộ gõ tiếng Việt mã nguồn mở, nhẹ và tôn trọng quyền riêng tư.
              </Translate>
            </p>
            {socials.length > 0 && (
              <div className={styles.socials}>
                {socials.map((social) => (
                  <SocialIcon key={social.label} {...social} />
                ))}
              </div>
            )}
          </div>
          {links && <div className={styles.links}>{links}</div>}
        </div>
        {copyright && <div className={styles.bottom}>{copyright}</div>}
      </div>
    </footer>
  );
}
