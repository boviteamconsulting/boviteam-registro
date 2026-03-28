'use client';

import { useRouter } from 'next/navigation';
import { FormCliente } from '@/components/FormCliente';

export default function NewClientePage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <FormCliente onSuccess={() => router.push('/clienti')} />
    </div>
  );
}
