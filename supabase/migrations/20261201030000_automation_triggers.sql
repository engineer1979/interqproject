/* Automation triggers for hiring pipeline */

-- Trigger: Update application status and create evaluation record on ATS screening completion
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
  ON CONFLICT DO NOTHING;

  UPDATE public.applications 
  SET status = CASE 
    WHEN NEW.total_score >= 60 THEN 'assessment_pending'
    ELSE 'rejected'
  END
  WHERE id = NEW.application_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_ats_screening_complete
  AFTER INSERT OR UPDATE OF total_score, decision ON public.ats_screenings
  FOR EACH ROW 
  WHEN (NEW.decision IN ('shortlisted', 'review') OR NEW.total_score >= 60)
  EXECUTE FUNCTION public.handle_ats_screening_complete();

-- Trigger: Update evaluation and advance to AI interview on assessment completion
CREATE OR REPLACE FUNCTION public.handle_assessment_complete()
RETURNS TRIGGER AS $$
DECLARE
  eval_record public.candidate_evaluations;
BEGIN
  -- Update evaluation record with assessment score
  UPDATE public.candidate_evaluations 
  SET assessment_score = NEW.score, status = 'ai_interview_ready'
  WHERE application_id = NEW.application_id;

  -- Advance application status
  UPDATE public.applications 
  SET status = CASE 
    WHEN NEW.score >= 70 THEN 'ai_interview_pending'
    ELSE 'recruiter_review'
  END
  WHERE id = NEW.application_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_assessment_complete
  AFTER INSERT ON public.assessment_results
  FOR EACH ROW 
  WHEN (NEW.score >= 60)
  EXECUTE FUNCTION public.handle_assessment_complete();

-- Trigger: Finalize evaluation and determine outcome on AI interview completion
CREATE OR REPLACE FUNCTION public.handle_ai_interview_complete()
RETURNS TRIGGER AS $$
BEGIN
  -- Update evaluation record with AI score
  UPDATE public.candidate_evaluations 
  SET ai_interview_score = NEW.score, status = 'completed'
  WHERE application_id = NEW.application_id;

  -- Advance to final review if passing score
  UPDATE public.applications 
  SET status = CASE 
    WHEN NEW.score >= 65 THEN 'recruiter_review'
    ELSE 'rejected'
  END
  WHERE id = NEW.application_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_ai_interview_complete
  AFTER UPDATE OF score, status ON public.ai_interviews
  FOR EACH ROW 
  WHEN (NEW.status = 'completed' AND NEW.score IS NOT NULL)
  EXECUTE FUNCTION public.handle_ai_interview_complete();

-- RPC function to calculate/recalculate final score
CREATE OR REPLACE FUNCTION public.recalculate_candidate_score(p_application_id UUID)
RETURNS public.candidate_evaluations AS $$
  UPDATE public.candidate_evaluations 
  SET final_score = (
    (COALESCE(ats_score, 0) * 0.3) + 
    (COALESCE(assessment_score, 0) * 0.4) + 
    (COALESCE(ai_interview_score, 0) * 0.3)
  )
  WHERE application_id = p_application_id
  RETURNING *;
$$ LANGUAGE sql SECURITY DEFINER;

