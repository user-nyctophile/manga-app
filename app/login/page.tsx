'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError('Invalid email or password.');
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-8">
      <h1 className="font-display text-3xl font-bold mb-1 text-ink">Welcome back</h1>
      <p className="text-ink/60 mb-8 text-sm">Sign in to sync your favorites and history.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-ink/50 mb-1.5 font-mono">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-panel border border-line rounded-sm px-4 py-3 text-ink focus:outline-none focus:border-spine"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-ink/50 mb-1.5 font-mono">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-panel border border-line rounded-sm px-4 py-3 text-ink focus:outline-none focus:border-spine"
          />
        </div>
        {error && <p className="text-spine text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-spine hover:bg-spine-dim text-paper font-semibold py-3 rounded-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6 text-center">
        No account?{' '}
        <Link href="/register" className="text-spine font-semibold hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
