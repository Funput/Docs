import type {ReactNode} from 'react';
import {Screen, type DesktopLook} from './DesktopPicker';
import styles from './styles.module.css';

/** One row of the "which one should I pick?" helper on the Linux overview. */
export function ChoiceRow({
  look,
  title,
  hint,
  children,
}: {
  look: DesktopLook;
  title: string;
  /** How to recognise this desktop on screen. */
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.choice}>
      <Screen look={look} />
      <div className={styles.choiceText}>
        <p className={styles.choiceTitle}>{title}</p>
        <p className={styles.choiceHint}>{hint}</p>
        <div className={styles.choiceAdvice}>{children}</div>
      </div>
    </div>
  );
}

export default function Chooser({children}: {children: ReactNode}) {
  return <div className={styles.chooser}>{children}</div>;
}

const ICONS = {
  keyboard: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <path d="M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01M7.5 14h9" />
    </>
  ),
  update: (
    <>
      <path d="M19.5 11A7.5 7.5 0 0 0 5.6 7.6" />
      <path d="M5 4v4h4" />
      <path d="M4.5 13a7.5 7.5 0 0 0 13.9 3.4" />
      <path d="M19 20v-4h-4" />
    </>
  ),
  package: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.2a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.6M12 16.8h.01" />
    </>
  ),
} as const;

export type IconName = keyof typeof ICONS;

/** Small outline icon for link cards; decorative, so hidden from screen readers. */
export function LinkIcon({name}: {name: IconName}) {
  return (
    <svg
      className={styles.linkIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false">
      {ICONS[name]}
    </svg>
  );
}

/**
 * Wraps a markdown list where every item is `<LinkIcon/> [link](…) <span>note</span>`
 * and lays it out as clickable cards. The links stay in MDX so Docusaurus still
 * resolves and checks them.
 */
export function LinkCards({children}: {children: ReactNode}) {
  return <div className={styles.linkCards}>{children}</div>;
}
