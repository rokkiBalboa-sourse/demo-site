'use client';

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Proceed to login anyway
    }

    window.location.href = '/login';
  };

  return (
    <form action="/api/auth/logout" method="POST" onSubmit={handleLogout}>
      <button
        type="submit"
        disabled={isLoading}
        title="Выйти из системы"
        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer disabled:opacity-50"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </form>
  );
}
