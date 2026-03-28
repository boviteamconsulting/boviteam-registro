'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchVisiteOggi, fetchProssimiContatti, fetchUltimeVisite } from '@/lib/visite';
import { fetchClienti } from '@/lib/clienti';
import { Visita, Cliente } from '@/lib/types';
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

export default function Home() {
  const [visiteOggi, setVisiteOggi] = useState<Visita[]>([]);
  const [prossimiContatti, setProssimiContatti] = useState<Visita[]>([]);
  const [ultimeVisite, setUltimeVisite] = useState<Visita[]>([]);
  const [clienti, setClienti] = useState<Record<string, Cliente>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [oggiData, prossData, ultData, clientiData] = await Promise.all([
          fetchVisiteOggi(),
          fetchProssimiContatti(),
          fetchUltimeVisite(),
          fetchClienti(),
        ]);

        setVisiteOggi(oggiData);
        setProssimiContatti(prossData);
        setUltimeVisite(ultData);

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
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-lg text-brand-gray">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/clienti/new" className="bg-brand-green text-white rounded-lg p-6 text-center font-bold hover:bg-opacity-90 shadow-md">
          <div className="text-3xl mb-2">+</div>
          <div>Nuovo Cliente</div>
        </Link>
        <Link href="/visite/new" className="bg-brand-burgundy text-white rounded-lg p-6 text-center font-bold hover:bg-opacity-90 shadow-md">
          <div className="text-3xl mb-2">+</div>
          <div>Nuova Visita</div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/clienti" className="bg-white border-2 border-brand-green text-brand-green rounded-lg p-4 text-center font-semibold hover:bg-brand-cream shadow">
          Elenco Clienti
        </Link>
        <Link href="/visite" className="bg-white border-2 border-brand-burgundy text-brand-burgundy rounded-lg p-4 text-center font-semibold hover:bg-brand-cream shadow">
          Elenco Visite
        </Link>
      </div>

      {/* Visite Oggi */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-brand-burgundy mb-4 font-league-spartan">
          Visite di Oggi ({visiteOggi.length})
        </h2>
        {visiteOggi.length === 0 ? (
          <p className="text-brand-gray text-sm">Nessuna visita programmata oggi</p>
        ) : (
          <div className="space-y-3">
            {visiteOggi.map(v => (
              <Link key={v.id} href={`/visite/${v.id}`} className="block p-3 bg-brand-cream rounded hover:bg-opacity-50">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="font-semibold">
                      {clienti[v.cliente_id]?.intestazione_cliente}
                    </div>
                    <div className="text-sm text-brand-gray">
                      {formatTime(v.ora_visita)} • {v.categoria}
                    </div>
                  </div>
                  {v.stato_visita && <StatoBadgeComponent stato={v.stato_visita} />}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Prossimi Contatti */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-brand-burgundy mb-4 font-league-spartan">
          Prossimi Contatti ({prossimiContatti.length})
        </h2>
        {prossimiContatti.length === 0 ? (
          <p className="text-brand-gray text-sm">Nessun contatto programmato</p>
        ) : (
          <div className="space-y-3">
            {prossimiContatti.map(v => (
              <Link key={v.id} href={`/visite/${v.id}`} className="block p-3 bg-brand-cream rounded hover:bg-opacity-50">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="font-semibold">
                      {clienti[v.cliente_id]?.intestazione_cliente}
                    </div>
                    <div className="text-sm text-brand-gray">
                      {formatDate(v.data_prossimo_contatto)}
                    </div>
                  </div>
                  {v.stato_visita && <StatoBadgeComponent stato={v.stato_visita} />}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Ultime Visite */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-brand-burgundy mb-4 font-league-spartan">
          Ultime Visite
        </h2>
        {ultimeVisite.length === 0 ? (
          <p className="text-brand-gray text-sm">Nessuna visita</p>
        ) : (
          <div className="space-y-3">
            {ultimeVisite.map(v => (
              <Link key={v.id} href={`/visite/${v.id}`} className="block p-3 bg-brand-cream rounded hover:bg-opacity-50">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="font-semibold">
                      {clienti[v.cliente_id]?.intestazione_cliente}
                    </div>
                    <div className="text-sm text-brand-gray">
                      {formatDate(v.data_visita)} • {v.categoria}
                    </div>
                  </div>
                  {v.stato_visita && <StatoBadgeComponent stato={v.stato_visita} />}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
