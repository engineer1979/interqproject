// Assessment Questions - Mock Data
// This data simulates questions from Supabase database

export interface MockCodeOptions {
  starterCode?: string;
  testCases?: Array<{ input: string; expected: string }>;
}

export interface MockQuestion {
  id: string;
  assessment_id: string;
  question_text: string;
  question_type: "multiple_choice" | "true_false" | "short_answer" | "code" | "video";
  options: string[] | MockCodeOptions;
  points: number;
  correct_answer?: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

export interface MockAssessment {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration_minutes: number;
  questions_count: number;
  passing_score: number;
  is_published: boolean;
}

// Mock Assessments with Questions
export const mockAssessments: MockAssessment[] = [
  {
    id: "assess_frontend",
    title: "Frontend Developer Assessment",
    description: "Comprehensive test covering React, JavaScript, CSS, and modern web development",
    category: "Engineering",
    difficulty: "medium",
    duration_minutes: 60,
    questions_count: 25,
    passing_score: 70,
    is_published: true,
  },
  {
    id: "assess_backend",
    title: "Backend Developer Assessment",
    description: "Test your knowledge in Node.js, databases, APIs, and server architecture",
    category: "Engineering",
    difficulty: "hard",
    duration_minutes: 90,
    questions_count: 30,
    passing_score: 75,
    is_published: true,
  },
  {
    id: "assess_product",
    title: "Product Manager Assessment",
    description: "Evaluate product strategy, user research, and analytical skills",
    category: "Product",
    difficulty: "medium",
    duration_minutes: 45,
    questions_count: 20,
    passing_score: 65,
    is_published: true,
  },
  {
    id: "assess_data",
    title: "Data Science Assessment",
    description: "Python, statistics, machine learning, and data analysis",
    category: "Data Science",
    difficulty: "hard",
    duration_minutes: 75,
    questions_count: 25,
    passing_score: 70,
    is_published: true,
  },
  {
    id: "assess_design",
    title: "UI/UX Designer Assessment",
    description: "Design principles, Figma, user research, and prototyping",
    category: "Design",
    difficulty: "easy",
    duration_minutes: 40,
    questions_count: 18,
    passing_score: 60,
    is_published: true,
  },
];

// Frontend Developer Questions
export const frontendQuestions: MockQuestion[] = [
  // Multiple Choice - JavaScript Basics
  {
    id: "fe_q1",
    assessment_id: "assess_frontend",
    question_text: "What is the output of: console.log(typeof null)?",
    question_type: "multiple_choice",
    options: ["null", "undefined", "object", "Error"],
    points: 2,
    correct_answer: "object",
    difficulty: "easy",
    category: "JavaScript",
  },
  {
    id: "fe_q2",
    assessment_id: "assess_frontend",
    question_text: "Which keyword is used to declare a constant variable in JavaScript?",
    question_type: "multiple_choice",
    options: ["var", "let", "const", "constant"],
    points: 2,
    correct_answer: "const",
    difficulty: "easy",
    category: "JavaScript",
  },
  {
    id: "fe_q3",
    assessment_id: "assess_frontend",
    question_text: "What does the '===' operator do in JavaScript?",
    question_type: "multiple_choice",
    options: [
      "Assigns a value",
      "Compares value only",
      "Compares value and type",
      "Checks if equal to 3"
    ],
    points: 2,
    correct_answer: "Compares value and type",
    difficulty: "easy",
    category: "JavaScript",
  },
  {
    id: "fe_q4",
    assessment_id: "assess_frontend",
    question_text: "What is a Promise in JavaScript?",
    question_type: "multiple_choice",
    options: [
      "A guaranteed value",
      "An object representing eventual completion/failure of async operation",
      "A function that returns immediately",
      "A type of loop"
    ],
    points: 3,
    correct_answer: "An object representing eventual completion/failure of async operation",
    difficulty: "medium",
    category: "JavaScript",
  },
  {
    id: "fe_q5",
    assessment_id: "assess_frontend",
    question_text: "What is the purpose of React's useEffect hook?",
    question_type: "multiple_choice",
    options: [
      "To create state variables",
      "To handle side effects in functional components",
      "To optimize rendering performance",
      "To define component structure"
    ],
    points: 3,
    correct_answer: "To handle side effects in functional components",
    difficulty: "medium",
    category: "React",
  },
  // True/False
  {
    id: "fe_q6",
    assessment_id: "assess_frontend",
    question_text: "JavaScript is a single-threaded language.",
    question_type: "true_false",
    options: ["True", "False"],
    points: 2,
    correct_answer: "True",
    difficulty: "easy",
    category: "JavaScript",
  },
  {
    id: "fe_q7",
    assessment_id: "assess_frontend",
    question_text: "CSS Grid can only be used for two-dimensional layouts.",
    question_type: "true_false",
    options: ["True", "False"],
    points: 2,
    correct_answer: "False",
    difficulty: "medium",
    category: "CSS",
  },
  // Short Answer
  {
    id: "fe_q8",
    assessment_id: "assess_frontend",
    question_text: "Explain the difference between 'var', 'let', and 'const' in JavaScript.",
    question_type: "short_answer",
    options: [],
    points: 5,
    difficulty: "medium",
    category: "JavaScript",
  },
  {
    id: "fe_q9",
    assessment_id: "assess_frontend",
    question_text: "What is the Virtual DOM in React and why is it beneficial?",
    question_type: "short_answer",
    options: [],
    points: 5,
    difficulty: "medium",
    category: "React",
  },
  // Code Challenge
  {
    id: "fe_q10",
    assessment_id: "assess_frontend",
    question_text: "Write a function that reverses a string without using the built-in reverse() method.",
    question_type: "code",
    options: {
      starterCode: `function reverseString(str) {
  // Your code here
  
}

// Test: reverseString("hello") should return "olleh"`,
      testCases: [
        { input: "hello", expected: "olleh" },
        { input: "world", expected: "dlrow" },
        { input: "a", expected: "a" }
      ]
    },
    points: 10,
    difficulty: "medium",
    category: "JavaScript",
  },
  {
    id: "fe_q11",
    assessment_id: "assess_frontend",
    question_text: "Write a React component that displays a counter with increment and decrement buttons.",
    question_type: "code",
    options: {
      starterCode: `import React, { useState } from 'react';

function Counter() {
  // Your code here
  
  return (
    <div>
      {/* Your JSX here */}
    </div>
  );
}`,
      testCases: []
    },
    points: 15,
    difficulty: "medium",
    category: "React",
  },
  // More MCQs
  {
    id: "fe_q12",
    assessment_id: "assess_frontend",
    question_text: "Which CSS property is used to create a flexbox container?",
    question_type: "multiple_choice",
    options: ["flex-container", "display: flex", "flexbox", "flex: 1"],
    points: 2,
    correct_answer: "display: flex",
    difficulty: "easy",
    category: "CSS",
  },
  {
    id: "fe_q13",
    assessment_id: "assess_frontend",
    question_text: "What is the purpose of the useState hook in React?",
    question_type: "multiple_choice",
    options: [
      "To fetch data from an API",
      "To manage component state",
      "To create reusable components",
      "To handle routing"
    ],
    points: 3,
    correct_answer: "To manage component state",
    difficulty: "easy",
    category: "React",
  },
  {
    id: "fe_q14",
    assessment_id: "assess_frontend",
    question_text: "What is the output of: Array.isArray([])?",
    question_type: "multiple_choice",
    options: ["false", "undefined", "true", "Error"],
    points: 2,
    correct_answer: "true",
    difficulty: "easy",
    category: "JavaScript",
  },
  {
    id: "fe_q15",
    assessment_id: "assess_frontend",
    question_text: "Which HTTP method is typically used to update a resource?",
    question_type: "multiple_choice",
    options: ["GET", "POST", "PUT", "DELETE"],
    points: 2,
    correct_answer: "PUT",
    difficulty: "easy",
    category: "APIs",
  },
];

// Backend Developer Questions
export const backendQuestions: MockQuestion[] = [
  {
    id: "be_q1",
    assessment_id: "assess_backend",
    question_text: "What is Node.js primarily built on?",
    question_type: "multiple_choice",
    options: ["Python", "Chrome V8 JavaScript Engine", "JVM", ".NET Framework"],
    points: 2,
    correct_answer: "Chrome V8 JavaScript Engine",
    difficulty: "easy",
    category: "Node.js",
  },
  {
    id: "be_q2",
    assessment_id: "assess_backend",
    question_text: "Which SQL command is used to retrieve data from a database?",
    question_type: "multiple_choice",
    options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
    points: 2,
    correct_answer: "SELECT",
    difficulty: "easy",
    category: "SQL",
  },
  {
    id: "be_q3",
    assessment_id: "assess_backend",
    question_text: "What is the purpose of middleware in Express.js?",
    question_type: "multiple_choice",
    options: [
      "To connect to databases",
      "To process requests before they reach route handlers",
      "To create frontend components",
      "To manage state"
    ],
    points: 3,
    correct_answer: "To process requests before they reach route handlers",
    difficulty: "medium",
    category: "Express.js",
  },
  {
    id: "be_q4",
    assessment_id: "assess_backend",
    question_text: "What is REST?",
    question_type: "multiple_choice",
    options: [
      "A programming language",
      "An architectural style for web services",
      "A database",
      "A testing framework"
    ],
    points: 3,
    correct_answer: "An architectural style for web services",
    difficulty: "medium",
    category: "APIs",
  },
  {
    id: "be_q5",
    assessment_id: "assess_backend",
    question_text: "What is database normalization?",
    question_type: "short_answer",
    options: [],
    points: 5,
    difficulty: "medium",
    category: "Database",
  },
  {
    id: "be_q6",
    assessment_id: "assess_backend",
    question_text: "Write a Node.js function that reads a file asynchronously and returns its contents.",
    question_type: "code",
    options: {
      starterCode: `const fs = require('fs');

async function readFile(filePath) {
  // Your code here
  
}

// Test: await readFile('test.txt')`,
      testCases: []
    },
    points: 10,
    difficulty: "medium",
    category: "Node.js",
  },
  {
    id: "be_q7",
    assessment_id: "assess_backend",
    question_text: "What is the difference between SQL and NoSQL databases?",
    question_type: "short_answer",
    options: [],
    points: 5,
    difficulty: "medium",
    category: "Database",
  },
  {
    id: "be_q8",
    assessment_id: "assess_backend",
    question_text: "JWT stands for:",
    question_type: "multiple_choice",
    options: [
      "JavaScript Web Token",
      "JSON Web Token",
      "Java Web Token",
      "JavaScript Web Transfer"
    ],
    points: 2,
    correct_answer: "JSON Web Token",
    difficulty: "easy",
    category: "Security",
  },
  {
    id: "be_q9",
    assessment_id: "assess_backend",
    question_text: "What is containerization?",
    question_type: "multiple_choice",
    options: [
      "A CSS technique",
      "Packaging an application with its dependencies",
      "A database concept",
      "A testing method"
    ],
    points: 3,
    correct_answer: "Packaging an application with its dependencies",
    difficulty: "medium",
    category: "DevOps",
  },
  {
    id: "be_q10",
    assessment_id: "assess_backend",
    question_text: "Explain the concept of microservices architecture.",
    question_type: "short_answer",
    options: [],
    points: 5,
    difficulty: "hard",
    category: "Architecture",
  },
];

// Product Manager Questions
export const productQuestions: MockQuestion[] = [
  {
    id: "pm_q1",
    assessment_id: "assess_product",
    question_text: "What is the primary purpose of a Product Requirements Document (PRD)?",
    question_type: "multiple_choice",
    options: [
      "To track employee performance",
      "To define features, goals, and timeline of a product",
      "To manage finances",
      "To create marketing materials"
    ],
    points: 3,
    correct_answer: "To define features, goals, and timeline of a product",
    difficulty: "easy",
    category: "Product Strategy",
  },
  {
    id: "pm_q2",
    assessment_id: "assess_product",
    question_text: "What does MVP stand for in product development?",
    question_type: "multiple_choice",
    options: [
      "Most Valuable Player",
      "Minimum Viable Product",
      "Maximum Value Proposition",
      "Managed Value Process"
    ],
    points: 2,
    correct_answer: "Minimum Viable Product",
    difficulty: "easy",
    category: "Product Strategy",
  },
  {
    id: "pm_q3",
    assessment_id: "assess_product",
    question_text: "What is user personas?",
    question_type: "multiple_choice",
    options: [
      "Real users of the product",
      "Fictional characters representing user types",
      "User login credentials",
      "User interface designs"
    ],
    points: 2,
    correct_answer: "Fictional characters representing user types",
    difficulty: "easy",
    category: "User Research",
  },
  {
    id: "pm_q4",
    assessment_id: "assess_product",
    question_text: "Describe your approach to prioritizing features for a new product.",
    question_type: "short_answer",
    options: [],
    points: 10,
    difficulty: "medium",
    category: "Product Strategy",
  },
  {
    id: "pm_q5",
    assessment_id: "assess_product",
    question_text: "What metrics would you track to measure the success of a mobile app?",
    question_type: "short_answer",
    options: [],
    points: 8,
    difficulty: "medium",
    category: "Analytics",
  },
  {
    id: "pm_q6",
    assessment_id: "assess_product",
    question_text: "What is A/B testing?",
    question_type: "multiple_choice",
    options: [
      "Testing with only A and B students",
      "Comparing two versions to determine which performs better",
      "A type of exam",
      "Security testing"
    ],
    points: 2,
    correct_answer: "Comparing two versions to determine which performs better",
    difficulty: "easy",
    category: "Analytics",
  },
  {
    id: "pm_q7",
    assessment_id: "assess_product",
    question_text: "How do you handle conflicting stakeholder requirements?",
    question_type: "short_answer",
    options: [],
    points: 8,
    difficulty: "hard",
    category: "Stakeholder Management",
  },
];

// Data Science Questions
export const dataScienceQuestions: MockQuestion[] = [
  {
    id: "ds_q1",
    assessment_id: "assess_data",
    question_text: "What is the difference between supervised and unsupervised learning?",
    question_type: "short_answer",
    options: [],
    points: 5,
    difficulty: "medium",
    category: "Machine Learning",
  },
  {
    id: "ds_q2",
    assessment_id: "assess_data",
    question_text: "Which Python library is commonly used for data manipulation?",
    question_type: "multiple_choice",
    options: ["React", "Pandas", "Express", "Angular"],
    points: 2,
    correct_answer: "Pandas",
    difficulty: "easy",
    category: "Python",
  },
  {
    id: "ds_q3",
    assessment_id: "assess_data",
    question_text: "What does SQL stand for?",
    question_type: "multiple_choice",
    options: [
      "Simple Query Language",
      "Structured Query Language",
      "Standard Question Language",
      "System Query Logic"
    ],
    points: 2,
    correct_answer: "Structured Query Language",
    difficulty: "easy",
    category: "SQL",
  },
  {
    id: "ds_q4",
    assessment_id: "assess_data",
    question_text: "What is overfitting in machine learning?",
    question_type: "multiple_choice",
    options: [
      "When a model is too simple",
      "When a model performs poorly",
      "When a model is too complex and performs poorly on new data",
      "When data is too large"
    ],
    points: 3,
    correct_answer: "When a model is too complex and performs poorly on new data",
    difficulty: "medium",
    category: "Machine Learning",
  },
  {
    id: "ds_q5",
    assessment_id: "assess_data",
    question_text: "Write Python code to calculate the mean of a list of numbers.",
    question_type: "code",
    options: {
      starterCode: `def calculate_mean(numbers):
  # Your code here
  
# Test: calculate_mean([1, 2, 3, 4, 5]) should return 3.0`,
      testCases: []
    },
    points: 8,
    difficulty: "easy",
    category: "Python",
  },
  {
    id: "ds_q6",
    assessment_id: "assess_data",
    question_text: "What is the purpose of data normalization?",
    question_type: "short_answer",
    options: [],
    points: 5,
    difficulty: "medium",
    category: "Data Preprocessing",
  },
  {
    id: "ds_q7",
    assessment_id: "assess_data",
    question_text: "Which type of chart is best for showing trends over time?",
    question_type: "multiple_choice",
    options: ["Pie Chart", "Bar Chart", "Line Chart", "Scatter Plot"],
    points: 2,
    correct_answer: "Line Chart",
    difficulty: "easy",
    category: "Data Visualization",
  },
];

// Design Questions
export const designQuestions: MockQuestion[] = [
  {
    id: "des_q1",
    assessment_id: "assess_design",
    question_text: "What is the primary goal of user experience (UX) design?",
    question_type: "multiple_choice",
    options: [
      "Make products look beautiful",
      "Create enjoyable and effective user experiences",
      "Reduce development costs",
      "Increase sales"
    ],
    points: 3,
    correct_answer: "Create enjoyable and effective user experiences",
    difficulty: "easy",
    category: "UX Design",
  },
  {
    id: "des_q2",
    assessment_id: "assess_design",
    question_text: "What is a wireframe?",
    question_type: "multiple_choice",
    options: [
      "A finished design",
      "A basic visual guide showing page structure",
      "A type of font",
      "A coding framework"
    ],
    points: 2,
    correct_answer: "A basic visual guide showing page structure",
    difficulty: "easy",
    category: "UI Design",
  },
  {
    id: "des_q3",
    assessment_id: "assess_design",
    question_text: "What does Figma primarily help designers do?",
    question_type: "multiple_choice",
    options: [
      "Write code",
      "Create and collaborate on designs",
      "Manage databases",
      "Send emails"
    ],
    points: 2,
    correct_answer: "Create and collaborate on designs",
    difficulty: "easy",
    category: "Tools",
  },
  {
    id: "des_q4",
    assessment_id: "assess_design",
    question_text: "What is a design system?",
    question_type: "short_answer",
    options: [],
    points: 5,
    difficulty: "medium",
    category: "Design Strategy",
  },
  {
    id: "des_q5",
    assessment_id: "assess_design",
    question_text: "What is accessibility in web design?",
    question_type: "multiple_choice",
    options: [
      "How fast a website loads",
      "Designing for users with disabilities",
      "Mobile responsiveness",
      "Search engine optimization"
    ],
    points: 3,
    correct_answer: "Designing for users with disabilities",
    difficulty: "medium",
    category: "Web Design",
  },
  {
    id: "des_q6",
    assessment_id: "assess_design",
    question_text: "What are the key principles of visual hierarchy?",
    question_type: "short_answer",
    options: [],
    points: 5,
    difficulty: "medium",
    category: "Visual Design",
  },
];

// All questions combined
export const allMockQuestions: MockQuestion[] = [
  ...frontendQuestions,
  ...backendQuestions,
  ...productQuestions,
  ...dataScienceQuestions,
  ...designQuestions,
];

// Helper function to get questions by assessment
export const getQuestionsByAssessment = (assessmentId: string): MockQuestion[] => {
  return allMockQuestions.filter(q => q.assessment_id === assessmentId);
};

// Helper function to get question count by assessment
export const getQuestionCountByAssessment = (assessmentId: string): number => {
  return allMockQuestions.filter(q => q.assessment_id === assessmentId).length;
};
