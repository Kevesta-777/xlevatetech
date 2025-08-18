-- Add user_id to outreach events and keep it consistent with leads.user_id
BEGIN;

-- 1) Add column if not exists
ALTER TABLE public.lead_outreach_events
  ADD COLUMN IF NOT EXISTS user_id uuid;

-- 2) Backfill existing rows from leads
UPDATE public.lead_outreach_events e
SET user_id = l.user_id
FROM public.leads l
WHERE e.lead_id = l.id AND e.user_id IS NULL;

-- 3) Make it NOT NULL only if everything is filled
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.lead_outreach_events WHERE user_id IS NULL) THEN
    RAISE NOTICE 'Some lead_outreach_events rows still have NULL user_id. NOT setting NOT NULL constraint.';
  ELSE
    ALTER TABLE public.lead_outreach_events ALTER COLUMN user_id SET NOT NULL;
  END IF;
END$$;

-- 4) Helpful index
CREATE INDEX IF NOT EXISTS idx_lead_outreach_events_user_id ON public.lead_outreach_events(user_id);

-- 5) Trigger to always sync user_id from leads
CREATE OR REPLACE FUNCTION public.set_lead_outreach_user_id()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  SELECT user_id INTO NEW.user_id FROM public.leads WHERE id = NEW.lead_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_lead_outreach_user_id ON public.lead_outreach_events;
CREATE TRIGGER trg_set_lead_outreach_user_id
BEFORE INSERT OR UPDATE OF lead_id ON public.lead_outreach_events
FOR EACH ROW EXECUTE FUNCTION public.set_lead_outreach_user_id();

COMMIT;