'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Something went wrong.');
      setLoading(false);
      return;
    }

    const signInRes = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (signInRes?.error) {
      router.push('/login');
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-8">
      <h1 className="font-display text-3xl font-bold mb-1 text-ink">Create account</h1>
      <p className="text-ink/60 mb-8 text-sm">Save favorites and pick up where you left off, on any device.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-ink/50 mb-1.5 font-mono">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-panel border border-line rounded-sm px-4 py-3 text-ink focus:outline-none focus:border-spine"
          />
        </div>
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-panel border border-line rounded-sm px-4 py-3 text-ink focus:outline-none focus:border-spine"
          />
          <p className="text-xs text-ink/40 mt-1">At least 6 characters.</p>
        </div>
        {error && <p className="text-spine text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-spine hover:bg-spine-dim text-paper font-semibold py-3 rounded-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6 text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-spine font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
