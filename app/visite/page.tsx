'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchVisite, fetchVisiteByClienteId } from '@/lib/visite';
import { fetchClienti } from '@/lib/clienti';
import { Visita, Cliente, CATEGORIE, STATI } from '@/lib/types';
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

export default function VisitePage() {
  const [visite, setVisite] = useState<Visita[]>([]);
  const [clienti, setClienti] = useState<Record<string, Cliente>>({});
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroStato, setFiltroStato] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        let data = await fetchVisite();

        // Filters
        if (filtroCliente) {
          data = data.filter(v => v.cliente_id === filtroCliente);
        }
        if (filtroCategoria) {
          data = data.filter(v => v.categoria === filtroCategoria);
        }
        if (filtroStato) {
          data = data.filter(v => v.stato_visita === filtroStato);
        }
        if (filtroData) {
          data = data.filter(v => v.data_visita === filtroData);
        }

        setVisite(data);

        // Load clienti
        const clientiData = await fetchClienti();
        const clientiMap: Record<string, Cliente> = {};
        clientiData.forEach(c => {
          clientiMap[c.id] = c;
        });
        setClienti(clientiMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    load();
  }, [filtroCliente, filtroCategoria, filtroStato, filtroData]);

  if (loading && visite.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-lg text-brand-gray">Caricamento visite...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-burgundy font-league-spartan">
          Visite ({visite.length})
        </h1>
        <Link href="/visite/new" className="bg-brand-burgundy text-white px-4 py-2 rounded font-semibold hover:bg-opacity-90">
          Nuova
        </Link>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <select
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
        >
          <option value="">Tutti i clienti</option>
          {Object.values(clienti).map(c => (
            <option key={c.id} value={c.id}>{c.intestazione_cliente}</option>
          ))}
        </select>

        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
        >
          <option value="">Tutte le categorie</option>
          {CATEGORIE.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>

        <select
          value={filtroStato}
          onChange={(e) => setFiltroStato(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
        >
          <option value="">Tutti gli stati</option>
          {STATI.map(stato => (
            <option key={stato} value={stato}>{stato.charAt(0).toUpperCase() + stato.slice(1)}</option>
          ))}
        </select>

        <input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green"
        />
      </div>

      {/* Lista */}
      {visite.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-brand-gray">Nessuna visita trovata</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visite.map(visita => (
            <Link key={visita.id} href={`/visite/${visita.id}`} className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition border-l-4 border-brand-green">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-bold">
                    {clienti[visita.cliente_id]?.intestazione_cliente}
                  </div>
                  <div className="text-sm text-brand-gray mt-1">
                    {formatDate(visita.data_visita)} {formatTime(visita.ora_visita)}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {visita.categoria && <CategoriaBadgeComponent categoria={visita.categoria} />}
                    {visita.stato_visita && <StatoBadgeComponent stato={visita.stato_visita} />}
                  </div>
                  {visita.esito_visita && (
                    <div className="text-sm text-brand-gray mt-2">
                      {visita.esito_visita}
                    </div>
                  )}
                </div>
                <div className="text-xs text-brand-gray">→</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
