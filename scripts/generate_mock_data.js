import fs from 'fs';
import path from 'path';

function generate() {
  const dir = './data/assessments';
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

  let mockAssessments = [];
  let allQuestions = [];

  let assessmentCounter = 1;

  for (const file of files) {
    const rawData = fs.readFileSync(path.join(dir, file), 'utf-8');
    const questions = JSON.parse(rawData);

    // Create 5 variations
    for (let variant = 1; variant <= 5; variant++) {
      let titlePrefix = file.replace('.json', '').replace(/-01/, '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      let title = `${titlePrefix} Assessment`;
      if (variant === 2) title = `Advanced ${titlePrefix} Assessment`;
      if (variant === 3) title = `${titlePrefix} Foundation Certification`;
      if (variant === 4) title = `Senior ${titlePrefix} Test`;
      if (variant === 5) title = `${titlePrefix} Practitioner Exam`;

      const domain = titlePrefix.split(' ')[0];
      const difficulty = variant > 3 ? 'hard' : (variant > 1 ? 'medium' : 'easy');
      const assessId = `mock_assess_${assessmentCounter}`;

      mockAssessments.push({
        id: assessId,
        title,
        description: `Comprehensive evaluation covering ${titlePrefix} methodologies and practical implementation details. Designed for professionals seeking validation of their skills.`,
        category: domain,
        difficulty,
        duration_minutes: 60,
        questions_count: questions.length,
        passing_score: 70,
        is_published: true
      });

      questions.forEach((q, idx) => {
        allQuestions.push({
          id: `q_${assessId}_${idx}`,
          assessment_id: assessId,
          question_text: q.question,
          question_type: 'multiple_choice',
          options: q.options,
          points: q.difficulty === 'Hard' ? 3 : (q.difficulty === 'Medium' ? 2 : 1),
          correct_answer: q.answer,
          difficulty: q.difficulty.toLowerCase() || 'easy',
          category: domain
        });
      });

      assessmentCounter++;
    }
  }

  const outputContent = `// Automatically generated mock data containing ${mockAssessments.length} assessments

export const mockAssessments = ${JSON.stringify(mockAssessments, null, 2)};

export const allMockQuestions = ${JSON.stringify(allQuestions, null, 2)};

export const getQuestionsByAssessment = (assessmentId) => {
  return allMockQuestions.filter(q => q.assessment_id === assessmentId);
};

export const getQuestionCountByAssessment = (assessmentId) => {
  return allMockQuestions.filter(q => q.assessment_id === assessmentId).length;
};
`;

  fs.writeFileSync('./src/data/mockQuestions.ts', outputContent);
  console.log(`Generated mockQuestions.ts with ${mockAssessments.length} assessments!`);
}

generate();
