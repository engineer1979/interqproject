import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Role verification middleware
const verifyRoleAndApproval = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, is_approved')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  if (!profile.is_approved) {
    return res.status(403).json({ error: 'Account pending admin approval' });
  }

  // Attach user to req
  req.user = { id: user.id, email: user.email, role: profile.role };
  next();
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Protected recruitment data endpoint
app.get('/api/candidates', verifyRoleAndApproval, async (req, res) => {
  const { role } = req.user;
  
  let query = supabase
    .from('candidates')
    .select('*');

  if (role === 'recruiter') {
    // Recruiters see only their assigned candidates
    query = query.eq('recruiter_id', req.user.id);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Admin approve endpoint
app.post('/api/admin/approve-user', verifyRoleAndApproval, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }

  const { user_id } = req.body;

  const { error } = await supabase
    .from('profiles')
    .update({ is_approved: true })
    .eq('id', user_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Recruitment Auth Server running at http://localhost:${port}`);
});

