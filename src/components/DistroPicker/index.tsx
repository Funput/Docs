import type {ReactElement, ReactNode} from 'react';
import {Children, isValidElement, useEffect, useId, useMemo, useState} from 'react';
import clsx from 'clsx';
import Translate, {translate} from '@docusaurus/Translate';

import styles from './styles.module.css';

export type FamilyId = 'debian' | 'fedora' | 'suse' | 'arch';

type FamilyMeta = {
  id: FamilyId;
  label: string;
  /** Package manager, shown as the card's badge. */
  pm: string;
  /**
   * Every distro `install.sh` resolves into this family, matched on ID then
   * ID_LIKE (platforms/linux/install.sh). The list is what users scan to find
   * themselves, so it names actual distributions rather than the family id.
   */
  distros: string[];
  /**
   * Caveat shown under the list — immutable distros need a different route.
   * Translated at render time under the id `distro.note.<family id>`.
   */
  note?: string;
};

const FAMILIES: FamilyMeta[] = [
  {
    id: 'debian',
    label: 'Debian / Ubuntu',
    pm: 'apt',
    distros: [
      'Ubuntu',
      'Debian',
      'Linux Mint',
      'Pop!_OS',
      'Zorin OS',
      'elementary OS',
      'KDE neon',
      'Kubuntu',
      'Xubuntu',
      'Lubuntu',
      'MX Linux',
      'Deepin',
      'Devuan',
      'Kali Linux',
      'Raspberry Pi OS',
    ],
  },
  {
    id: 'fedora',
    label: 'Fedora / RHEL',
    pm: 'dnf',
    distros: [
      'Fedora',
      'Nobara',
      'Ultramarine',
      'RHEL',
      'Rocky Linux',
      'AlmaLinux',
      'CentOS Stream',
    ],
    note: 'Bản immutable (Silverblue, Kinoite, Bazzite) không có dnf: vẫn thả file .repo như trên, rồi cài bằng rpm-ostree install funput và khởi động lại.',
  },
  {
    id: 'suse',
    label: 'openSUSE',
    pm: 'zypper',
    distros: [
      'openSUSE Tumbleweed',
      'openSUSE Leap',
      'openSUSE Slowroll',
      'SUSE Linux Enterprise',
    ],
  },
  {
    id: 'arch',
    label: 'Arch',
    pm: 'pacman',
    distros: [
      'Arch Linux',
      'Manjaro',
      'EndeavourOS',
      'CachyOS',
      'Garuda Linux',
      'ArcoLinux',
      'SteamOS',
    ],
    note: 'Chỉ có x86_64. SteamOS có rootfs chỉ đọc nên phải mở khoá trước khi pacman ghi được.',
  },
];

const STORAGE_KEY = 'funput.distro';

/** Marker element: the picker reads `id` and renders the matching child. */
export function DistroFamily({
  children,
}: {
  id: FamilyId;
  children: ReactNode;
}): ReactNode {
  return <>{children}</>;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function DistroPicker({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  // Deterministic first render so hydration matches the SSR output; the stored
  // choice is applied afterwards.
  const [selected, setSelected] = useState<FamilyId>('debian');
  const [query, setQuery] = useState('');
  const searchId = useId();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (FAMILIES.some((f) => f.id === saved)) {
        setSelected(saved as FamilyId);
      }
    } catch {
      // Private mode or blocked storage: the default stands.
    }
  }, []);

  function choose(id: FamilyId): void {
    setSelected(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Selection still works for this page view.
    }
  }

  const needle = normalize(query.trim());
  const matches = useMemo(() => {
    if (!needle) {
      return null;
    }
    return FAMILIES.map((family) => ({
      id: family.id,
      hits: family.distros.filter((d) => normalize(d).includes(needle)),
    }));
  }, [needle]);

  const nothingFound =
    matches !== null && matches.every((m) => m.hits.length === 0);

  // A search that narrows to one family selects it, so typing "manjaro" shows
  // the pacman commands without a second click.
  useEffect(() => {
    if (matches === null) {
      return;
    }
    const withHits = matches.filter((m) => m.hits.length > 0);
    if (withHits.length === 1) {
      choose(withHits[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches]);

  // Panels keep their commands in MDX; this picks the one to show.
  const panels = Children.toArray(children).filter(
    (child): child is ReactElement<{id: FamilyId}> =>
      isValidElement(child) && Boolean((child.props as {id?: string}).id),
  );
  const panel = panels.find((child) => child.props.id === selected);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <label className={styles.searchLabel} htmlFor={searchId}>
          <Translate id="distro.search.label">Tìm distro của bạn</Translate>
        </label>
        <input
          id={searchId}
          type="search"
          className={styles.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={translate({
            id: 'distro.search.placeholder',
            message: 'Ubuntu, Mint, Fedora, Manjaro…',
          })}
          autoComplete="off"
        />
      </div>

      <div className={styles.grid}>
        {FAMILIES.map((family) => {
          const hits = matches?.find((m) => m.id === family.id)?.hits;
          const dimmed =
            hits !== undefined && hits.length === 0 && selected !== family.id;
          return (
            <button
              type="button"
              key={family.id}
              onClick={() => choose(family.id)}
              aria-pressed={selected === family.id}
              className={clsx(
                styles.card,
                selected === family.id && styles.cardSelected,
                dimmed && styles.cardDimmed,
              )}>
              <span className={styles.cardHead}>
                <span className={styles.cardTitle}>{family.label}</span>
                <code className={styles.pm}>{family.pm}</code>
              </span>
              <span className={styles.distros}>
                {family.distros.map((distro) => (
                  <span
                    key={distro}
                    className={clsx(
                      styles.distro,
                      hits?.includes(distro) && styles.distroHit,
                    )}>
                    {distro}
                  </span>
                ))}
              </span>
              {family.note && (
                <span className={styles.note}>
                  {translate({
                    id: `distro.note.${family.id}`,
                    message: family.note,
                  })}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className={styles.disclaimer}>
        <Translate id="distro.coverage.before">
          Danh sách theo đúng cách
        </Translate>{' '}
        <code>install.sh</code>{' '}
        <Translate id="distro.coverage.after">
          nhận diện distro, nhưng Funput chưa được kiểm thử trên tất cả. Nếu
          package manager báo thiếu thư viện, distro của bạn cũ hơn máy dựng
          gói — hãy báo lỗi trên GitHub, hoặc dùng đường cài vào ~/.local.
        </Translate>
      </p>

      {nothingFound && (
        <p className={styles.empty}>
          <Translate id="distro.search.empty">
            Không có distro nào khớp. Distro ngoài bốn nhóm này vẫn cài được —
            xem mục Cách cài khác bên dưới.
          </Translate>
        </p>
      )}

      <div className={styles.panel}>{panel}</div>
    </div>
  );
}
