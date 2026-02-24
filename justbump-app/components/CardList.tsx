'use client';

import React, { useEffect, useState } from 'react';

type Card = {
  id: number;
  full_name: string;
  job_title?: string | null;
  company?: string | null;
  slug: string;
  is_active: number | boolean;
  created_at: string;
};

export default function CardList() {
  const [cards, setCards] = useState<Card[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/cards')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => setCards(data))
      .catch((err) => setError(String(err)));
  }, []);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!cards) return <div>Loading...</div>;
  if (cards.length === 0) return <div>No calling cards yet.</div>;

  return (
    <ul>
      {cards.map((c) => (
        <li key={c.id}>
          <strong>{c.full_name}</strong> — {c.job_title ?? c.company ?? '—'} <small>({c.slug})</small>
        </li>
      ))}
    </ul>
  );
}
