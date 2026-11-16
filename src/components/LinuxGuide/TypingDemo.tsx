import {useEffect, useRef, useState} from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import clsx from 'clsx';
import styles from './styles.module.css';

type Step = {key: string; text: string};

// What the document shows after each key. Funput types straight into the
// document on Linux, so there is no underline; it falls back to an underlined
// preedit only in apps that cannot take direct edits.
const SEQUENCES: Record<'telex' | 'vni', Step[]> = {
  telex: [
    {key: 't', text: 't'},
    {key: 'i', text: 'ti'},
    {key: 'e', text: 'tie'},
    {key: 'e', text: 'tiê'},
    {key: 'n', text: 'tiên'},
    {key: 'g', text: 'tiêng'},
    {key: 's', text: 'tiếng'},
  ],
  vni: [
    {key: 't', text: 't'},
    {key: 'i', text: 'ti'},
    {key: 'e', text: 'tie'},
    {key: '6', text: 'tiê'},
    {key: '1', text: 'tiế'},
    {key: 'n', text: 'tiến'},
    {key: 'g', text: 'tiếng'},
  ],
};

const STEP_MS = 520;

type Method = keyof typeof SEQUENCES;

export default function TypingDemo() {
  const [method, setMethod] = useState<Method>('telex');
  // -1 = idle at the finished word, which is also the server render and the
  // reduced-motion view. 0..n-1 = that key just pressed. n = Space pressed.
  const [pos, setPos] = useState(-1);
  const timers = useRef<number[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  const seq = SEQUENCES[method];

  function clear() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }

  function play(target: Method = method) {
    clear();
    const steps = SEQUENCES[target];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPos(-1);
      return;
    }
    setPos(-2);
    steps.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setPos(i), STEP_MS * (i + 1)));
    });
    timers.current.push(
      window.setTimeout(() => setPos(steps.length), STEP_MS * (steps.length + 1.4)),
    );
    timers.current.push(window.setTimeout(() => setPos(-1), STEP_MS * (steps.length + 3)));
  }

  // Play once when the demo first scrolls into view.
  useEffect(() => {
    const node = root.current;
    if (!node || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !played.current) {
          played.current = true;
          play();
          observer.disconnect();
        }
      },
      {threshold: 0.6},
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pick(next: Method) {
    setMethod(next);
    play(next);
  }

  const shown = pos === -2 ? '' : pos === -1 || pos >= seq.length ? seq[seq.length - 1].text : seq[pos].text;
  const keys = seq.map((s) => s.key).join('');
  const word = seq[seq.length - 1].text;

  return (
    <div ref={root} className={styles.demo}>
      <div className={styles.demoHead}>
        <div className={styles.segmented} role="group" aria-label={translate({id: 'linuxGuide.demo.method', message: 'Kiểu gõ'})}>
          {(['telex', 'vni'] as Method[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={method === m}
              className={clsx(method === m && styles.segmentOn)}
              onClick={() => pick(m)}>
              {m === 'telex' ? 'Telex' : 'VNI'}
            </button>
          ))}
        </div>
        <button type="button" className={styles.replay} onClick={() => play()}>
          <Translate id="linuxGuide.demo.replay">Xem lại</Translate>
        </button>
      </div>

      <p className={styles.srOnly}>
        <Translate id="linuxGuide.demo.description" values={{keys, word}}>
          {'Gõ lần lượt các phím {keys} rồi nhấn Space, Funput cho ra chữ {word}.'}
        </Translate>
      </p>

      <div className={styles.keys} aria-hidden="true">
        {seq.map((s, i) => (
          <kbd key={i} className={clsx(styles.key, pos === i && styles.keyHit)}>
            {s.key}
          </kbd>
        ))}
        <kbd className={clsx(styles.key, styles.keySpace, pos === seq.length && styles.keyHit)}>Space</kbd>
      </div>

      <div className={styles.paper} aria-hidden="true">
        <span className={styles.typed}>{shown}</span>
        <span className={styles.caret} />
      </div>
      <p className={styles.demoNote}>
        <Translate id="linuxGuide.demo.note">
          Chữ hiện thẳng trong văn bản khi bạn gõ. Một số ứng dụng gạch chân từ đang gõ dở cho tới khi bạn nhấn Space.
        </Translate>
      </p>
    </div>
  );
}
