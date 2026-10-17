import type { Metadata } from 'next';
import MinimalBar from '@/components/layout/MinimalBar';
import AuthForm from '@/components/auth/AuthForm';

export const metadata: Metadata = { title: 'Log in | KrishiSetu' };

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <MinimalBar />
      <main className="flex-1 grid place-items-center px-4 py-10">
        <AuthForm mode="login" />
      </main>
    </div>
  );
}
