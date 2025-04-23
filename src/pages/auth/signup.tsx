import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useRedirectAuth } from '../../context/auth';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  // If already logged in, redirect to home
  useRedirectAuth();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    
    try {
      setErrorMsg(null);
      setLoading(true);
      
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check if user was created and email confirmation is required
      if (data?.user && !data.session) {
        // Email confirmation is required
        setSuccess(true);
      } else if (data?.user && data.session) {
        // User is automatically logged in (no email confirmation required)
        console.log('User signed up and logged in successfully, redirecting to onboarding');
        navigate('/onboarding');
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      setErrorMsg(error.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col justify-center px-6 py-12 lg:px-8 relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-stellar-blue">
            Check your email
          </h2>
          <div className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-md">
            <p className="text-center text-sm text-green-400">
              We've sent you a confirmation link. Please check your email to verify your account.
            </p>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/auth/login')}
              className="text-cosmic-purple hover:text-cosmic-purple/80 font-medium"
            >
              Return to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 lg:px-8 relative z-10">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-stellar-blue">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSignup}>
          {errorMsg && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded-md">
              <p className="text-sm text-red-400">{errorMsg}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-stellar-blue">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cosmic-purple sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-stellar-blue">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cosmic-purple sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-stellar-blue">
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cosmic-purple sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-cosmic-purple px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cosmic-purple/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cosmic-purple disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-stellar-blue">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-semibold leading-6 text-cosmic-purple hover:text-cosmic-purple/80">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
} 