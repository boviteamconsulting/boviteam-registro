'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchClienteById } from '@/lib/clienti';
import { Cliente } from '@/lib/types';
import { FormCliente } from '@/components/FormCliente';

export default function EditClientePage() {
  const params = useParams();
  const router = useRouter();
  const clienteId = params.id as string;

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchClienteById(clienteId);
        setCliente(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [clienteId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-lg text-brand-gray">Caricamento...</div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p className="text-brand-gray">Cliente non trovato</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <FormCliente cliente={cliente} onSuccess={() => router.push(`/clienti/${cliente.id}`)} />
    </div>
  );
}
