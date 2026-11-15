import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  UserRound,
  X,
} from 'lucide-react';
import { useAppStore } from '../../app/store';
import {
  DEMO_CREDENTIALS,
  INITIAL_DEMO_ADMIN,
  INITIAL_DEMO_CUSTOMER,
} from '../../core/fixtures/demoUser';
import { loginSchema, type LoginFormData } from '../../core/validation/authSchema';
import { NovaLogo } from '../../components/layout/NovaLogo';
import './LoginPage.css';
import { loginDestination } from '../../core/utils/loginDestination';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAppStore((state) => state.loginAsDemo);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');
  const [recovery, setRecovery] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });
  const onSubmit = async (data: LoginFormData) => {
    clearErrors();
    await new Promise((resolve) => setTimeout(resolve, 350));
    const identifier = data.username.trim().toLowerCase();
    const role = (['customer', 'admin'] as const).find((candidate) => {
      const profile = candidate === 'customer' ? INITIAL_DEMO_CUSTOMER : INITIAL_DEMO_ADMIN;
      return (
        (identifier === DEMO_CREDENTIALS[candidate].username ||
          identifier === profile.email ||
          (candidate === 'customer' && identifier === 'demouser')) &&
        data.password === DEMO_CREDENTIALS[candidate].password
      );
    });
    if (!role) {
      setError('root', {
        message: 'Invalid username or password. Check your details and try again.',
      });
      return;
    }
    setWelcomed(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    login(role);
    const routeState: unknown = location.state;
    const from =
      routeState && typeof routeState === 'object' && 'from' in routeState
        ? routeState.from
        : undefined;
    navigate(loginDestination(from, role), { replace: true });
  };
  const privatePose = focused === 'password' || showPassword;
  const mood = welcomed
    ? 'success'
    : privatePose
      ? 'private'
      : focused === 'username'
        ? 'attentive'
        : 'idle';
  return (
    <section className={`nova-login login-mood-${mood}`} aria-labelledby="login-heading">
      <link rel="preload" as="image" href="/images/nova-login-private.png" />
      <div className="login-form-panel">
        <Link className="login-brand" to="/" aria-label="NovaSMM home">
          <NovaLogo />
          <span>NovaSMM</span>
        </Link>
        <div className="login-intro">
          <span className="login-eyebrow">YOUR NEXT CHAPTER</span>
          <h1 id="login-heading">
            Good to have
            <br />
            you back<span>.</span>
          </h1>
          <p>
            A little spark. A world of possibilities.
            <br />
            Sign in to your NovaSMM workspace.
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="login-form"
          noValidate
          aria-busy={isSubmitting}
        >
          <div className="login-field">
            <label htmlFor="login-identity">Email or username</label>
            <div className="login-input-wrap">
              <UserRound size={18} aria-hidden="true" />
              <input
                id="login-identity"
                {...register('username', { onChange: () => clearErrors('root') })}
                placeholder="Your email or username"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                onFocus={() => setFocused('username')}
                onBlur={() => setFocused('')}
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? 'login-identity-error' : undefined}
                disabled={isSubmitting}
              />
            </div>
            {errors.username && (
              <p className="login-error" id="login-identity-error">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="login-field">
            <div className="login-label-row">
              <label htmlFor="login-password">Password</label>
              <button type="button" onClick={() => setRecovery(true)}>
                Forgot password?
              </button>
            </div>
            <div className="login-input-wrap">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                id="login-password"
                {...register('password', { onChange: () => clearErrors('root') })}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="login-eye"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="login-error" id="login-password-error">
                {errors.password.message}
              </p>
            )}
          </div>
          {errors.root && (
            <p role="alert" className="login-form-error">
              {errors.root.message}
            </p>
          )}
          <button type="submit" className="login-submit" disabled={isSubmitting}>
            {welcomed ? (
              <>
                <Check size={19} /> Welcome aboard
              </>
            ) : isSubmitting ? (
              <>
                <LoaderCircle size={19} className="login-spinner" /> Signing you in…
              </>
            ) : (
              <>
                Enter Workspace <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
        {recovery && (
          <aside className="login-recovery" aria-labelledby="recovery-heading">
            <button
              type="button"
              aria-label="Close account help"
              onClick={() => setRecovery(false)}
            >
              <X size={16} />
            </button>
            <h2 id="recovery-heading">Need access to your account?</h2>
            <p>
              Contact your workspace administrator for help. Email password recovery is not
              available yet.
            </p>
          </aside>
        )}
        <Link to="/services" className="login-explore">
          Just looking around?{' '}
          <span>
            Explore services <ArrowRight size={13} />
          </span>
        </Link>
      </div>
      <div className="login-world">
        <div className="login-world-grid" aria-hidden="true" />
        <span className="login-world-label">
          <i /> NOVA IS HERE FOR YOU
        </span>
        <div className="login-portal" aria-hidden="true">
          <i />
          <i />
        </div>
        <div className="login-character">
          <img
            src={privatePose ? '/images/nova-login-private.png' : '/images/nova-login-welcome.png'}
            alt={
              privatePose
                ? 'Nova covering its eyes while you enter your password'
                : 'Nova welcoming you to your workspace'
            }
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/nova-mascot.png';
            }}
          />
        </div>
        <div className="login-nova-caption" aria-live="polite">
          <span>NOVA / YOUR CO-PILOT</span>
          <p>
            {welcomed
              ? 'All set. Let’s make something happen.'
              : privatePose
                ? 'Your password? I’m not looking.'
                : focused === 'username'
                  ? 'There you are. Let’s get you settled.'
                  : 'Your next big idea starts here.'}
          </p>
        </div>
        <div className="login-world-footer">
          <span>STARS · PREMIUM · GROWTH</span>
          <span>ONE WORKSPACE ↗</span>
        </div>
      </div>
    </section>
  );
}
