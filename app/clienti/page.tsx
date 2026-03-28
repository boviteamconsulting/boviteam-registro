'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchClienti, searchClienti } from '@/lib/clienti';
import { fetchVisiteByClienteId } from '@/lib/visite';
import { Cliente, Visita } from '@/lib/types';

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('it-IT');
}

export default function ClientiPage() {
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [ultimaVisita, setUltimaVisita] = useState<Record<string, Visita | null>>({});
  const [search, setSearch] = useState('');
  const [filtroZona, setFiltroZona] = useState('');
  const [filtroAttivi, setFiltroAttivi] = useState(true);
  const [loading, setLoading] = useState(true);
  const [zone, setZone] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = search ? await searchClienti(search) : await fetchClienti();
        let filtered = data;

        if (filtroZona) {
          filtered = filtered.filter(c => c.zona === filtroZona);
        }

        if (filtroAttivi) {
          filtered = filtered.filter(c => c.cliente_attivo);
        }

        setClienti(filtered);

        // Extract unique zones
        const allClienti = await fetchClienti();
        const uniqueZone = Array.from(new Set(allClienti.map(c => c.zona).filter(Boolean))) as string[];
        setZone(uniqueZone.sort());

        // Fetch last visit for each client
        const visitMap: Record<string, Visita | null> = {};
        for (const c of filtered) {
          const visite = await fetchVisiteByClienteId(c.id);
          visitMap[c.id] = visite.length > 0 ? visite[0] : null;
        }
        setUltimaVisita(visitMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      setLoading(true);
      load();
    }, search ? 300 : 0);

    return () => clearTimeout(timer);
  }, [search, filtroZona, filtroAttivi]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  if (loading && clienti.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-lg text-brand-gray">Caricamento clienti...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-burgundy font-league-spartan">
          Clienti ({clienti.length})
        </h1>
        <Link href="/clienti/new" className="bg-brand-green text-white px-4 py-2 rounded font-semibold hover:bg-opacity-90">
          Nuovo
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Cerca cliente..."
        value={search}
        onChange={handleSearch}
        className="w-full px-4 py-3 border border-gray-300 rounded text-lg focus:outline-none focus:border-brand-green"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filtroZona}
          onChange={(e) => setFiltroZona(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green text-sm"
        >
          <option value="">Tutte le zone</option>
          {zone.map(z => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>

        <button
          onClick={() => setFiltroAttivi(!filtroAttivi)}
          className={`px-3 py-2 rounded font-semibold text-sm ${
            filtroAttivi
              ? 'bg-brand-green text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {filtroAttivi ? 'Solo Attivi' : 'Tutti'}
        </button>
      </div>

      {/* Lista */}
      {clienti.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-brand-gray">Nessun cliente trovato</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clienti.map(cliente => (
            <Link key={cliente.id} href={`/clienti/${cliente.id}`} className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-bold text-lg">
                    {cliente.intestazione_cliente}
                  </div>
                  {cliente.referente && (
                    <div className="text-sm text-brand-gray">
                      {cliente.referente}
                    </div>
                  )}
                  <div className="flex gap-3 mt-2 text-xs text-brand-gray">
                    {cliente.telefono && (
                      <div>📞 {cliente.telefono}</div>
                    )}
                    {cliente.comune && (
                      <div>📍 {cliente.comune}</div>
                    )}
                  </div>
                  {cliente.zona && (
                    <div className="text-xs bg-brand-cream px-2 py-1 rounded inline-block mt-2">
                      Zona: {cliente.zona}
                    </div>
                  )}
                  {ultimaVisita[cliente.id] && (
                    <div className="text-xs text-brand-gray mt-2">
                      Ultima visita: {formatDate(ultimaVisita[cliente.id]?.data_visita)}
                    </div>
                  )}
                </div>
                <div className="text-right text-xs text-brand-gray">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
