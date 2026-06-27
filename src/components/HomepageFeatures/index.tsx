import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

type FeatureItem = {
  title: ReactNode;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: <Translate id="homepage.feature.platform.title">Đa nền tảng</Translate>,
    icon: '🖥️',
    description: (
      <Translate id="homepage.feature.platform.description">
        Trải nghiệm gõ tiếng Việt thống nhất trên macOS, Windows và Linux.
      </Translate>
    ),
  },
  {
    title: <Translate id="homepage.feature.input.title">Telex & VNI</Translate>,
    icon: '⌨️',
    description: (
      <Translate id="homepage.feature.input.description">
        Hỗ trợ các kiểu gõ phổ biến — Telex và VNI — để bạn gõ theo thói quen quen thuộc.
      </Translate>
    ),
  },
  {
    title: <Translate id="homepage.feature.opensource.title">Mã nguồn mở</Translate>,
    icon: '✨',
    description: (
      <Translate id="homepage.feature.opensource.description">
        Miễn phí, mã nguồn mở theo giấy phép MIT. Mọi đóng góp, báo lỗi và phản hồi đều
        được chào đón trên GitHub.
      </Translate>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureIcon} aria-hidden="true">
          {icon}
        </div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
