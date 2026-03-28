import { supabase } from './supabase';
import { Visita } from './types';

export async function fetchVisite() {
  const { data, error } = await supabase
    .from('visite')
    .select('*')
    .order('data_visita', { ascending: false })
    .order('ora_visita', { ascending: false });

  if (error) throw error;
  return data as Visita[];
}

export async function fetchVisiteByClienteId(clienteId: string) {
  const { data, error } = await supabase
    .from('visite')
    .select('*')
    .eq('cliente_id', clienteId)
    .order('data_visita', { ascending: false })
    .order('ora_visita', { ascending: false });

  if (error) throw error;
  return data as Visita[];
}

export async function fetchVisiteOggi() {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('visite')
    .select('*')
    .eq('data_visita', today)
    .neq('stato_visita', 'annullata')
    .order('ora_visita', { ascending: true });

  if (error) throw error;
  return data as Visita[];
}

export async function fetchProssimiContatti() {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('visite')
    .select('*')
    .gte('data_prossimo_contatto', today)
    .neq('stato_visita', 'annullata')
    .order('data_prossimo_contatto', { ascending: true })
    .limit(10);

  if (error) throw error;
  return data as Visita[];
}

export async function fetchUltimeVisite(limit = 10) {
  const { data, error } = await supabase
    .from('visite')
    .select('*')
    .order('data_modifica', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Visita[];
}

export async function createVisita(visita: Omit<Visita, 'id' | 'data_modifica'>) {
  const { data, error } = await supabase
    .from('visite')
    .insert({
      ...visita,
      data_modifica: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as Visita;
}

export async function updateVisita(id: string, updates: Partial<Visita>) {
  const { data, error } = await supabase
    .from('visite')
    .update({
      ...updates,
      data_modifica: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Visita;
}

export async function cancelVisita(id: string) {
  return updateVisita(id, { stato_visita: 'annullata' });
}

export async function deleteVisita(id: string) {
  const { error } = await supabase
    .from('visite')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
