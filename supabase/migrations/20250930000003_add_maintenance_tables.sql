-- Create enums for severity, status, and note visibility
DO $$ BEGIN
  CREATE TYPE public.maintenance_severity AS ENUM ('Low','Medium','High');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.maintenance_status AS ENUM ('Open','In Progress','Done');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.note_visibility AS ENUM ('Internal','Public');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- maintenance_tasks table
CREATE TABLE IF NOT EXISTS public.maintenance_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  vehicle_label text NULL,
  task text NOT NULL,
  description text NOT NULL,
  due_date date NOT NULL,
  due_km integer NOT NULL CHECK (due_km >= 0),
  severity public.maintenance_severity NOT NULL DEFAULT 'Medium',
  status public.maintenance_status NOT NULL DEFAULT 'Open',
  assignee text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- maintenance_task_notes table
CREATE TABLE IF NOT EXISTS public.maintenance_task_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.maintenance_tasks(id) ON DELETE CASCADE,
  content text NOT NULL,
  visibility public.note_visibility NOT NULL DEFAULT 'Internal',
  created_by uuid NULL REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Triggers to update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER set_maintenance_tasks_updated_at
  BEFORE UPDATE ON public.maintenance_tasks
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- RLS: enable and allow authenticated users for now
ALTER TABLE public.maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_task_notes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Allow read for all authenticated" ON public.maintenance_tasks
    FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow insert for all authenticated" ON public.maintenance_tasks
    FOR INSERT TO authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow update for all authenticated" ON public.maintenance_tasks
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow read for all authenticated (notes)" ON public.maintenance_task_notes
    FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow insert for all authenticated (notes)" ON public.maintenance_task_notes
    FOR INSERT TO authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow delete own notes" ON public.maintenance_task_notes
    FOR DELETE TO authenticated USING (auth.uid()::text = created_by::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
