import {type ReactNode, useEffect, useRef} from 'react';
import {useLocation} from '@docusaurus/router';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import clsx from 'clsx';
import styles from '@site/src/css/linuxInstall.module.css';

type Props = {
  id?: string;
  label: string;
  route?: 'X11' | 'Wayland';
  children: ReactNode;
};

// Render native details so the browser can manage the exclusive route group.
export default function LinuxGuideDisclosure({id, label, route, children}: Props) {
  const {hash} = useLocation();
  const details = useRef<HTMLDetailsElement>(null);
  useBrokenLinks().collectAnchor(id);

  useEffect(() => {
    const disclosure = details.current;
    if (!hash || !disclosure) return;

    let anchor = hash.slice(1);
    try {
      anchor = decodeURIComponent(anchor);
    } catch {
      // A malformed fragment can still match a literal ID.
    }
    const target = document.getElementById(anchor);
    if (target && disclosure.contains(target)) disclosure.open = true;
  }, [hash]);

  return (
    <details
      ref={details}
      id={id}
      name={route && 'fcitx5-session'}
      className={clsx(styles.guideDisclosure, route && styles.routeCard)}>
      <summary>
        {route && <span className={styles.routeTag}>{route}</span>}
        <span>{label}</span>
      </summary>
      <div className={styles.disclosureBody}>{children}</div>
    </details>
  );
}
