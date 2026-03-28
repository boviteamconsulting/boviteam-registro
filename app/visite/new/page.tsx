import dynamic from 'next/dynamic';

const NewVisitaClient = dynamic(
  () => import('./NewVisitaClient'),
  { ssr: false }
);

export default function NewVisitaPage() {
  return <NewVisitaClient />;
}
