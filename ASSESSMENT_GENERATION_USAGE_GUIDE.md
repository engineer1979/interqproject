# Assessment Generation Tools - Complete Usage Guide

**Version**: 1.0  
**Last Updated**: April 3, 2026  
**Platform**: InterQ Recruitment Platform

---

## 📚 Overview

InterQ provides two powerful tools for generating comprehensive 180-question assessments:

1. **Master Guide** - Detailed markdown framework with standards, templates, and best practices
2. **Interactive Prompt Generator** - Web-based tool to create custom AI prompts instantly

---

## 🎯 Quick Start

### Option 1: Using the Interactive Prompt Generator (Recommended)

**Fastest way to generate assessments:**

```
1. Go to: http://localhost:8080/admin/prompt-generator
2. Fill out the form (assessment name, type, audience)
3. Configure content areas and learning objectives
4. Click "Generate Master Prompt"
5. Copy the prompt to clipboard
6. Paste into Claude or ChatGPT
7. Receive complete 180-question assessment!
```

### Option 2: Using the Master Guide

**For more control and customization:**

```
1. Read: ASSESSMENT_GENERATION_MASTER_GUIDE.md
2. Review structural requirements (180 question framework)
3. Choose your assessment type from 14 available
4. Customize the Master Prompt Template
5. Send to AI assistant for generation
6. Quality assurance check using provided checklists
```

---

## 🚀 Step-by-Step: Interactive Prompt Generator

### Step 1: Access the Tool

Open your browser and navigate to:
```
http://localhost:8080/admin/prompt-generator
```

### Step 2: Fill in Assessment Details

**Required Fields:**
- **Assessment Name**: e.g., "AWS Solutions Architect Professional"
- **Assessment Type**: Select from 14 options
- **Target Audience**: e.g., "Cloud architects, 3+ years experience"
- **Passing Score**: Usually 70% (adjustable 0-100%)
- **Duration**: Total minutes for assessment (default: 270 min)

### Step 3: Configure Question Types

Select which question formats to include:
- ✅ **Multiple Choice** (40 questions, 60%)
- ✅ **Multiple Select** (10 questions, 15%)
- ✅ **Short Answer** (10 questions, 15%)
- ✅ **Matching/Ordering** (10 questions, 10%)

Toggle each type on/off as needed.

### Step 4: Define Content Focus Areas

Add topics and their emphasis:

**Example for "Networking Fundamentals":**
```
Topic: "OSI Model & Concepts"           → 15%  (~27 questions)
Topic: "IP Addressing & Subnetting"     → 20%  (~36 questions)
Topic: "Routing & Switching"            → 15%  (~27 questions)
Topic: "Security & Firewalls"           → 20%  (~36 questions)
Topic: "Protocols (TCP, UDP, DNS)"      → 20%  (~36 questions)
Topic: "Advanced Scenarios"             → 10%  (~18 questions)
```

**How to add:**
1. Enter topic name in field
2. Enter percentage (0-100)
3. Click "Add" button
4. Repeat for all topics

### Step 5: Set Learning Objectives

Define what each difficulty level should assess:

**Easy Questions (Q1-Q60):**
- Default: "Understand core concepts and definitions"
- Example custom: "Recall AWS service names and their primary purposes"

**Medium Questions (Q61-Q120):**
- Default: "Apply knowledge in practical scenarios"
- Example custom: "Evaluate when to use EC2 vs Lambda vs RDS"

**Hard Questions (Q121-Q180):**
- Default: "Analyze complex situations and design solutions"
- Example custom: "Design highly available, cost-optimized architectures"

**How to add:**
1. Select difficulty level (Easy/Medium/Hard)
2. Enter learning objective (1-2 sentences)
3. Click "Add Objective"
4. Repeat or edit as needed

### Step 6: Generate the Master Prompt

1. Review all settings
2. Click **"Generate Master Prompt"** button
3. Wait for generation (instant, <1 second)
4. Preview appears in right panel

### Step 7: Copy or Download

**Option A: Copy to Clipboard**
```
Click "Copy" button
→ Paste into Claude/ChatGPT directly
```

**Option B: Download File**
```
Click "Download" button
→ Saves as: AssessmentName_master_prompt.txt
→ Use later or share with colleagues
```

---

## 📝 Using the Master Prompt with AI

### Claude (Recommended)

```
1. Open https://claude.ai
2. Start new conversation
3. Paste the master prompt
4. Wait for response (may take 2-3 minutes for 180 questions)
5. Request format adjustments as needed:
   - "Add difficulty justifications to hard questions"
   - "Make explanations more concise"
   - "Add common misconceptions section"
```

### ChatGPT

```
1. Open https://chatgpt.com
2. Start new chat (GPT-4 recommended)
3. Paste the master prompt
4. Send message
5. Response will include all 180 questions
```

### Alternative: Gemini, Llama, etc.

The master prompt is generic enough to work with any LLM that supports long-form generation.

---

## 📊 Assessment Type Examples

### Example 1: AWS Solutions Architect

**Form Settings:**
```
Assessment Name: AWS Solutions Architect Professional
Assessment Type: AWS Solutions Architect
Target Audience: Cloud architects with AWS experience
Duration: 270 minutes
Passing Score: 75%

Content Areas:
- Architecture Design (25%)
- High Availability & Scalability (20%)
- Security & Compliance (20%)
- Cost Optimization (15%)
- Migration & Hybrid (10%)
- Disaster Recovery (10%)

Question Types:
✓ Multiple Choice (60%)
✓ Multiple Select (15%)
✓ Short Answer (15%)
✓ Matching (10%)
```

**Generated Prompt Preview:**
```
# Assessment Generation Master Prompt

Assessment Name: AWS Solutions Architect Professional
Assessment Type: AWS Solutions Architect
...
Content Focus Areas:
- Architecture Design: 25% (~45 questions)
- High Availability: 20% (~36 questions)
...
```

---

### Example 2: CCNA Networking

**Form Settings:**
```
Assessment Name: CCNA Routing and Switching
Assessment Type: Networking Fundamentals
Target Audience: Network engineers, 2+ years experience
Duration: 240 minutes
Passing Score: 70%

Content Areas:
- OSI & TCP/IP Models (20%)
- IP Addressing & Subnetting (25%)
- Routing Protocols (20%)
- Switching & VLANs (15%)
- Security & ACLs (15%)
- Troubleshooting (5%)

Question Types:
✓ Multiple Choice (70%)
✓ Multiple Select (15%)
✓ Short Answer (10%)
```

---

## ✅ Quality Assurance Process

### Before Using Generated Assessment

**Pre-Use Checklist:**

- [ ] All 180 questions present (60-60-60 split)
- [ ] Answer key includes explanations
- [ ] Questions align with stated learning objectives
- [ ] No duplicate questions
- [ ] Difficulty progression smooth (Easy → Medium → Hard)
- [ ] Content coverage matches distribution percentages
- [ ] No biased or offensive language
- [ ] Technical accuracy verified

### Sample QA Review Process

```
1. Count questions in each section:
   Q1-Q60 (Easy): _____ (should be 60)
   Q61-Q120 (Medium): _____ (should be 60)
   Q121-Q180 (Hard): _____ (should be 60)

2. Random sample review:
   - Pick 5 random easy questions
   - Pick 5 random medium questions
   - Pick 5 random hard questions
   - Verify quality, clarity, accuracy

3. Check answer key:
   - Do all questions have answers?
   - Do hard questions have detailed explanations?
   - Are explanations 2-3 sentences minimum?

4. Test with small group:
   - Have 3-5 people take assessment
   - Gather feedback on difficulty, clarity
   - Note suggestions for improvements

5. Make adjustments:
   - Reword unclear questions
   - Adjust difficulty if needed
   - Add/remove questions from specific areas
```

---

## 🎨 Advanced Usage: Customization Tips

### Tip 1: Create Specialized Assessments

Create a technical assessment for a specific job role:

```
Assessment: "Senior AWS DevOps Engineer Assessment"
Focus Areas:
- Lambda & Serverless (25%)
- CodePipeline & CI/CD (25%)
- CloudFormation & IaC (20%)
- Monitoring & Logging (15%)
- Security & Compliance (15%)

Learning Objectives (Hard):
"Design and implement fully automated CI/CD pipelines
with compliance controls"
```

### Tip 2: Progressive Difficulty Path

Create multiple assessments for learning path:

```
1. Foundation: "AWS Basics" (60 questions)
   - 50% Easy, 40% Medium, 10% Hard

2. Intermediate: "AWS Solutions" (180 questions)
   - 33% Easy, 33% Medium, 34% Hard

3. Advanced: "AWS Architecture" (180 questions)
   - 10% Easy, 30% Medium, 60% Hard
```

### Tip 3: Competency-Focused Assessment

For behavioral/competency interviews:

```
Assessment: "Leadership & Communication Assessment"
Assessment Type: Behavioral Interviews
Focus Areas:
- Team Leadership (25%)
- Communication (25%)
- Problem-Solving (25%)
- Adaptability (15%)
- Customer Focus (10%)

Learning Objectives:
Easy: "Identify best leadership practices"
Medium: "Select appropriate leadership style for scenario"
Hard: "Design team development strategy for complex situation"
```

---

## 🔀 Master Prompt Structure Overview

The generated master prompt includes:

```
┌─────────────────────────────────────────┐
│ 1. Assessment Specifications            │
│    - Name, type, audience               │
│    - Difficulty distribution (60-60-60) │
│    - Content focus areas with %          │
│    - Question type mix                  │
├─────────────────────────────────────────┤
│ 2. Quality Requirements                 │
│    - Easy: Recall & Understanding       │
│    - Medium: Application & Analysis     │
│    - Hard: Evaluation & Synthesis       │
├─────────────────────────────────────────┤
│ 3. Mandatory Guidelines                 │
│    - What to include (all 180 Qs)       │
│    - What to avoid (duplicates)         │
│    - Format requirements                │
├─────────────────────────────────────────┤
│ 4. Output Format Specifications         │
│    - Question numbering (Q1-Q180)       │
│    - Answer key structure               │
│    - Explanation requirements           │
└─────────────────────────────────────────┘
```

---

## 📈 Using Generated Assessments

### Deployment

1. **Add to InterQ Platform:**
   ```
   Copy/paste questions into database
   Link to job role or skill certification
   Configure passing score
   Enable for candidates
   ```

2. **Share with Candidates:**
   ```
   Email: Send assessment link
   Portal: Available in candidate dashboard
   PDF: Send as downloadable file (if offline)
   ```

3. **Track Results:**
   ```
   Monitor completion rates
   Analyze score distributions
   Identify difficult questions
   Gather feedback for improvements
   ```

### Iteration & Improvement

After assessment launch:

```
1. Collect 50+ responses
2. Analyze item difficulty (% getting it right)
3. Look for questions most people miss
4. Gather candidate feedback
5. Update questions:
   - Reword unclear questions
   - Adjust difficulty level
   - Replace outdated content
6. Re-test with new cohort
7. Repeat quarterly for continuous improvement
```

---

## 🛠️ Troubleshooting

### Problem: Generator shows validation error

**Solution:**
- Ensure Assessment Name is filled in
- Check that content percentages add up to ~100%
- Make sure at least one question type selected

### Problem: Generated prompt is too long

**Solution:**
- The prompt is designed to be long (~3000 words)
- This ensures AI understands all requirements
- Paste entire prompt into AI (it can handle it)

### Problem: Generated assessment has duplicate questions

**Solution:**
- Re-generate prompt and ask AI to ensure no duplicates
- Add to prompt: "Verify no questions are repeated"
- Manually review and remove any duplicates before use

### Problem: Questions are too easy or too hard

**Solution:**
- Adjust learning objectives in generator
- Add to prompt: "Make hard questions significantly more complex"
- Regenerate and request harder/easier questions

### Problem: Questions don't match content areas

**Solution:**
- Review content focus areas in generator
- Increase percentage for under-represented areas
- Regenerate with updated percentages

---

## 📚 Additional Resources

### Files Included

1. **ASSESSMENT_GENERATION_MASTER_GUIDE.md**
   - Comprehensive framework document
   - Detailed standards for each difficulty level
   - Guidelines for all 14 assessment types
   - Quality assurance checklists
   - Sample questions for reference

2. **AssessmentPromptGenerator.tsx**
   - React component for interactive generator
   - Form-based interface
   - Real-time preview
   - Copy/download functionality

3. **This Usage Guide**
   - Step-by-step instructions
   - Examples and best practices
   - Troubleshooting tips
   - Advanced customization guides

### Quick Reference

**The 14 Assessment Types:**
1. Networking Fundamentals
2. Cloud Architecture (AWS)
3. Cloud Architecture (Azure)
4. Active Directory / Identity Management
5. AWS Solutions Architect
6. Azure Administrator
7. Python Programming
8. SQL / Database Management
9. Linux Administration
10. Windows Administration
11. ITIL Foundations
12. CISSP (Information Security)
13. Kubernetes Orchestration
14. Behavioral Interviews (Competency-Based)

---

## 🎓 Learning Path: From Beginner to Master

### Phase 1: Learn the Framework (15 min)
- Read "Core Structural Requirements"
- Understand 60-60-60 distribution
- Review difficulty levels

### Phase 2: Explore Examples (20 min)
- Review sample questions in Master Guide
- Look at assessment-specific templates
- Understand question quality standards

### Phase 3: Try the Generator (10 min)
- Visit prompt generator tool
- Create your first assessment
- Generate a master prompt

### Phase 4: Use AI to Generate (10-20 min)
- Copy prompt to Claude/ChatGPT
- Review generated assessment
- Request refinements if needed

### Phase 5: Quality Assurance (15 min)
- Review all 180 questions
- Check answer key
- Verify coverage and difficulty

### Phase 6: Deploy & Iterate (Ongoing)
- Add assessment to platform
- Collect candidate feedback
- Improve based on data

---

## 💡 Pro Tips

1. **Use GPT-4 or Claude**: Produces higher quality questions than older models

2. **Specify scoring heavily in prompt**: The more specific, the better output

3. **Examples help**: Showing 1-2 sample questions in prompt improves quality

4. **Iterate fast**: If first generation isn't perfect, regenerate with adjustments

5. **Domain expertise matters**: Review by subject matter experts catches issues

6. **Pilot test**: Always test with small group before full rollout

7. **Archive versions**: Keep copies of assessments for comparison/improvement tracking

8. **Feedback loop**: Collect data on which questions are too hard/easy and adjust

---

## 🚀 Next Steps

1. **Start small**: Generate one assessment to learn the process
2. **Get feedback**: Share with colleagues for quality review
3. **Scale up**: Create multiple assessments for different roles
4. **Automate**: Integrate generated assessments into platform
5. **Optimize**: Iterate based on candidate performance data

---

## 📞 Support

**Questions about:**
- **Generator Tool**: Check troubleshooting section above
- **Master Guide**: Review specific section in ASSESSMENT_GENERATION_MASTER_GUIDE.md
- **AI Generation**: Refer to "Using the Master Prompt with AI" section
- **Quality Assurance**: See QA process checklist

---

**Created**: April 3, 2026  
**Version**: 1.0 - Complete Implementation  
**Status**: Production Ready ✅  

**Remember**: Quality assessments drive quality hiring. Invest time in QA!
