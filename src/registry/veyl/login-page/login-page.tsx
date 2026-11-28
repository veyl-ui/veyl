'use client';

import React, {useEffect, useId, useRef, useState, type FormEvent, type ReactNode} from 'react';
import {cn} from '@/lib/utils';
import {ResonanceAudio} from './resonance-audio';
import ResonancePlate, {type PlateCaptions, type PlateState} from './resonance-plate';
import './login-page.css';

export type LoginProvider = {
  /** Shown on the button, as "Sign in with {name}". */
  name: string;
  /** The little icon in the dark square on the left of the button. */
  icon?: ReactNode;
  onClick?: () => void;
};

export type LoginValues = {email: string; password: string; remember: boolean};

export type LoginPageProps = {
  /** The mark above the heading. Pass null to hide it. Defaults to a small face. */
  logo?: ReactNode | null;
  /** The heading. */
  title?: ReactNode;
  /** The line under the heading. */
  description?: ReactNode;
  /** The "Sign in with ..." buttons. Pass an empty list to hide them and the "OR" line. */
  providers?: LoginProvider[];
  /**
   * Called when the form is sent with a valid email. Return false, or throw, when the details are wrong.
   * Return true (or nothing) when they are right.
   */
  onSubmit?: (values: LoginValues) => boolean | void | Promise<boolean | void>;
  /** Text of the main button. */
  submitLabel?: string;
  /** Shown when onSubmit says the details are wrong. */
  passwordError?: string;
  /** Shown when the email does not look like an email. */
  emailError?: string;
  forgotHref?: string;
  helpHref?: string;
  termsHref?: string;
  privacyHref?: string;
  /** Show the sound button, and play sounds once it is switched on. */
  sound?: boolean;
  /** The text under the plate for each state. */
  captions?: Partial<PlateCaptions>;
  /** The small label at the top left of the plate. */
  plateLabel?: string;
  className?: string;
};

const GoogleG = <span aria-hidden="true">G</span>;

const GitHubMark = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export const DEFAULT_PROVIDERS: LoginProvider[] = [
  {name: 'Google', icon: GoogleG},
  {name: 'GitHub', icon: GitHubMark},
];

/** The small face above the heading. */
export function FaceMark() {
  return (
    <div className="lp-logo" aria-hidden="true">
      <svg viewBox="0 0 64 64" width="64" height="64">
        <rect x="16" y="16" width="32" height="32" rx="4.5" fill="#fff" />
        <g transform="translate(16 16)" fill="none" stroke="#14161d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3">
          <path d="M8.2 9.5v4.5M24 9.5v4.5" />
          <path d="M18.9 1.2C18.4 8 17 14 15.4 18.4c1 .5 2.4.5 3.8.2" />
          <path d="M7.7 21.8Q16 29.6 24.6 21.8" />
        </g>
      </svg>
    </div>
  );
}

/** A "Sign in with ..." button with a glow on its border that follows the pointer. */
function ProviderButton({provider, onPress}: {provider: LoginProvider; onPress: () => void}) {
  const ref = useRef<HTMLButtonElement>(null);
  const glow = useRef({tx: 0, ty: 0, cx: 0, cy: 0, on: false, raf: 0});

  useEffect(() => {
    const g = glow.current;
    return () => cancelAnimationFrame(g.raf);
  }, []);

  const loop = () => {
    const el = ref.current;
    const g = glow.current;
    if (!el) return;
    g.cx += (g.tx - g.cx) * 0.2;
    g.cy += (g.ty - g.cy) * 0.2;
    el.style.setProperty('--mx', `${g.cx}px`);
    el.style.setProperty('--my', `${g.cy}px`);
    g.raf = g.on || Math.abs(g.tx - g.cx) > 0.5 || Math.abs(g.ty - g.cy) > 0.5 ? requestAnimationFrame(loop) : 0;
  };
  const place = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    glow.current.tx = e.clientX - r.left;
    glow.current.ty = e.clientY - r.top;
  };

  return (
    <button
      ref={ref}
      type="button"
      className="lp-oauth"
      onPointerEnter={(e) => {
        place(e);
        const g = glow.current;
        g.cx = g.tx;
        g.cy = g.ty;
        g.on = true;
        if (!g.raf) loop();
      }}
      onPointerMove={place}
      onPointerLeave={() => {
        glow.current.on = false;
      }}
      onClick={() => {
        onPress();
        provider.onClick?.();
      }}
    >
      {provider.icon ? <span className="lp-ico">{provider.icon}</span> : null}
      Sign in with {provider.name}
    </button>
  );
}

const EyeIcon = ({off}: {off: boolean}) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {off ? (
      <>
        <path d="M10.7 5.1A10.4 10.4 0 0 1 12 5c7 0 10 7 10 7a13 13 0 0 1-1.7 2.7M6.6 6.6A13.5 13.5 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
        <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2" />
        <path d="m2 2 20 20" />
      </>
    ) : (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

/** A small number made from the text. The same text always gives the same number. */
function hash(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

type Status = 'idle' | 'loading' | 'success';

export default function LoginPage({
  logo,
  title = 'Welcome to AI Labs',
  description = 'Please sign in or sign up with your Google account.',
  providers = DEFAULT_PROVIDERS,
  onSubmit,
  submitLabel = 'Continue',
  passwordError = 'Please enter the correct password',
  emailError = 'Please enter a valid email',
  forgotHref = '#',
  helpHref = '#',
  termsHref = '#',
  privacyHref = '#',
  sound = true,
  captions,
  plateLabel,
  className,
}: LoginPageProps) {
  const uid = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<{field: 'email' | 'password'; message: string} | null>(null);
  const [shake, setShake] = useState(false);
  const [plate, setPlate] = useState<PlateState>('idle');
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const [soundOn, setSoundOn] = useState(false);
  const [audio] = useState(() => new ResonanceAudio());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => {
      list.forEach(clearTimeout);
      audio.dispose();
    };
  }, [audio]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  /** Any edit clears the old result and changes the pattern on the plate. */
  const edit = (nextEmail: string, nextPassword: string) => {
    setEmail(nextEmail);
    setPassword(nextPassword);
    setError(null);
    if (status === 'success') setStatus('idle');
    setPlate('idle');
    setSeed(hash(`${nextEmail}|${nextPassword}`));
  };

  const toggleSound = async () => {
    if (soundOn) audio.disable();
    else await audio.enable();
    setSoundOn(!soundOn);
  };

  const fail = (field: 'email' | 'password', message: string) => {
    setStatus('idle');
    setError({field, message});
    setShake(true);
    later(() => setShake(false), 500);
    setPlate('error');
    audio.buzz();
    later(() => setPlate((p) => (p === 'error' ? 'idle' : p)), 2400);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    // A short pause, so the button feels like it is thinking even when the answer is instant.
    const pause = new Promise((r) => setTimeout(r, 650));
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      await pause;
      fail('email', emailError);
      return;
    }
    let ok = true;
    try {
      const result = await Promise.all([onSubmit?.({email, password, remember}), pause]);
      ok = result[0] !== false;
    } catch {
      ok = false;
    }
    if (!ok) {
      fail('password', passwordError);
      return;
    }
    setStatus('success');
    setPlate('success');
    audio.chord();
  };

  const emailId = `${uid}-email`;
  const passId = `${uid}-password`;
  const errId = `${uid}-error`;
  const emailBad = error?.field === 'email';
  const passBad = error?.field === 'password';

  const errorRow = error ? (
    <p className="lp-err" id={errId} role="alert">
      <i aria-hidden="true">!</i>
      <span>{error.message}</span>
    </p>
  ) : null;

  return (
    <div className={cn('lp', className)}>
      <div className="lp-grid">
        <section className="lp-left">
          <div className="lp-card">
            {logo === undefined ? <FaceMark /> : logo}
            <h1>{title}</h1>
            <p className="lp-sub">{description}</p>

            {providers.length ? (
              <>
                <div className="lp-providers">
                  {providers.map((p) => (
                    <ProviderButton key={p.name} provider={p} onPress={() => audio.confirm()} />
                  ))}
                </div>
                <div className="lp-or">OR</div>
              </>
            ) : null}

            <form onSubmit={submit} noValidate className={providers.length ? undefined : 'lp-form-only'}>
              <div className={cn('lp-field', emailBad && 'is-invalid', emailBad && shake && 'is-shaking')}>
                <label htmlFor={emailId}>Email</label>
                <input
                  id={emailId}
                  type="email"
                  autoComplete="email"
                  placeholder="grace@org.com"
                  value={email}
                  aria-invalid={emailBad}
                  aria-describedby={emailBad ? errId : undefined}
                  onChange={(e) => edit(e.target.value, password)}
                  onKeyDown={(e) => audio.key(e.key)}
                />
                {emailBad ? errorRow : null}
              </div>

              <div className={cn('lp-field', passBad && 'is-invalid', passBad && shake && 'is-shaking')}>
                <label htmlFor={passId}>Password</label>
                <div className="lp-inp">
                  <input
                    id={passId}
                    type={show ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    aria-invalid={passBad}
                    aria-describedby={passBad ? errId : undefined}
                    onChange={(e) => edit(email, e.target.value)}
                    onKeyDown={(e) => audio.key(e.key)}
                  />
                  <button
                    type="button"
                    className="lp-eye"
                    aria-label={show ? 'Hide password' : 'Show password'}
                    aria-pressed={show}
                    onClick={() => {
                      setShow(!show);
                      audio.pluck(show ? 392 : 523.25, 0.1, 0.5);
                    }}
                  >
                    <EyeIcon off={!show} />
                  </button>
                </div>
                {passBad ? errorRow : null}
              </div>

              <div className="lp-row">
                <label className="lp-chk">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  Remember me
                </label>
                <a href={forgotHref}>Forgot password?</a>
              </div>

              <button type="submit" className="lp-go" data-state={status} disabled={status === 'loading'}>
                {status === 'loading' ? <span className="lp-spin" aria-hidden="true" /> : null}
                <span>{status === 'loading' ? 'Checking' : status === 'success' ? 'Signed in' : submitLabel}</span>
              </button>
            </form>

            <p className="lp-help">
              <a href={helpHref}>Have trouble signing in?</a>
            </p>
          </div>

          <p className="lp-terms">
            By continuing, you agree to our <a href={termsHref}>Terms of Service</a> and <a href={privacyHref}>Privacy Policy</a>.
          </p>
        </section>

        <section className="lp-right">
          <ResonancePlate
            state={plate}
            seed={seed}
            audio={audio}
            soundOn={soundOn}
            onToggleSound={sound ? toggleSound : undefined}
            captions={captions}
            label={plateLabel}
          />
        </section>
      </div>
    </div>
  );
}

export {LoginPage};