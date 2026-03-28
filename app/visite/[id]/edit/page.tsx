'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Visita } from '@/lib/types';
import { FormVisita } from '@/components/FormVisita';

export default function EditVisitaPage() {
  const params = useParams();
  const router = useRouter();
  const visitaId = params.id as string;

  const [visita, setVisita] = useState<Visita | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('visite')
          .select('*')
          .eq('id', visitaId)
          .single();

        if (error) throw error;

        setVisita(data as Visita);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [visitaId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-lg text-brand-gray">Caricamento...</div>
      </div>
    );
  }

  if (!visita) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p className="text-brand-gray">Visita non trovata</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <FormVisita visita={visita} onSuccess={() => router.push(`/visite/${visita.id}`)} />
    </div>
  );
}
