import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FloatingInput } from '../components/Auth/FloatingInput';
import { validateEmail, validatePassword } from '../utils/validation';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitError, setSubmitError] = useState('');

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError || undefined,
        password: passwordError || undefined,
      });
      return;
    }

    setErrors({});
    try {
      await login(email, password, rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      setSubmitError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-netput-dark">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a1a] rounded-lg shadow-2xl p-8 animate-scale-in">
          <Link to="/" className="flex justify-center mb-8">
            <span className="text-4xl font-bold text-netput-red">Netput</span>
          </Link>
          <h1 className="text-2xl font-bold text-center text-white mb-6">Sign In</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <FloatingInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
              disabled={isLoading}
            />
            <FloatingInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
              disabled={isLoading}
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#333] border-gray-600 text-netput-red focus:ring-netput-red"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                Remember me
              </label>
            </div>
            {submitError && (
              <p className="text-sm text-red-400">{submitError}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-netput-red hover:bg-netput-red-hover text-white font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          <p className="mt-6 text-center text-gray-400 text-sm">
            New to Netput?{' '}
            <Link to="/signup" className="text-netput-red hover:underline">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
