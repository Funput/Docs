import type {ReactNode} from 'react';
import {useCallback, useState} from 'react';
import clsx from 'clsx';
import Translate, {translate} from '@docusaurus/Translate';

import styles from './styles.module.css';

export type AndroidShot = {
  src: string;
  alt: string;
  caption: string;
};

export type AndroidInviteProps = {
  mailtoHref: string;
  contactEmail?: string;
  shots: AndroidShot[];
};

const DEFAULT_EMAIL = 'hello@funput.app';

/**
 * Visual invite block for the Android closed-testing docs page:
 * status badge, screenshot gallery, and mailto CTA.
 */
export default function AndroidInvite({
  mailtoHref,
  contactEmail = DEFAULT_EMAIL,
  shots,
}: AndroidInviteProps): ReactNode {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [contactEmail]);

  return (
    <div className={styles.root}>
      <div className={styles.status}>
        <span className={styles.badge}>
          <Translate id="android.status.badge">Kiểm thử khép kín</Translate>
        </span>
        <p className={styles.statusText}>
          <Translate id="android.status.text">
            Funput trên Android đang ở giai đoạn kiểm thử khép kín trên Google
            Play. Bạn cần lời mời để tham gia dùng thử.
          </Translate>
        </p>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <h3 className={styles.featureTitle}>
            <Translate id="android.feature.input.title">Telex & VNI</Translate>
          </h3>
          <p className={styles.featureBody}>
            <Translate id="android.feature.input.body">
              Gõ tiếng Việt theo thói quen quen thuộc — Telex hoặc VNI.
            </Translate>
          </p>
        </div>
        <div className={styles.feature}>
          <h3 className={styles.featureTitle}>
            <Translate id="android.feature.cross.title">Đa nền tảng</Translate>
          </h3>
          <p className={styles.featureBody}>
            <Translate id="android.feature.cross.body">
              Trải nghiệm gõ thống nhất với Funput trên iOS, desktop và Android.
            </Translate>
          </p>
        </div>
        <div className={styles.feature}>
          <h3 className={styles.featureTitle}>
            <Translate id="android.feature.open.title">Mã nguồn mở</Translate>
          </h3>
          <p className={styles.featureBody}>
            <Translate id="android.feature.open.body">
              Miễn phí, MIT, tập trung quyền riêng tư — không bán dữ liệu gõ của
              bạn.
            </Translate>
          </p>
        </div>
      </div>

      <div className={styles.gallery}>
        {shots.map((shot) => (
          <figure key={shot.src} className={styles.shot}>
            <div className={styles.shotFrame}>
              <img
                className={styles.shotImage}
                src={shot.src}
                alt={shot.alt}
                width={360}
                height={720}
                loading="lazy"
              />
            </div>
            <figcaption className={styles.shotCaption}>{shot.caption}</figcaption>
          </figure>
        ))}
      </div>

      <div className={styles.cta}>
        <div className={styles.ctaAccent} aria-hidden="true" />
        <h2 className={styles.ctaTitle}>
          <Translate id="android.cta.title">Mời dùng thử Funput Android</Translate>
        </h2>
        <p className={styles.ctaBody}>
          <Translate id="android.cta.body">
            Gửi email cho chúng tôi để nhận lời mời kiểm thử. Hãy ghi kèm địa chỉ
            Google Play (Gmail) bạn dùng trên thiết bị Android.
          </Translate>
        </p>
        <div className={styles.ctaActions}>
          <a className={clsx('button button--primary button--lg', styles.ctaPrimary)} href={mailtoHref}>
            <Translate id="android.cta.button">Gửi email đăng ký</Translate>
          </a>
          <button
            type="button"
            className={clsx('button button--outline button--secondary', styles.ctaSecondary)}
            onClick={onCopy}>
            {copied ? (
              <Translate id="android.cta.copied">Đã sao chép</Translate>
            ) : (
              <Translate id="android.cta.copy">Sao chép email</Translate>
            )}
          </button>
        </div>
        <p className={styles.ctaEmail}>
          <span className={styles.ctaEmailLabel}>
            <Translate id="android.cta.emailLabel">Email:</Translate>
          </span>{' '}
          <a href={mailtoHref}>{contactEmail}</a>
        </p>
        <p className={styles.ctaHint}>
          {translate({
            id: 'android.cta.hint',
            message:
              'Hướng dẫn cài đặt chi tiết sẽ được bổ sung khi bản kiểm thử mở rộng hơn.',
          })}
        </p>
      </div>
    </div>
  );
}
