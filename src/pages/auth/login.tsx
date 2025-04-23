import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useRedirectAuth } from '../../context/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(false);
  const navigate = useNavigate();
  
  // If already logged in, redirect to home
  useRedirectAuth();

  // Check URL for email verification success message
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('verified') === 'true') {
      setErrorMsg(null);
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'p-3 bg-green-500/20 border border-green-500 rounded-md mb-4';
      successMessage.innerHTML = '<p class="text-sm text-green-400">Email verified successfully! Please log in to continue.</p>';
      
      const formElement = document.querySelector('form');
      if (formElement && !formElement.querySelector('.email-verified-message')) {
        successMessage.classList.add('email-verified-message');
        formElement.prepend(successMessage);
      }
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    
    try {
      setErrorMsg(null);
      setLoading(true);
      
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      // Check if user has a profile
      if (data?.user) {
        setCheckingProfile(true);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();
        
        setCheckingProfile(false);
        
        if (profileError && profileError.code === 'PGRST116') {
          // No profile found - redirect to onboarding
          navigate('/onboarding');
          return;
        }
        
        // Has profile or other error - auth context will handle it
      }
      
      // Auth state change will handle redirecting to home
    } catch (error: any) {
      console.error('Error logging in:', error);
      setErrorMsg(error.message || 'Error logging in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 lg:px-8 relative z-10">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-stellar-blue">
          Sign in to 抱團Vibe
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLogin}>
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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-stellar-blue">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-cosmic-purple hover:text-cosmic-purple/80">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cosmic-purple sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || checkingProfile}
              className="flex w-full justify-center rounded-md bg-cosmic-purple px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cosmic-purple/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cosmic-purple disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : checkingProfile ? 'Checking profile...' : 'Sign in'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-stellar-blue">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="font-semibold leading-6 text-cosmic-purple hover:text-cosmic-purple/80">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
} 