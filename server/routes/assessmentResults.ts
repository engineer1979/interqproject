import express from 'express';
import { supabase } from '../lib/supabase'; // Adjust path to your Supabase client

const router = express.Router();

// Get all results for current user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('assessment_results')
      .select(`
        *,
        assessments (
          title,
          domain,
          category,
          difficulty
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (error: any) {
    console.error('Assessment results error:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Get detailed results for a specific assessment
router.get('/:assessmentId/results', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Assessment results not found' });
    }

    res.json(data[0]);
  } catch (error: any) {
    console.error('Detailed assessment results error:', error);
    res.status(500).json({ error: 'Failed to fetch detailed results' });
  }
});

export default router;

