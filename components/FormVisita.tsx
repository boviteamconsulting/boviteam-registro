'use client';

import { useState, useEffect } from 'react';
import { Cliente, Visita, CATEGORIE, STATI } from '@/lib/types';
import { createVisita, updateVisita } from '@/lib/visite';
import { fetchClienti } from '@/lib/clienti';

interface FormVisitaProps {
  visita?: Visita;
  clienteIdPreselected?: string;
  onSuccess?: () => void;
}

export function FormVisita({ visita, clienteIdPreselected, onSuccess }: FormVisitaProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [clienti, setClienti] = useState<Cliente[]>([]);

  useEffect(() => {
    fetchClienti().then(setClienti).catch(console.error);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      cliente_id: formData.get('cliente_id') as string,
      data_visita: formData.get('data_visita') as string || null,
      ora_visita: formData.get('ora_visita') as string || null,
      categoria: (formData.get('categoria') as string || null) as any,
      esito_visita: formData.get('esito_visita') as string || null,
      note_visita: formData.get('note_visita') as string || null,
      prossima_azione: formData.get('prossima_azione') as string || null,
      data_prossimo_contatto: formData.get('data_prossimo_contatto') as string || null,
      stato_visita: (formData.get('stato_visita') as string || null) as any,
    };

    try {
      if (visita?.id) {
        await updateVisita(visita.id, data);
        setMessage('Visita aggiornata');
      } else {
        await createVisita(data);
        setMessage('Visita creata');
      }
      setTimeout(() => {
        onSuccess?.();
      }, 500);
    } catch (err: any) {
      setMessage('Errore: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <h2 className="text-xl font-bold text-brand-burgundy mb-6 font-league-spartan">
        {visita ? 'Modifica Visita' : 'Nuova Visita'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-brand-burgundy mb-1">
            Cliente *
          </label>
          <select
            name="cliente_id"
            required
            defaultValue={clienteIdPreselected || visita?.cliente_id || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded text-lg focus:outline-none focus:border-brand-green"
          >
            <option value="">-- Seleziona cliente --</option>
            {clienti.map(c => (
              <option key={c.id} value={c.id}>
                {c.intestazione_cliente}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-burgundy mb-1">
              Data Visita
            </label>
            <input
              type="date"
              name="data_visita"
              defaultValue={visita?.data_visita || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded text-lg focus:outline-none focus:border-brand-green"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-burgundy mb-1">
              Ora
            </label>
            <input
              type="time"
              name="ora_visita"
              defaultValue={visita?.ora_visita || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded text-lg focus:outline-none focus:border-brand-green"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-burgundy mb-1">
            Categoria
          </label>
          <select
            name="categoria"
            defaultValue={visita?.categoria || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
          >
            <option value="">-- Nessuna --</option>
            {CATEGORIE.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-burgundy mb-1">
            Esito
          </label>
          <input
            type="text"
            name="esito_visita"
            defaultValue={visita?.esito_visita || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
            placeholder="es. Buone condizioni, da monitorare..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-burgundy mb-1">
            Note
          </label>
          <textarea
            name="note_visita"
            defaultValue={visita?.note_visita || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
            placeholder="Note sulla visita..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-burgundy mb-1">
            Prossima Azione
          </label>
          <input
            type="text"
            name="prossima_azione"
            defaultValue={visita?.prossima_azione || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
            placeholder="es. Effettuare analisi..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-burgundy mb-1">
            Data Prossimo Contatto
          </label>
          <input
            type="date"
            name="data_prossimo_contatto"
            defaultValue={visita?.data_prossimo_contatto || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-burgundy mb-1">
            Stato
          </label>
          <select
            name="stato_visita"
            defaultValue={visita?.stato_visita || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
          >
            <option value="">-- Nessuno --</option>
            {STATI.map(stato => (
              <option key={stato} value={stato}>
                {stato.charAt(0).toUpperCase() + stato.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-brand-green text-white font-semibold py-3 rounded text-lg hover:bg-opacity-90 disabled:opacity-50"
        >
          {loading ? 'Salvataggio...' : visita ? 'Aggiorna' : 'Crea'}
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded text-center font-semibold ${
          message.startsWith('Errore') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {message}
        </div>
      )}
    </form>
  );
}
