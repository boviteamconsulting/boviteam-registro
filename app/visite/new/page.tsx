import { Suspense } from 'react';
import NewVisitaClient from './NewVisitaClient';

export default function NewVisitaPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto p-4">Caricamento...</div>}>
      <NewVisitaClient />
    </Suspense>
  );
}
