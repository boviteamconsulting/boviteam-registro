-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clienti table
CREATE TABLE clienti (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  intestazione_cliente text NOT NULL UNIQUE,
  referente text,
  telefono text,
  email text,
  indirizzo text,
  comune text,
  provincia text,
  zona text,
  note_cliente text,
  data_creazione timestamp with time zone DEFAULT now(),
  cliente_attivo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create visite table
CREATE TABLE visite (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id uuid NOT NULL REFERENCES clienti(id) ON DELETE CASCADE,
  data_visita date,
  ora_visita time,
  categoria text CHECK (categoria IN ('grossista', 'genetica', 'alimentazione', 'consulenza')),
  esito_visita text,
  note_visita text,
  prossima_azione text,
  data_prossimo_contatto date,
  stato_visita text CHECK (stato_visita IN ('aperta', 'conclusa', 'annullata')),
  data_modifica timestamp with time zone DEFAULT now(),
  ultima_modifica_da text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_visite_cliente_id ON visite(cliente_id);
CREATE INDEX idx_visite_data_visita ON visite(data_visita);
CREATE INDEX idx_visite_stato ON visite(stato_visita);
CREATE INDEX idx_visite_categoria ON visite(categoria);
CREATE INDEX idx_visite_data_prossimo_contatto ON visite(data_prossimo_contatto);
CREATE INDEX idx_clienti_zona ON clienti(zona);
CREATE INDEX idx_clienti_cliente_attivo ON clienti(cliente_attivo);

-- Set up Row Level Security (optional but recommended)
ALTER TABLE clienti ENABLE ROW LEVEL SECURITY;
ALTER TABLE visite ENABLE ROW LEVEL SECURITY;

-- For now, allow all authenticated users to access data
-- You can refine this later
CREATE POLICY "Allow authenticated access to clienti"
  ON clienti FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated access to visite"
  ON visite FOR ALL
  USING (auth.role() = 'authenticated');
