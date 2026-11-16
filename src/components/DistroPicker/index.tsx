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
  searchAliases?: string[];
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
    searchAliases: ['Fedora Silverblue', 'Fedora Kinoite'],
    note: 'Fedora Silverblue và Kinoite có bước cài riêng trong hướng dẫn bên dưới.',
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
    note: 'Kho Funput dành cho máy x86_64. Nếu dùng Arch Linux ARM hoặc hệ thống chỉ đọc như SteamOS, xem Các cách cài khác.',
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
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}): ReactNode {
  // Deterministic first render so hydration matches the SSR output; the stored
  // choice is applied afterwards.
  const [selected, setSelected] = useState<FamilyId>('debian');
  const [query, setQuery] = useState('');
  const searchId = useId();
  const panelId = `${searchId}-commands`;

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
      hits: [...family.distros, ...(family.searchAliases ?? [])].filter((distro) =>
        normalize(distro).includes(needle),
      ),
    }));
  }, [needle]);

  const matchCount = matches?.filter((result) => result.hits.length > 0).length;
  const nothingFound = matchCount === 0;
  const multipleMatches = matchCount !== undefined && matchCount > 1;
  const matchedFamily = matchCount === 1 ? matches?.find((result) => result.hits.length > 0) : undefined;
  const showCommands = !compact || matches === null || matchedFamily?.id === selected;

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
  const selectedFamily = FAMILIES.find((family) => family.id === selected);
  const emptySearch = (
    <Translate id="distro.search.empty">
      Không tìm thấy bản phân phối này. Kiểm tra lại tên hoặc xem trang
      Các cách cài khác.
    </Translate>
  );
  const coverageNote = (
    <p className={styles.disclaimer}>
      <Translate id="distro.coverage">
        Danh sách cho biết nhóm lệnh phù hợp với từng bản phân phối. Một số bản
        có thể thiếu thư viện mà gói Funput cần. Nếu gặp lỗi khi cài, xem trang
        Xử lý sự cố.
      </Translate>
    </p>
  );

  return (
    <div className={clsx(styles.root, compact && styles.compact)}>
      <div className={styles.header}>
        <label className={styles.searchLabel} htmlFor={searchId}>
          <Translate id="distro.search.label">Tìm bản phân phối Linux bạn dùng</Translate>
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

      {compact ? (
        <fieldset className={styles.segmented}>
          <legend className={styles.segmentLegend}>
            <Translate id="distro.group.label">Nhóm bản phân phối</Translate>
          </legend>
          <div className={styles.segments}>
            {FAMILIES.map((family) => (
              <label key={family.id} className={styles.segment}>
                <input
                  className={styles.segmentInput}
                  type="radio"
                  name={`${searchId}-family`}
                  value={family.id}
                  checked={selected === family.id}
                  aria-controls={panelId}
                  onClick={() => {
                    if (selected === family.id) setQuery('');
                  }}
                  onChange={() => {
                    setQuery('');
                    choose(family.id);
                  }}
                />
                <span className={styles.segmentLabel}>{family.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
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
      )}

      {!compact && coverageNote}

      {compact ? (
        <div className={styles.matchStatus} role="status">
          {nothingFound && emptySearch}
          {multipleMatches && (
            <Translate id="distro.search.multiple">
              Có nhiều nhóm khớp. Gõ tên cụ thể hơn hoặc chọn một nhóm bên trên.
            </Translate>
          )}
          {matchedFamily?.id === selected && selectedFamily && (
            <Translate id="distro.search.match" values={{family: selectedFamily.label}}>
              {'Lệnh phù hợp thuộc nhóm {family}.'}
            </Translate>
          )}
        </div>
      ) : nothingFound && (
        <p className={styles.empty}>{emptySearch}</p>
      )}

      <div id={panelId} className={styles.panel} hidden={!showCommands}>
        {compact && selectedFamily?.note && (
          <p className={styles.compactNote}>
            {translate({
              id: `distro.note.${selectedFamily.id}`,
              message: selectedFamily.note,
            })}
          </p>
        )}
        {panel}
      </div>

      {compact && coverageNote}
    </div>
  );
}
