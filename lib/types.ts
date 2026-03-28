export type Cliente = {
  id: string;
  intestazione_cliente: string;
  referente?: string | null;
  telefono?: string | null;
  email?: string | null;
  indirizzo?: string | null;
  comune?: string | null;
  provincia?: string | null;
  zona?: string | null;
  note_cliente?: string | null;
  data_creazione: string;
  cliente_attivo: boolean;
};

export type Visita = {
  id: string;
  cliente_id: string;
  data_visita?: string | null;
  ora_visita?: string | null;
  categoria?: 'grossista' | 'genetica' | 'alimentazione' | 'consulenza' | null;
  esito_visita?: string | null;
  note_visita?: string | null;
  prossima_azione?: string | null;
  data_prossimo_contatto?: string | null;
  stato_visita?: 'aperta' | 'conclusa' | 'annullata' | null;
  data_modifica: string;
  ultima_modifica_da?: string | null;
};

export const CATEGORIE = ['grossista', 'genetica', 'alimentazione', 'consulenza'] as const;
export const STATI = ['aperta', 'conclusa', 'annullata'] as const;

export type CategoriaBadge = typeof CATEGORIE[number];
export type StatoBadge = typeof STATI[number];
