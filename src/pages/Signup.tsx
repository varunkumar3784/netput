import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FloatingInput } from '../components/Auth/FloatingInput';
import { validateEmail, validatePassword } from '../utils/validation';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [submitError, setSubmitError] = useState('');

  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmError =
      password !== confirmPassword ? 'Passwords do not match' : undefined;

    if (emailError || passwordError || confirmError) {
      setErrors({
        email: emailError || undefined,
        password: passwordError || undefined,
        confirmPassword: confirmError,
      });
      return;
    }

    setErrors({});
    try {
      await signup(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setSubmitError('Sign up failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-netput-dark">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a1a] rounded-lg shadow-2xl p-8 animate-scale-in">
          <Link to="/" className="flex justify-center mb-8">
            <span className="text-4xl font-bold text-netput-red">Netput</span>
          </Link>
          <h1 className="text-2xl font-bold text-center text-white mb-6">
            Create Account
          </h1>
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
              autoComplete="new-password"
              disabled={isLoading}
            />
            <FloatingInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              autoComplete="new-password"
              disabled={isLoading}
            />
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
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
          <p className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-netput-red hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
