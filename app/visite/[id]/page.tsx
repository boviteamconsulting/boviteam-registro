'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { fetchClienteById } from '@/lib/clienti';
import { cancelVisita, updateVisita, deleteVisita } from '@/lib/visite';
import { Cliente, Visita } from '@/lib/types';
import { CategoriaBadgeComponent, StatoBadgeComponent } from '@/components/Badges';

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('it-IT');
}

function formatTime(timeStr?: string | null) {
  if (!timeStr) return '';
  return timeStr;
}

export default function VisitaPage() {
  const params = useParams();
  const router = useRouter();
  const visitaId = params.id as string;

  const [visita, setVisita] = useState<Visita | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('visite')
          .select('*')
          .eq('id', visitaId)
          .single();

        if (error) throw error;

        const visitData = data as Visita;
        setVisita(visitData);

        const clienteData = await fetchClienteById(visitData.cliente_id);
        setCliente(clienteData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [visitaId]);

  async function handleDelete() {
    if (!visita) return;
    if (!confirm('Sei sicuro? Questa azione non può essere annullata')) return;

    try {
      await deleteVisita(visita.id);
      router.push(`/clienti/${visita.cliente_id}`);
    } catch (err: any) {
      alert('Errore: ' + err.message);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!visita) return;

    try {
      await updateVisita(visita.id, { stato_visita: newStatus as any });
      setVisita({ ...visita, stato_visita: newStatus as any });
      setMessage('Stato aggiornato');
      setTimeout(() => {
        setMessage('');
      }, 2000);
    } catch (err: any) {
      setMessage('Errore: ' + err.message);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-lg text-brand-gray">Caricamento...</div>
      </div>
    );
  }

  if (!visita || !cliente) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p className="text-brand-gray">Visita non trovata</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-brand-burgundy font-league-spartan">
              {cliente.intestazione_cliente}
            </h1>
            <p className="text-brand-gray mt-1">
              {formatDate(visita.data_visita)} {formatTime(visita.ora_visita)}
            </p>
          </div>
          <Link href={`/visite/${visita.id}/edit`} className="bg-brand-green text-white px-4 py-2 rounded font-semibold hover:bg-opacity-90">
            Modifica
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {visita.categoria && <CategoriaBadgeComponent categoria={visita.categoria} />}
          {visita.stato_visita && <StatoBadgeComponent stato={visita.stato_visita} />}
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        {visita.esito_visita && (
          <div>
            <div className="font-semibold text-brand-burgundy text-sm">Esito</div>
            <p className="mt-1">{visita.esito_visita}</p>
          </div>
        )}

        {visita.note_visita && (
          <div>
            <div className="font-semibold text-brand-burgundy text-sm">Note</div>
            <p className="mt-1">{visita.note_visita}</p>
          </div>
        )}

        {visita.prossima_azione && (
          <div>
            <div className="font-semibold text-brand-burgundy text-sm">Prossima Azione</div>
            <p className="mt-1">{visita.prossima_azione}</p>
          </div>
        )}

        {visita.data_prossimo_contatto && (
          <div>
            <div className="font-semibold text-brand-burgundy text-sm">Prossimo Contatto</div>
            <p className="mt-1 text-brand-green font-semibold">
              {formatDate(visita.data_prossimo_contatto)}
            </p>
          </div>
        )}
      </div>

      {/* Status Actions */}
      <div className="bg-white rounded-lg shadow p-6 space-y-3">
        <div className="font-semibold text-brand-burgundy text-sm mb-3">Cambia Stato</div>
        <div className="space-y-2">
          <button
            onClick={() => handleStatusChange('aperta')}
            className={`w-full px-4 py-2 rounded font-semibold ${
              visita.stato_visita === 'aperta'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Aperta
          </button>
          <button
            onClick={() => handleStatusChange('conclusa')}
            className={`w-full px-4 py-2 rounded font-semibold ${
              visita.stato_visita === 'conclusa'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Conclusa
          </button>
          <button
            onClick={() => handleStatusChange('annullata')}
            className={`w-full px-4 py-2 rounded font-semibold ${
              visita.stato_visita === 'annullata'
                ? 'bg-gray-300 text-gray-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Annulla
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Link href={`/clienti/${cliente.id}`} className="flex-1 bg-brand-burgundy text-white text-center font-semibold py-3 rounded hover:bg-opacity-90">
          Torna al Cliente
        </Link>
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-500 text-white font-semibold py-3 rounded hover:bg-red-600"
        >
          🗑️ Elimina
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded text-center font-semibold ${
          message.startsWith('Errore') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
