/* Fixed Automation triggers - Compatible column names + idempotent */

-- Trigger: ATS screening complete
CREATE OR REPLACE FUNCTION public.handle_ats_screening_complete()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.candidate_evaluations (application_id, candidate_id, job_id, ats_score, status)
  VALUES (
    NEW.application_id, 
    (SELECT candidate_id FROM public.applications WHERE id = NEW.application_id),
    (SELECT job_id FROM public.applications WHERE id = NEW.application_id),
    NEW.total_score,
    CASE 
      WHEN NEW.total_score >= 70 THEN 'assessment_ready'
      WHEN NEW.total_score >= 60 THEN 'assessment_ready'
      ELSE 'rejected'
    END
  )
  ON CONFLICT (application_id) DO UPDATE SET ats_score = EXCLUDED.ats_score, status = EXCLUDED.status;

  UPDATE public.applications 
  SET status = CASE 
    WHEN NEW.total_score >= 60 THEN 'assessment_pending'
    ELSE 'rejected'
  END
  WHERE id = NEW.application_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Assessment complete
CREATE OR REPLACE FUNCTION public.handle_assessment_complete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.candidate_evaluations 
  SET assessment_score = NEW.score, status = 'ai_interview_ready'
  WHERE application_id = NEW.application_id;

  UPDATE public.applications 
  SET status = CASE 
    WHEN NEW.score >= 70 THEN 'ai_interview_pending'
    ELSE 'recruiter_review'
  END
  WHERE id = NEW.application_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- AI interview complete
CREATE OR REPLACE FUNCTION public.handle_ai_interview_complete()
RETURNS TRIGGER AS $$ 
BEGIN
  UPDATE public.candidate_evaluations 
  SET ai_interview_score = NEW.score, status = 'completed'
  WHERE application_id = NEW.application_id;

  UPDATE public.applications 
  SET status = CASE 
    WHEN NEW.score >= 65 THEN 'recruiter_review'
    ELSE 'rejected'
  END
  WHERE id = NEW.application_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC final score recalc (no update generated column, use triggers)
CREATE OR REPLACE FUNCTION public.recalculate_candidate_score(p_application_id UUID)
RETURNS public.candidate_evaluations AS $$
  SELECT * FROM public.candidate_evaluations 
  WHERE application_id = p_application_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Drop old triggers if exist
DROP TRIGGER IF EXISTS trg_ats_screening_complete ON public.ats_screenings;
DROP TRIGGER IF EXISTS trg_assessment_complete ON public.assessment_results;
DROP TRIGGER IF EXISTS trg_ai_interview_complete ON public.ai_interviews;
DROP TRIGGER IF EXISTS trg_notify_app_status ON public.applications;
DROP TRIGGER IF EXISTS trg_ats_screening_complete ON public.ats_screenings;
DROP TRIGGER IF EXISTS trg_assessment_complete ON public.assessment_results;
DROP TRIGGER IF EXISTS trg_ai_interview_complete ON public.ai_interviews;

-- Create triggers
CREATE TRIGGER trg_ats_screening_complete
  AFTER INSERT OR UPDATE OF total_score ON public.ats_screenings
  FOR EACH ROW EXECUTE FUNCTION public.handle_ats_screening_complete();

CREATE TRIGGER trg_assessment_complete
  AFTER INSERT ON public.assessment_results
  FOR EACH ROW EXECUTE FUNCTION public.handle_assessment_complete();

CREATE TRIGGER trg_ai_interview_complete
  AFTER UPDATE OF score, status ON public.ai_interviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_ai_interview_complete();
