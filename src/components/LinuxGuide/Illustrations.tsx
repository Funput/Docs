import type {ReactNode} from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

// Drawn with HTML and CSS instead of screenshots: they follow the site's light
// and dark theme, stay sharp at any size, and never show a stale toolkit theme.
// Window labels stay in English because that is what the real tools display.

function Marker({children}: {children: ReactNode}) {
  return (
    <span className={styles.marker} aria-hidden="true">
      {children}
    </span>
  );
}

function Figure({label, caption, children}: {label: string; caption: ReactNode; children: ReactNode}) {
  return (
    <figure className={styles.figure}>
      <div className={styles.window} role="img" aria-label={label}>
        {children}
      </div>
      <figcaption className={styles.figureCaption}>{caption}</figcaption>
    </figure>
  );
}

export function Fcitx5ConfigIllustration() {
  return (
    <Figure
      label={translate({
        id: 'linuxGuide.fcitx5Figure.label',
        message:
          'Cửa sổ Fcitx 5 Configuration: cột trái là bộ gõ đang dùng, cột phải là bộ gõ có thể thêm, Funput nằm trong nhóm Vietnamese.',
      })}
      caption={
        <ol className={styles.legend}>
          <li>
            <Marker>A</Marker>
            <Translate id="linuxGuide.fcitx5Figure.a">Bỏ chọn ô này để thấy các ngôn ngữ khác.</Translate>
          </li>
          <li>
            <Marker>B</Marker>
            <Translate id="linuxGuide.fcitx5Figure.b">Gõ funput vào ô tìm kiếm rồi chọn Funput.</Translate>
          </li>
          <li>
            <Marker>C</Marker>
            <Translate id="linuxGuide.fcitx5Figure.c">Bấm nút mũi tên để đưa Funput sang cột bên trái.</Translate>
          </li>
        </ol>
      }>
      <div className={styles.windowBar}>Fcitx 5 Configuration</div>
      <div className={styles.columns}>
        <div className={styles.pane}>
          <div className={styles.paneLabel}>Current Input Method</div>
          <div className={styles.row}>Keyboard - English (US)</div>
        </div>
        <div className={styles.paneArrows}>
          <span className={styles.arrowButton}>
            ←<Marker>C</Marker>
          </span>
          <span className={styles.arrowButton}>→</span>
        </div>
        <div className={styles.pane}>
          <div className={styles.paneLabel}>Available Input Method</div>
          <div className={styles.search}>funput</div>
          <div className={styles.groupLabel}>Vietnamese</div>
          <div className={`${styles.row} ${styles.rowOn}`}>
            Funput<Marker>B</Marker>
          </div>
          <div className={styles.checkbox}>
            <span className={styles.box} />
            Only Show Current Language<Marker>A</Marker>
          </div>
        </div>
      </div>
    </Figure>
  );
}

export function GnomeInputSourceIllustration() {
  return (
    <Figure
      label={translate({
        id: 'linuxGuide.gnomeFigure.label',
        message: 'Hộp thoại Add an Input Source của GNOME: chọn Vietnamese rồi chọn Vietnamese (Funput).',
      })}
      caption={
        <ol className={styles.legend}>
          <li>
            <Marker>A</Marker>
            <Translate id="linuxGuide.gnomeFigure.a">
              Trong Keyboard, bấm Add Input Source.
            </Translate>
          </li>
          <li>
            <Marker>B</Marker>
            <Translate id="linuxGuide.gnomeFigure.b">
              Chọn Vietnamese. Nếu chưa thấy, bấm dấu ba chấm ở cuối danh sách.
            </Translate>
          </li>
          <li>
            <Marker>C</Marker>
            <Translate id="linuxGuide.gnomeFigure.c">Chọn Vietnamese (Funput) rồi bấm Add.</Translate>
          </li>
        </ol>
      }>
      <div className={styles.windowBar}>Settings › Keyboard</div>
      <div className={styles.columns}>
        <div className={styles.pane}>
          <div className={styles.paneLabel}>Input Sources</div>
          <div className={styles.row}>English (US)</div>
          <div className={`${styles.row} ${styles.rowGhost}`}>
            + Add Input Source<Marker>A</Marker>
          </div>
        </div>
        <div className={styles.pane}>
          <div className={styles.paneLabel}>Add an Input Source</div>
          <div className={styles.row}>
            ‹ Vietnamese<Marker>B</Marker>
          </div>
          <div className={styles.row}>Vietnamese</div>
          <div className={`${styles.row} ${styles.rowOn}`}>
            Vietnamese (Funput)<Marker>C</Marker>
          </div>
        </div>
      </div>
    </Figure>
  );
}

/** The input-method icon in the system tray: Funput ships its logo as the icon. */
export function TrayHint({children}: {children: ReactNode}) {
  const logo = useBaseUrl('/img/logo.svg');
  return (
    <div className={styles.tray}>
      <div className={styles.trayBar} aria-hidden="true">
        <span className={styles.trayItem}>Wi‑Fi</span>
        <span className={styles.trayIme}>
          <img src={logo} alt="" width={16} height={16} />
        </span>
        <span className={styles.trayItem}>10:30</span>
      </div>
      <div className={styles.trayText}>{children}</div>
    </div>
  );
}
