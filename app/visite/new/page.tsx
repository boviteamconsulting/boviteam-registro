'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormVisita } from '@/components/FormVisita';

export const dynamic = 'force-dynamic';

export default function NewVisitaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clienteId = searchParams.get('cliente');

  return (
    <div className="max-w-2xl mx-auto p-4">
      <FormVisita clienteIdPreselected={clienteId || undefined} onSuccess={() => router.push('/visite')} />
    </div>
  );
}
