import CardList from '../components/CardList';

export default function Home() {
  return (
    <div>
      <h1>JustBump — Next.js (TypeScript, App Router)</h1>
      <p style={{ color: '#666' }}>Demo: raw SQL via <code>mysql2</code> (no querybuilder).</p>
      <CardList />
    </div>
  );
}
