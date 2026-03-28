import { supabase } from './supabase';
import { Cliente } from './types';

export async function fetchClienti() {
  const { data, error } = await supabase
    .from('clienti')
    .select('*')
    .order('data_creazione', { ascending: false });

  if (error) throw error;
  return data as Cliente[];
}

export async function fetchClienteById(id: string) {
  const { data, error } = await supabase
    .from('clienti')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Cliente;
}

export async function searchClienti(query: string) {
  const { data, error } = await supabase
    .from('clienti')
    .select('*')
    .or(`intestazione_cliente.ilike.%${query}%,referente.ilike.%${query}%`)
    .order('data_creazione', { ascending: false });

  if (error) throw error;
  return data as Cliente[];
}

export async function createCliente(cliente: Omit<Cliente, 'id' | 'data_creazione'>) {
  const { data, error } = await supabase
    .from('clienti')
    .insert({
      ...cliente,
      data_creazione: new Date().toISOString(),
      cliente_attivo: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Cliente;
}

export async function updateCliente(id: string, updates: Partial<Cliente>) {
  const { data, error } = await supabase
    .from('clienti')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Cliente;
}

export async function deleteCliente(id: string) {
  const { error } = await supabase
    .from('clienti')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
