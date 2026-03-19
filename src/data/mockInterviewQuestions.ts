// Live Interview Questions - Mock Data
// These questions simulate structured interview questions for different roles

export interface InterviewCategory {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export interface InterviewQuestion {
  id: string;
  category_id: string;
  question_text: string;
  question_type: "behavioral" | "technical" | "situational" | "competency" | "problem_solving";
  difficulty: "easy" | "medium" | "hard";
  sample_answer?: string;
  tips?: string[];
  follow_ups?: string[];
  time_estimate: number; // in minutes
}

export interface MockInterviewTemplate {
  id: string;
  title: string;
  description: string;
  role: string;
  level: "junior" | "mid" | "senior" | "lead";
  duration_minutes: number;
  categories: InterviewCategory[];
  questions: InterviewQuestion[];
}

// Interview Categories
export const interviewCategories: InterviewCategory[] = [
  { id: "cat_technical", name: "Technical Skills", description: "Role-specific technical knowledge", weight: 35 },
  { id: "cat_problem", name: "Problem Solving", description: "Analytical and problem-solving abilities", weight: 25 },
  { id: "cat_communication", name: "Communication", description: "Verbal and written communication", weight: 15 },
  { id: "cat_leadership", name: "Leadership & Culture", description: "Teamwork and cultural fit", weight: 15 },
  { id: "cat_experience", name: "Experience & Projects", description: "Past experience and achievements", weight: 10 },
];

// Software Engineer Interview Questions
export const softwareEngineerQuestions: InterviewQuestion[] = [
  // Technical
  {
    id: "se_t1",
    category_id: "cat_technical",
    question_text: "Explain the difference between REST and GraphQL APIs. When would you choose one over the other?",
    question_type: "technical",
    difficulty: "medium",
    time_estimate: 5,
    sample_answer: "REST uses fixed endpoints and returns all data, while GraphQL uses a single endpoint and clients can request specific fields. Choose REST for simple CRUD operations, GraphQL when clients need flexible data requirements.",
    tips: ["Provide real-world examples", "Discuss trade-offs", "Mention scalability considerations"],
    follow_ups: ["How does caching work differently in each?", "What's the learning curve for GraphQL?"]
  },
  {
    id: "se_t2",
    category_id: "cat_technical",
    question_text: "What is the CAP theorem and how does it affect system design decisions?",
    question_type: "technical",
    difficulty: "hard",
    time_estimate: 8,
    sample_answer: "CAP theorem states that a distributed system can only guarantee 2 of 3: Consistency, Availability, and Partition tolerance. In practice, partition tolerance is mandatory, so we choose between CP (Consistency) or AP (Availability) systems.",
    tips: ["Give examples of CP and AP systems", "Discuss real-world scenarios", "Mention how modern databases handle this"]
  },
  {
    id: "se_t3",
    category_id: "cat_technical",
    question_text: "How would you design a URL shortening service like bit.ly?",
    question_type: "technical",
    difficulty: "hard",
    time_estimate: 15,
    sample_answer: "Use a hash function for short URLs, store mappings in database. Consider collision handling, analytics tracking, custom aliases, and rate limiting.",
    tips: ["Discuss database schema", "Mention caching strategy", "Cover scalability aspects"]
  },
  {
    id: "se_t4",
    category_id: "cat_technical",
    question_text: "Explain the concept of database indexing. What are the trade-offs?",
    question_type: "technical",
    difficulty: "medium",
    time_estimate: 5,
    sample_answer: "Indexes improve read performance but slow down writes and increase storage. Types include B-tree, hash, and composite indexes. Choose columns with high selectivity.",
    tips: ["Discuss different index types", "Mention when NOT to index", "Cover maintenance overhead"]
  },
  {
    id: "se_t5",
    category_id: "cat_technical",
    question_text: "What is the difference between SQL and NoSQL databases? When would you use each?",
    question_type: "technical",
    difficulty: "easy",
    time_estimate: 5,
    sample_answer: "SQL databases are relational with fixed schemas, ACID compliance. NoSQL databases are flexible schema, scalable, better for unstructured data. Use SQL for transactions, NoSQL for high-volume flexible data.",
    tips: ["Give examples of each type", "Discuss scaling differences", "Mention use cases"]
  },
  // Problem Solving
  {
    id: "se_p1",
    category_id: "cat_problem",
    question_text: "You're given a large dataset and need to find the top 100 most frequent items. How would you approach this?",
    question_type: "problem_solving",
    difficulty: "medium",
    time_estimate: 10,
    sample_answer: "Use a HashMap for counting, then a Min-Heap of size 100 to track top items. This gives O(n) time complexity instead of sorting all items.",
    tips: ["Discuss time and space complexity", "Consider streaming data scenarios", "Mention MapReduce approach"]
  },
  {
    id: "se_p2",
    category_id: "cat_problem",
    question_text: "How would you design an elevator system for a 100-story building?",
    question_type: "problem_solving",
    difficulty: "hard",
    time_estimate: 15,
    sample_answer: "Use elevator scheduling algorithms, multiple shafts, express elevators. Consider load balancing, direction-aware requests, and emergency protocols.",
    tips: ["Think about optimization criteria", "Discuss edge cases", "Mention software vs hardware considerations"]
  },
  {
    id: "se_p3",
    category_id: "cat_problem",
    question_text: "Given an array of integers, find the longest consecutive sequence. O(n) required.",
    question_type: "problem_solving",
    difficulty: "medium",
    time_estimate: 10,
    sample_answer: "Use a HashSet for O(1) lookups. For each number, check if it's the start of a sequence, then count consecutive elements. Skip already visited elements.",
    tips: ["Start with brute force", "Optimize step by step", "Explain the HashSet optimization"]
  },
  // Behavioral
  {
    id: "se_b1",
    category_id: "cat_behavioral",
    question_text: "Tell me about a time when you had to debug a particularly difficult bug. How did you approach it?",
    question_type: "behavioral",
    difficulty: "easy",
    time_estimate: 5,
    sample_answer: "Describe the STAR method: Situation (complex bug in production), Task (fix quickly), Action (systematic debugging, logs, isolating), Result (fixed with minimal downtime).",
    tips: ["Be specific about your role", "Show your debugging process", "Emphasize learning"]
  },
  {
    id: "se_b2",
    category_id: "cat_behavioral",
    question_text: "Describe a time when you had to make a technical decision with incomplete information.",
    question_type: "behavioral",
    difficulty: "medium",
    time_estimate: 5,
    sample_answer: "Give example: choosing a tech stack with limited data. Discuss how you gathered requirements, consulted experts, created proofs of concept, and made a calculated risk.",
    tips: ["Show decision-making process", "Mention trade-offs considered", "Reflect on the outcome"]
  },
];

// Product Manager Interview Questions
export const productManagerQuestions: InterviewQuestion[] = [
  // Technical (Basic)
  {
    id: "pm_t1",
    category_id: "cat_technical",
    question_text: "What is the difference between a feature request and a bug fix from a product perspective?",
    question_type: "technical",
    difficulty: "easy",
    time_estimate: 3,
    sample_answer: "Bug fix addresses something broken; feature request adds new capability. Both should be prioritized based on user impact, effort, and strategic value.",
    tips: ["Give examples", "Discuss prioritization frameworks"]
  },
  // Problem Solving
  {
    id: "pm_p1",
    category_id: "cat_problem",
    question_text: "How would you prioritize features for a product with limited resources and competing stakeholder demands?",
    question_type: "problem_solving",
    difficulty: "medium",
    time_estimate: 8,
    sample_answer: "Use RICE framework (Reach, Impact, Confidence, Effort). Align with OKRs. Conduct user research to validate assumptions. Communicate trade-offs clearly to stakeholders.",
    tips: ["Mention specific frameworks", "Discuss stakeholder management", "Show data-driven approach"]
  },
  {
    id: "pm_p2",
    category_id: "cat_problem",
    question_text: "Design a product for the elderly to help them stay connected with family.",
    question_type: "problem_solving",
    difficulty: "medium",
    time_estimate: 10,
    sample_answer: "Start with user research (interviews with elderly). Key needs: simple interface, large text, video calls, health monitoring. Prototype and test with real users.",
    tips: ["Show user-centered design thinking", "Discuss accessibility", "Mention testing with target users"]
  },
  // Behavioral
  {
    id: "pm_b1",
    category_id: "cat_behavioral",
    question_text: "Tell me about a product you love. What would you change about it?",
    question_type: "behavioral",
    difficulty: "easy",
    time_estimate: 5,
    sample_answer: "Choose a product you genuinely use. Discuss specific pain points, propose thoughtful improvements that align with business goals.",
    tips: ["Be specific about issues", "Suggest feasible improvements", "Balance critique with appreciation"]
  },
  {
    id: "pm_b2",
    category_id: "cat_behavioral",
    question_text: "How do you handle disagreements with engineering about feature scope?",
    question_type: "behavioral",
    difficulty: "medium",
    time_estimate: 5,
    sample_answer: "Seek to understand engineering concerns first. Present user data and business impact. Be willing to compromise. Find creative solutions that satisfy both technical and business needs.",
    tips: ["Show collaboration mindset", "Mention specific negotiation techniques", "Emphasize respect for technical constraints"]
  },
];

// Data Analyst Interview Questions
export const dataAnalystQuestions: InterviewQuestion[] = [
  {
    id: "da_t1",
    category_id: "cat_technical",
    question_text: "What is the difference between ROLLUP and CUBE in SQL?",
    question_type: "technical",
    difficulty: "medium",
    time_estimate: 5,
    sample_answer: "ROLLUP creates hierarchical aggregations (e.g., Year > Quarter > Month). CUBE creates all possible combinations of aggregations. CUBE is more comprehensive but computationally expensive.",
    tips: ["Provide examples", "Discuss use cases for each"]
  },
  {
    id: "da_t2",
    category_id: "cat_technical",
    question_text: "How would you detect and handle outliers in a dataset?",
    question_type: "technical",
    difficulty: "medium",
    time_estimate: 8,
    sample_answer: "Detect using statistical methods (Z-score, IQR) or visualization (box plots, scatter plots). Handle by investigating causes, removing errors, or using robust statistical methods.",
    tips: ["Show systematic approach", "Mention different methods", "Discuss business context"]
  },
  {
    id: "da_p1",
    category_id: "cat_problem",
    question_text: "How would you measure the success of a new feature launch?",
    question_type: "problem_solving",
    difficulty: "medium",
    time_estimate: 8,
    sample_answer: "Define success metrics before launch (DAU, engagement, conversion). Use A/B testing. Track adoption rate, user feedback, and business impact. Iterate based on findings.",
    tips: ["Mention specific metrics", "Discuss statistical significance", "Emphasize data-driven decisions"]
  },
  {
    id: "da_b1",
    category_id: "cat_behavioral",
    question_text: "How do you communicate complex data insights to non-technical stakeholders?",
    question_type: "behavioral",
    difficulty: "medium",
    time_estimate: 5,
    sample_answer: "Start with the business question, use simple visualizations, tell a story with data. Avoid jargon, focus on actionable insights, and be prepared for follow-up questions.",
    tips: ["Give examples of simplifications", "Mention visualization best practices", "Show communication skills"]
  },
];

// Designer Interview Questions
export const designerQuestions: InterviewQuestion[] = [
  {
    id: "des_t1",
    category_id: "cat_technical",
    question_text: "What's the difference between UX and UI design? How do they work together?",
    question_type: "technical",
    difficulty: "easy",
    time_estimate: 4,
    sample_answer: "UX is the experience and usability; UI is the visual interface. They're complementary - good UI supports good UX. UX research informs UI decisions.",
    tips: ["Give examples", "Show understanding of both disciplines"]
  },
  {
    id: "des_p1",
    category_id: "cat_problem",
    question_text: "Design a checkout flow for an e-commerce mobile app.",
    question_type: "problem_solving",
    difficulty: "medium",
    time_estimate: 12,
    sample_answer: "Map user journey: Cart → Shipping → Payment → Review → Confirmation. Minimize steps, show progress, support guest checkout, offer multiple payment options, provide clear error handling.",
    tips: ["Sketch while explaining", "Discuss mobile-specific considerations", "Mention security and trust signals"]
  },
  {
    id: "des_b1",
    category_id: "cat_behavioral",
    question_text: "Tell me about a design that failed. What did you learn?",
    question_type: "behavioral",
    difficulty: "easy",
    time_estimate: 5,
    sample_answer: "Choose a real example. Discuss what went wrong (e.g., didn't test with users), what you learned (importance of user research), and how you applied those lessons.",
    tips: ["Be honest about failures", "Show growth mindset", "Emphasize learning orientation"]
  },
  {
    id: "des_b2",
    category_id: "cat_behavioral",
    question_text: "How do you handle conflicting feedback from stakeholders?",
    question_type: "behavioral",
    difficulty: "medium",
    time_estimate: 5,
    sample_answer: "Listen to all perspectives, identify common goals, use data to support decisions. Facilitate discussion, propose compromises, and explain design rationale clearly.",
    tips: ["Show facilitation skills", "Mention specific techniques", "Emphasize diplomacy"]
  },
];

// Mock Interview Templates
export const mockInterviewTemplates: MockInterviewTemplate[] = [
  {
    id: "interview_se_junior",
    title: "Junior Software Engineer Interview",
    description: "Entry-level software engineering position covering fundamentals",
    role: "Software Engineer",
    level: "junior",
    duration_minutes: 60,
    categories: [
      { id: "cat_technical", name: "Technical Skills", description: "Role-specific technical knowledge", weight: 40 },
      { id: "cat_problem", name: "Problem Solving", description: "Analytical and problem-solving abilities", weight: 30 },
      { id: "cat_communication", name: "Communication", description: "Verbal and written communication", weight: 15 },
      { id: "cat_leadership", name: "Leadership & Culture", description: "Teamwork and cultural fit", weight: 15 },
    ],
    questions: softwareEngineerQuestions.filter(q => q.difficulty === "easy" || q.difficulty === "medium"),
  },
  {
    id: "interview_se_senior",
    title: "Senior Software Engineer Interview",
    description: "Senior engineering position with system design focus",
    role: "Software Engineer",
    level: "senior",
    duration_minutes: 90,
    categories: interviewCategories,
    questions: softwareEngineerQuestions,
  },
  {
    id: "interview_pm",
    title: "Product Manager Interview",
    description: "Product management role covering strategy and execution",
    role: "Product Manager",
    level: "mid",
    duration_minutes: 60,
    categories: [
      { id: "cat_technical", name: "Technical Skills", description: "Role-specific technical knowledge", weight: 15 },
      { id: "cat_problem", name: "Problem Solving", description: "Analytical and problem-solving abilities", weight: 35 },
      { id: "cat_communication", name: "Communication", description: "Verbal and written communication", weight: 25 },
      { id: "cat_leadership", name: "Leadership & Culture", description: "Teamwork and cultural fit", weight: 25 },
    ],
    questions: productManagerQuestions,
  },
  {
    id: "interview_da",
    title: "Data Analyst Interview",
    description: "Data analytics position with SQL and visualization focus",
    role: "Data Analyst",
    level: "mid",
    duration_minutes: 45,
    categories: [
      { id: "cat_technical", name: "Technical Skills", description: "Role-specific technical knowledge", weight: 35 },
      { id: "cat_problem", name: "Problem Solving", description: "Analytical and problem-solving abilities", weight: 30 },
      { id: "cat_communication", name: "Communication", description: "Verbal and written communication", weight: 20 },
      { id: "cat_experience", name: "Experience & Projects", description: "Past experience and achievements", weight: 15 },
    ],
    questions: dataAnalystQuestions,
  },
  {
    id: "interview_design",
    title: "UI/UX Designer Interview",
    description: "Design role covering process and portfolio",
    role: "Designer",
    level: "mid",
    duration_minutes: 60,
    categories: [
      { id: "cat_technical", name: "Technical Skills", description: "Role-specific technical knowledge", weight: 20 },
      { id: "cat_problem", name: "Problem Solving", description: "Analytical and problem-solving abilities", weight: 40 },
      { id: "cat_communication", name: "Communication", description: "Verbal and written communication", weight: 20 },
      { id: "cat_leadership", name: "Leadership & Culture", description: "Teamwork and cultural fit", weight: 20 },
    ],
    questions: designerQuestions,
  },
];

// Helper functions
export const getInterviewTemplateById = (id: string): MockInterviewTemplate | undefined => {
  return mockInterviewTemplates.find(t => t.id === id);
};

export const getQuestionsByCategory = (templateId: string, categoryId: string): InterviewQuestion[] => {
  const template = getInterviewTemplateById(templateId);
  return template?.questions.filter(q => q.category_id === categoryId) || [];
};

export const getAllInterviewCategories = (): InterviewCategory[] => interviewCategories;
