import { AssessmentQuestion } from "./assessments";

// Sample questions for different assessments - each assessment will have 60 questions
export const assessmentQuestions: AssessmentQuestion[] = [
  // Python Easy Questions (assessment python_easy_1)
  ...Array.from({ length: 60 }, (_, i) => ({
    id: `python_easy_1_q${i + 1}`,
    assessment_id: "python_easy_1",
    question: `What is the output of print(${2 ** i % 10}) in Python?`,
    option_a: `${2 ** i % 10}`,
    option_b: `${(2 ** i % 10) + 1}`,
    option_c: `${(2 ** i % 10) - 1}`,
    option_d: "Error",
    correct_answer: "A",
    difficulty: "easy"
  })),

  // Python Medium Questions (assessment python_medium_1)
  ...Array.from({ length: 60 }, (_, i) => ({
    id: `python_medium_1_q${i + 1}`,
    assessment_id: "python_medium_1",
    question: `What does the following Python code do?\n\ndef func(${['x', 'y', 'z'][i % 3]}):\n    return ${['x * 2', 'y + 1', 'z ** 2'][i % 3]}`,
    option_a: "Multiplies by 2",
    option_b: "Adds 1",
    option_c: "Squares the number",
    option_d: "Returns the input",
    correct_answer: ["A", "B", "C"][i % 3],
    difficulty: "medium"
  })),

  // AWS Easy Questions (assessment aws_easy_1)
  ...Array.from({ length: 60 }, (_, i) => ({
    id: `aws_easy_1_q${i + 1}`,
    assessment_id: "aws_easy_1",
    question: `Which AWS service is primarily used for ${['file storage', 'compute instances', 'database hosting', 'content delivery'][i % 4]}?`,
    option_a: "S3",
    option_b: "EC2",
    option_c: "RDS",
    option_d: "CloudFront",
    correct_answer: ["A", "B", "C", "D"][i % 4],
    difficulty: "easy"
  })),

  // SQL Easy Questions (assessment sql_easy_1)
  ...Array.from({ length: 60 }, (_, i) => ({
    id: `sql_easy_1_q${i + 1}`,
    assessment_id: "sql_easy_1",
    question: `Which SQL command is used to ${['retrieve data', 'insert data', 'update data', 'delete data'][i % 4]} from a table?`,
    option_a: "SELECT",
    option_b: "INSERT",
    option_c: "UPDATE",
    option_d: "DELETE",
    correct_answer: ["A", "B", "C", "D"][i % 4],
    difficulty: "easy"
  })),

  // JavaScript Easy Questions (assessment js_easy_1)
  ...Array.from({ length: 60 }, (_, i) => ({
    id: `js_easy_1_q${i + 1}`,
    assessment_id: "js_easy_1",
    question: `What does the following JavaScript code output?\n\nconsole.log(typeof ${['42', '"hello"', 'true', 'null'][i % 4]});`,
    option_a: "number",
    option_b: "string",
    option_c: "boolean",
    option_d: "object",
    correct_answer: ["A", "B", "C", "D"][i % 4],
    difficulty: "easy"
  })),

  // Linux Easy Questions (assessment linux_easy_1)
  ...Array.from({ length: 60 }, (_, i) => ({
    id: `linux_easy_1_q${i + 1}`,
    assessment_id: "linux_easy_1",
    question: `Which Linux command is used to ${['list files', 'change directory', 'show current directory', 'create directory'][i % 4]}?`,
    option_a: "ls",
    option_b: "cd",
    option_c: "pwd",
    option_d: "mkdir",
    correct_answer: ["A", "B", "C", "D"][i % 4],
    difficulty: "easy"
  })),

  // Docker Easy Questions (assessment docker_easy_1)
  ...Array.from({ length: 60 }, (_, i) => ({
    id: `docker_easy_1_q${i + 1}`,
    assessment_id: "docker_easy_1",
    question: `Which Docker command is used to ${['run a container', 'build an image', 'list containers', 'pull an image'][i % 4]}?`,
    option_a: "docker run",
    option_b: "docker build",
    option_c: "docker ps",
    option_d: "docker pull",
    correct_answer: ["A", "B", "C", "D"][i % 4],
    difficulty: "easy"
  })),

  // React Easy Questions (assessment react_easy_1)
  ...Array.from({ length: 60 }, (_, i) => ({
    id: `react_easy_1_q${i + 1}`,
    assessment_id: "react_easy_1",
    question: `In React, what is ${['JSX', 'props', 'state', 'components'][i % 4]}?`,
    option_a: "JavaScript XML syntax",
    option_b: "Properties passed to components",
    option_c: "Component internal data",
    option_d: "Reusable UI building blocks",
    correct_answer: ["A", "B", "C", "D"][i % 4],
    difficulty: "easy"
  })),

  // DevOps Easy Questions (assessment devops_easy_1)
  ...Array.from({ length: 60 }, (_, i) => ({
    id: `devops_easy_1_q${i + 1}`,
    assessment_id: "devops_easy_1",
    question: `What does ${['CI', 'CD', 'IaC', 'SCM'][i % 4]} stand for in DevOps?`,
    option_a: "Continuous Integration",
    option_b: "Continuous Deployment",
    option_c: "Infrastructure as Code",
    option_d: "Source Code Management",
    correct_answer: ["A", "B", "C", "D"][i % 4],
    difficulty: "easy"
  })),

  // Security Easy Questions (assessment security_easy_1)
  ...Array.from({ length: 60 }, (_, i) => ({
    id: `security_easy_1_q${i + 1}`,
    assessment_id: "security_easy_1",
    question: `What type of attack involves ${['sending unsolicited emails', 'flooding a network', 'stealing session data', 'encrypting files'][i % 4]}?`,
    option_a: "Spam/Phishing",
    option_b: "DDoS",
    option_c: "Session Hijacking",
    option_d: "Ransomware",
    correct_answer: ["A", "B", "C", "D"][i % 4],
    difficulty: "easy"
  })),

  // Medium difficulty questions for various assessments
  ...Array.from({ length: 60 }, (_, i) => ({
    id: `python_medium_2_q${i + 1}`,
    assessment_id: "python_medium_2",
    question: `In Python, what is the correct way to define a function that ${['returns a list', 'takes variable arguments', 'has default parameters', 'is a generator'][i % 4]}?`,
    option_a: "def func(): return []",
    option_b: "def func(*args): pass",
    option_c: "def func(x=5): pass",
    option_d: "def func(): yield x",
    correct_answer: ["A", "B", "C", "D"][i % 4],
    difficulty: "medium"
  })),

  // Hard difficulty questions
  ...Array.from({ length: 60 }, (_, i) => ({
    id: `python_hard_1_q${i + 1}`,
    assessment_id: "python_hard_1",
    question: `Advanced Python: What does the following decorator do?\n\n@wraps(func)\ndef wrapper(*args, **kwargs):\n    ${['log execution time', 'cache results', 'validate input', 'handle exceptions'][i % 4]}`,
    option_a: "Logs execution time",
    option_b: "Caches function results",
    option_c: "Validates input parameters",
    option_d: "Handles exceptions gracefully",
    correct_answer: ["A", "B", "C", "D"][i % 4],
    difficulty: "hard"
  })),
];

export const getQuestionsForAssessment = (assessmentId: string): AssessmentQuestion[] => {
  return assessmentQuestions.filter(q => q.assessment_id === assessmentId);
};