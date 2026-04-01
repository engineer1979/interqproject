import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  // Sample candidates
  const candidates = [
    {
      name: 'John Doe',
      position: 'Senior Frontend Developer',
      interviewer: null,
      date: '2025-01-15T10:30:00Z'
    },
    {
      name: 'Jane Smith',
      position: 'DevOps Engineer',
      interviewer: null,
      date: '2025-01-14T14:00:00Z'
    },
    {
      name: 'Mike Johnson',
      position: 'Data Analyst',
      interviewer: null,
      date: '2025-01-13T09:15:00Z'
    }
  ];

  for (const candidateData of candidates) {
    const { data: candidate } = await supabase
      .from('candidates')
      .insert(candidateData)
      .select()
      .single();

    if (candidate) {
      // Random evaluations
      const categories = ['Prior Work Experience', 'Technical Qualifications', 'Teambuilding / Interpersonal Skills', 'Initiative', 'Time Management', 'Customer Service'];
      const evaluations = categories.map(category => ({
        candidate_id: candidate.id,
        category,
        rating: Math.floor(Math.random() * 5) + 1,
        comments: `Sample comment for ${category.toLowerCase()}`
      }));

      await supabase.from('evaluations').insert(evaluations);

      // Final decision
      const avgRating = evaluations.reduce((sum, e) => sum + e.rating, 0) / evaluations.length;
      const recommendation = avgRating >= 4 ? 'Advance' : avgRating >= 3 ? 'Advance with Reservations' : 'Do Not Advance';

      await supabase.from('final_decision').insert({
        candidate_id: candidate.id,
        education: Math.random() > 0.3,
        recommendation,
        overallComments: 'Sample overall impression comment.'
      });

      console.log(`Seeded candidate: ${candidate.name}`);
    }
  }

  console.log('✅ Candidate evaluation seed data created!');
}

seed().catch(console.error);

