import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

type Props = {
  /** Step number drawn on the rail. */
  n: number;
  /** Anchor of the step heading; keeps old links such as #step-2-add-repo alive. */
  id: string;
  title: string;
  /** One short line under the title: how long it takes, what it needs. */
  meta?: string;
  children: ReactNode;
};

// One numbered step on the vertical rail. Steps are stacked inside a
// <GuideSteps> container, which draws the connecting line.
export function GuideStep({n, id, title, meta, children}: Props) {
  return (
    <section className={styles.step} aria-labelledby={id}>
      <span className={styles.stepMarker} aria-hidden="true">
        {n}
      </span>
      <Heading as="h2" id={id} className={styles.stepTitle}>
        <span className={styles.srOnly}>
          <Translate id="linuxGuide.step.prefix" values={{n}}>
            {'Bước {n}: '}
          </Translate>
        </span>
        {title}
      </Heading>
      {meta && <p className={styles.stepMeta}>{meta}</p>}
      <div className={styles.stepBody}>{children}</div>
    </section>
  );
}

export default function GuideSteps({children}: {children: ReactNode}) {
  return <div className={styles.stepRail}>{children}</div>;
}
