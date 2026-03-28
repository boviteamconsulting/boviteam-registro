'use client';

import { useState } from 'react';
import { Cliente } from '@/lib/types';
import { createCliente, updateCliente } from '@/lib/clienti';

interface FormClienteProps {
  cliente?: Cliente;
  onSuccess?: () => void;
}

export function FormCliente({ cliente, onSuccess }: FormClienteProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      intestazione_cliente: formData.get('intestazione_cliente') as string,
      referente: formData.get('referente') as string || null,
      telefono: formData.get('telefono') as string || null,
      email: formData.get('email') as string || null,
      indirizzo: formData.get('indirizzo') as string || null,
      comune: formData.get('comune') as string || null,
      provincia: formData.get('provincia') as string || null,
      zona: formData.get('zona') as string || null,
      note_cliente: formData.get('note_cliente') as string || null,
      cliente_attivo: formData.get('cliente_attivo') === 'on',
    };

    try {
      if (cliente?.id) {
        await updateCliente(cliente.id, data);
        setMessage('Cliente aggiornato');
      } else {
        await createCliente(data);
        setMessage('Cliente creato');
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
        {cliente ? 'Modifica Cliente' : 'Nuovo Cliente'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-brand-burgundy mb-1">
            Nome/Ragione Sociale *
          </label>
          <input
            type="text"
            name="intestazione_cliente"
            required
            defaultValue={cliente?.intestazione_cliente || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded text-lg focus:outline-none focus:border-brand-green"
            placeholder="es. Azienda Agricola..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-burgundy mb-1">
            Referente
          </label>
          <input
            type="text"
            name="referente"
            defaultValue={cliente?.referente || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
            placeholder="es. Mario Rossi"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-burgundy mb-1">
            Telefono
          </label>
          <input
            type="tel"
            name="telefono"
            defaultValue={cliente?.telefono || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded text-lg focus:outline-none focus:border-brand-green"
            placeholder="es. 320 123 4567"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-burgundy mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            defaultValue={cliente?.email || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
            placeholder="es. info@azienda.it"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-burgundy mb-1">
            Indirizzo
          </label>
          <input
            type="text"
            name="indirizzo"
            defaultValue={cliente?.indirizzo || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
            placeholder="es. Via Roma 123"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-burgundy mb-1">
              Comune
            </label>
            <input
              type="text"
              name="comune"
              defaultValue={cliente?.comune || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
              placeholder="es. Parma"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-burgundy mb-1">
              Provincia
            </label>
            <input
              type="text"
              name="provincia"
              defaultValue={cliente?.provincia || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
              placeholder="es. PR"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-burgundy mb-1">
            Zona
          </label>
          <input
            type="text"
            name="zona"
            defaultValue={cliente?.zona || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
            placeholder="es. Zona A"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-burgundy mb-1">
            Note
          </label>
          <textarea
            name="note_cliente"
            defaultValue={cliente?.note_cliente || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
            placeholder="Note interne..."
            rows={3}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="cliente_attivo"
            id="cliente_attivo"
            defaultChecked={cliente?.cliente_attivo !== false}
            className="w-5 h-5"
          />
          <label htmlFor="cliente_attivo" className="text-sm font-medium">
            Cliente attivo
          </label>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-brand-green text-white font-semibold py-3 rounded text-lg hover:bg-opacity-90 disabled:opacity-50"
        >
          {loading ? 'Salvataggio...' : cliente ? 'Aggiorna' : 'Crea'}
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
