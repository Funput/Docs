import type {ReactElement, ReactNode} from 'react';
import {Children, isValidElement, useEffect, useId, useRef, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import Translate from '@docusaurus/Translate';
import clsx from 'clsx';
import styles from './styles.module.css';

const STORAGE_KEY = 'funput.linux.desktop';

export type DesktopLook = 'gnome' | 'kde' | 'other';

type OptionProps = {
  /** Anchor for this choice; old route links (#nếu-dòng-đầu-là-x11 …) point here. */
  id: string;
  title: string;
  /** Distros or desktops that belong to this card. */
  hint: string;
  /** Session type badge, e.g. Wayland or X11. */
  tag?: string;
  /** Which mini screen to draw on the card. */
  look: DesktopLook;
  children: ReactNode;
};

// Content holder; DesktopPicker reads its props and renders the panel itself.
export function DesktopOption({children}: OptionProps) {
  return <>{children}</>;
}

// A tiny drawing of the screen layout, so a newcomer can match the card to
// what is in front of them: GNOME has a bar across the top, Plasma a panel
// along the bottom, the rest is a classic window with a taskbar.
export function Screen({look}: {look: DesktopLook}) {
  return (
    <svg className={styles.screen} viewBox="0 0 96 60" aria-hidden="true" focusable="false">
      <rect className={styles.screenFrame} x="1" y="1" width="94" height="58" rx="6" />
      {look === 'gnome' && (
        <>
          <rect className={styles.screenBar} x="1" y="1" width="94" height="8" rx="3" />
          <rect className={styles.screenInk} x="41" y="4" width="14" height="2" rx="1" />
          <rect className={styles.screenBar} x="4" y="14" width="8" height="40" rx="3" />
          <circle className={styles.screenAccent} cx="8" cy="20" r="2.2" />
          <circle className={styles.screenInk} cx="8" cy="27" r="2.2" />
          <circle className={styles.screenInk} cx="8" cy="34" r="2.2" />
          <rect className={styles.screenWindow} x="22" y="16" width="56" height="34" rx="3" />
        </>
      )}
      {look === 'kde' && (
        <>
          <rect className={styles.screenWindow} x="14" y="8" width="60" height="34" rx="3" />
          <rect className={styles.screenBar} x="10" y="48" width="76" height="8" rx="4" />
          <circle className={styles.screenAccent} cx="16" cy="52" r="2.2" />
          <rect className={styles.screenInk} x="22" y="51" width="18" height="2" rx="1" />
          <rect className={styles.screenInk} x="72" y="51" width="9" height="2" rx="1" />
        </>
      )}
      {look === 'other' && (
        <>
          <rect className={styles.screenWindow} x="12" y="8" width="58" height="36" rx="3" />
          <rect className={styles.screenBar} x="1" y="50" width="94" height="9" rx="2" />
          <rect className={styles.screenAccent} x="4" y="52" width="10" height="5" rx="1.5" />
          <rect className={styles.screenInk} x="18" y="54" width="16" height="2" rx="1" />
          <rect className={styles.screenInk} x="80" y="54" width="10" height="2" rx="1" />
        </>
      )}
    </svg>
  );
}

export default function DesktopPicker({
  id,
  children,
}: {
  /** Anchor of the whole picker (#step-3b-env-vars). */
  id?: string;
  children: ReactNode;
}) {
  const options = Children.toArray(children).filter(
    (child): child is ReactElement<OptionProps> =>
      isValidElement(child) && Boolean((child.props as Partial<OptionProps>).id),
  );
  const {hash} = useLocation();
  const brokenLinks = useBrokenLinks();
  const groupName = useId();
  const root = useRef<HTMLDivElement>(null);
  // Nothing is chosen in the server render, so hydration matches; a saved
  // choice or a #fragment selects a card right after.
  const [selected, setSelected] = useState<string | null>(null);

  brokenLinks.collectAnchor(id);
  options.forEach((option) => brokenLinks.collectAnchor(option.props.id));

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && options.some((o) => o.props.id === saved)) setSelected(saved);
    } catch {
      // Blocked storage: the reader picks again.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hash) return;
    let anchor = hash.slice(1);
    try {
      anchor = decodeURIComponent(anchor);
    } catch {
      // A malformed fragment can still match a literal id.
    }
    if (!options.some((o) => o.props.id === anchor)) return;
    setSelected(anchor);
    root.current?.scrollIntoView({block: 'start'});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  function choose(next: string) {
    setSelected(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The choice still holds for this page view.
    }
  }

  return (
    <div ref={root} id={id} className={styles.picker}>
      <p className={styles.pickerPrompt} aria-hidden="true">
        <Translate id="linuxGuide.desktop.empty">
          Chọn thẻ giống màn hình của bạn để xem các lệnh cần chạy.
        </Translate>
      </p>
      <fieldset className={styles.pickerCards}>
        <legend className={styles.srOnly}>
          <Translate id="linuxGuide.desktop.legend">Giao diện Linux bạn đang dùng</Translate>
        </legend>
        {options.map(({props}) => (
          <label
            key={props.id}
            className={clsx(styles.pickerCard, selected === props.id && styles.pickerCardOn)}>
            <input
              type="radio"
              name={groupName}
              value={props.id}
              checked={selected === props.id}
              onChange={() => choose(props.id)}
              className={styles.srOnly}
            />
            <Screen look={props.look} />
            <span className={styles.pickerText}>
              <span className={styles.pickerTitle}>
                {props.title}
                {props.tag && <span className={styles.pickerTag}>{props.tag}</span>}
              </span>
              <span className={styles.pickerHint}>{props.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {options.map(({props}) => (
        <div
          key={props.id}
          id={props.id}
          className={styles.pickerPanel}
          hidden={selected !== props.id}>
          {props.children}
        </div>
      ))}
    </div>
  );
}
