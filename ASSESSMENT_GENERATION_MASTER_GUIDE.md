# InterQ Assessment Generation Master Guide

**Version**: 1.0  
**Last Updated**: April 3, 2026  
**Purpose**: Standardized framework for generating high-quality assessments with 180 questions across 3 difficulty levels

---

## 📋 Table of Contents

1. [Core Structural Requirements](#core-structural-requirements)
2. [Question Design Standards](#question-design-standards)
3. [Assessment Type Guidelines](#assessment-type-guidelines)
4. [Quality Assurance Checklists](#quality-assurance-checklists)
5. [Output Format Specifications](#output-format-specifications)
6. [Assessment-Specific Templates](#assessment-specific-templates)
7. [Master Prompt Template](#master-prompt-template)

---

## Core Structural Requirements

### 180-Question Framework

Every assessment MUST follow this structure:

| Difficulty | Count | Questions | Cognitive Level | Time per Q | Total Time |
|------------|-------|-----------|-----------------|-----------|-----------|
| **Easy** | 60 | Q1-Q60 | Recall/Understand | 1-2 min | 90 min |
| **Medium** | 60 | Q61-Q120 | Apply/Analyze | 2-3 min | 120 min |
| **Hard** | 60 | Q121-Q180 | Evaluate/Synthesize | 3-5 min | 180 min |
| **TOTAL** | **180** | - | - | **~2.5 min avg** | **~270 min** |

### Passing Scores

```
Easy Questions (60):     Weight 20%  |  Passing: 80%+ = 48 questions
Medium Questions (60):   Weight 30%  |  Passing: 70%+ = 42 questions
Hard Questions (60):     Weight 50%  |  Passing: 60%+ = 36 questions
                                     |  Overall: 70%+ Required
```

### Distribution Rules

✅ **Must Include:**
- Core concepts: 40% (72 questions)
- Applied scenarios: 35% (63 questions)
- Advanced/Edge cases: 25% (45 questions)

---

## Question Design Standards

### EASY Questions (1-60)

**Cognitive Level**: Recall, Understand, Remember

**Characteristics**:
- Single concept per question
- Direct answers from resources
- Straightforward wording
- Minimal ambiguity
- Basic vocabulary

**Question Types** (Pick 3-4 for variety):
1. **Multiple Choice (40%)**
   - 4 options: 1 correct + 3 plausible distractors
   - Distractors based on common misconceptions
   - Example: "What does TCP stand for?"

2. **True/False (20%)**
   - Clear, unambiguous statements
   - Mix of true and false ~50/50
   - Example: "Port 443 is used for HTTPS"

3. **Fill in the Blank (25%)**
   - Specific, single-word answers preferred
   - Example: "The OSI model has ___ layers"

4. **Matching (15%)**
   - 5-7 pairs maximum
   - Clear categories
   - Example: Match terms to definitions

**Sample Easy Questions**:

```
Q1. What does IP stand for?
A) Internet Protocol ✓
B) Internal Processor
C) Internet Provider
D) Internet Packet

Q2. True or False: UDP is a connection-oriented protocol
A) True
B) False ✓

Q3. A firewall is used to ___ unauthorized network traffic
A) allow
B) block ✓
C) monitor
D) accelerate

Q4. Match each protocol to its port:
1. HTTP          → a) 22
2. SSH           → b) 80
3. HTTPS         → c) 443
```

---

### MEDIUM Questions (61-120)

**Cognitive Level**: Apply, Analyze, Understand Context

**Characteristics**:
- Multiple concepts connected
- Scenario-based contexts
- Require interpretation
- Problem-solving elements
- Real-world application

**Question Types** (Pick 3-4 for variety):

1. **Scenario Analysis (35%)**
   - Brief case study (3-5 sentences)
   - 4 answer choices
   - Why did this happen? What's the cause?
   - Example: "A user can access the network but not the internet. Possible cause?"

2. **Multiple Select (20%)**
   - 2-3 correct answers out of 5-6 options
   - Partial credit possible
   - Requires comprehensive understanding
   - Example: "Which of these are valid IPv6 addresses?"

3. **Ordering/Sequencing (20%)**
   - Arrange steps in process
   - Multiple valid orders (justify why)
   - Example: "Order these networking layers (top to bottom)"

4. **Short Answer (25%)**
   - 2-3 sentence answers
   - 1-2 key concepts required
   - Example: "Explain the difference between TCP and UDP"

**Sample Medium Questions**:

```
Q61. [SCENARIO] An organization implements a new firewall policy.
After deployment, internal users can access external resources,
but external users cannot initiate connections to internal servers.
What is the most likely firewall configuration?

A) Stateless firewall allows only outbound traffic
B) Stateful firewall allows established connections
C) Firewall denies all inbound traffic by default ✓
D) Firewall is misconfigured for NAT

Q62. [MULTIPLE SELECT] Which statements about IPv4 are correct?
(Select all that apply)
□ IPv4 addresses are 32 bits long ✓
□ IPv4 supports 2^32 possible addresses ✓
□ IPv4 does not support subnetting
□ IPv4 requires manual configuration in all cases
□ IPv4 can identify 256 different subnets ✓

Q63. [ORDERING] Arrange the OSI model layers from bottom to top:
1) ___ Presentation
2) ___ Session
3) ___ Physical
4) ___ Network
5) ___ Transport
6) ___ Data Link
7) ___ Application

Answer: 3→6→4→5→2→1→7

Q64. [SHORT ANSWER] Explain why a subnet mask is necessary
in network communication.
Expected: Networks segmentation, host identification, routing efficiency
```

---

### HARD Questions (121-180)

**Cognitive Level**: Evaluate, Synthesize, Analyze, Create

**Characteristics**:
- Complex, multi-step scenarios
- Requires judgment/critical thinking
- Edge cases and exceptions
- Integration of multiple concepts
- Advanced problem-solving

**Question Types** (Pick 3-4 for variety):

1. **Complex Scenario (40%)**
   - 1-2 paragraph technical scenario
   - Multiple interrelated issues
   - Choose best solution from imperfect options
   - Example: Design network with security + performance constraints

2. **Troubleshooting/Diagnosis (30%)**
   - Problem with multiple possible causes
   - Analyze evidence, justify conclusion
   - Example: "Network is slow. Given these symptoms, what's the root cause?"

3. **Configuration Design (20%)**
   - Design a solution given constraints
   - Justify choices
   - Example: "Design a redundant network topology for 3 offices"

4. **Analysis/Justification (10%)**
   - Compare trade-offs or evaluate approaches
   - Multiple valid perspectives
   - Example: "Compare VPN vs. direct connection for remote access"

**Sample Hard Questions**:

```
Q121. [COMPLEX SCENARIO]
A company has three office locations connected via MPLS.
Users report that morning file uploads are slow (50 Mbps),
but afternoon speeds are normal (200 Mbps). Bandwidth is
provisioned at 250 Mbps. Network logs show no errors.
Which factor MOST LIKELY explains this behavior?

A) MPLS is misconfigured
B) Traffic shaping prioritizes afternoon traffic ✓
C) Morning DNS queries are slow
D) Firewall rules block morning uploads
E) Network topology is asymmetric

Explanation required: QoS policies often schedule traffic
based on time. Peak morning hours may be throttled.

Q122. [TROUBLESHOOTING]
A user cannot reach a remote server by hostname (server.example.com)
but CAN reach it by IP (192.168.1.100). Ping works, but HTTP
requests timeout. What should you check FIRST?

A) Firewall rules for port 80 ✓
B) DNS configuration
C) Network routing
D) Server certificate expiration
E) Client browser cache

Justify: Hostname resolution works (DNS is fine).
Ping works (connectivity is fine). HTTP times out suggests
port-level filtering, not DNS/routing issues.

Q123. [DESIGN SCENARIO]
Design a network for a hospital with 500 computers,
voice systems, and critical medical imaging data.
Constraints: $50K budget, 99.9% uptime, HIPAA compliant.

Provide:
1) Redundancy strategy
2) Network segmentation approach
3) Security controls
4) Cost breakdown

Expected components in answer:
- Dual ISP connections
- VLAN segmentation (medical/admin/guest)
- Redundant switches/routers
- Encryption for medical data
- Network monitoring/logging
```

---

## Assessment Type Guidelines

### 1. **Networking Fundamentals**

**Focus Areas**:
- OSI/TCP-IP models, IP addressing, subnetting
- Routing, switching, DNS, DHCP
- Firewalls, NAT, VPN basics
- Protocols: TCP, UDP, ICMP, HTTP/HTTPS

**Easy**: Definitions, basic protocols, simple calculations
**Medium**: Subnet calculations, troubleshooting scenarios, protocol selection
**Hard**: Network design, multi-scenario troubleshooting, complex routing

**Sample Topic Distribution**:
```
OSI Model (15%) | IP Addressing (20%) | Routing (15%)
Protocols (20%) | Security (15%) | Design (15%)
```

---

### 2. **Cloud Architecture (AWS)**

**Focus Areas**:
- EC2, S3, RDS, Lambda, VPC
- Scalability, availability, disaster recovery
- IAM, security groups, encryption
- Monitoring, pricing, optimization

**Easy**: Service descriptions, basic features, terminology
**Medium**: When to use service X vs Y, architecture selections
**Hard**: Design highly available systems, cost optimization, failover

**Sample Topic Distribution**:
```
EC2 (15%) | S3 (15%) | VPC/Networking (15%)
RDS/Databases (15%) | Lambda/Serverless (15%)
Security/IAM (15%) | Cost/Optimization (10%)
```

---

### 3. **Cloud Architecture (Azure)**

**Focus Areas**:
- Virtual Machines, App Service, Azure SQL
- Virtual Networks, Load Balancers
- Azure AD, security, compliance
- Monitoring, cost management

**Easy**: Service names, basic capabilities, terminology
**Medium**: Service selection, configuration, architecture patterns
**Hard**: Enterprise solutions, disaster recovery, compliance design

**Sample Topic Distribution**:
```
VMs (15%) | App Service (15%) | Networking (15%)
Databases (15%) | Security/AD (15%) | Storage (10%)
Monitoring/Cost (15%)
```

---

### 4. **Active Directory / Identity Management**

**Focus Areas**:
- AD architecture, forests, domains, trusts
- User/computer management, GPO
- Authentication, authorization
- Security groups, delegation

**Easy**: AD components, terminology, basic operations
**Medium**: GPO application, permission delegation, troubleshooting
**Hard**: Enterprise design, trust relationships, migration planning

**Sample Topic Distribution**:
```
AD Architecture (20%) | Objects & Management (20%)
GPO (20%) | Security & Permissions (20%)
Troubleshooting (10%) | Design (10%)
```

---

### 5. **AWS Solutions Architect**

**Focus Areas** (Advanced):
- Designing resilient, scalable architectures
- Cost optimization strategies
- Security best practices
- Multi-region deployments
- Hybrid cloud solutions

**Easy**: Best practices, architecture decisions, terminology
**Medium**: Trade-off analysis, solution selection
**Hard**: Complex enterprise architectures, optimization, edge cases

**Sample Topic Distribution**:
```
Architecture Design (25%) | Scalability (15%)
High Availability (20%) | Security (15%)
Cost Optimization (15%) | Migration (10%)
```

---

### 6. **Azure Administrator**

**Focus Areas**:
- Managing VMs, storage, networking
- User/access management
- Monitoring, backup, disaster recovery
- Azure policies, compliance

**Easy**: Portal navigation, basic operations, terminology
**Medium**: Configuration, troubleshooting, optimization
**Hard**: Enterprise administration, security hardening, automation

**Sample Topic Distribution**:
```
VMs & Compute (20%) | Networking (20%)
Storage (15%) | AD/Security (20%)
Monitoring & Backup (15%) | Policies (10%)
```

---

### 7. **Python Programming**

**Focus Areas**:
- Syntax, data types, control flow
- Functions, OOP, modules
- Exception handling
- File I/O, regular expressions
- Popular libraries (NumPy, Pandas, Requests)

**Easy**: Syntax, basic functions, data types
**Medium**: OOP, list comprehensions, error handling
**Hard**: Design patterns, optimization, complex algorithms

**Sample Topic Distribution**:
```
Syntax & Basics (20%) | Data Types (15%)
Functions & OOP (20%) | Modules & Libraries (15%)
Error Handling (10%) | Advanced Concepts (20%)
```

---

### 8. **SQL / Database Management**

**Focus Areas**:
- SQL basics (SELECT, INSERT, UPDATE, DELETE)
- Joins, aggregations, subqueries
- Schema design, normalization
- Indexing, performance, transactions
- Database administration tasks

**Easy**: Basic SQL queries, simple joins, terminology
**Medium**: Complex queries, optimization suggestions
**Hard**: Schema design, transaction handling, performance tuning

**Sample Topic Distribution**:
```
SELECT Queries (20%) | Joins (15%) | Aggregations (15%)
Schema Design (15%) | Transactions (10%) | Performance (15%)
Advanced Topics (10%)
```

---

### 9. **Linux Administration**

**Focus Areas**:
- File system, permissions, users/groups
- Package management, services
- Shell scripting, systemd
- Networking (ifconfig, netstat, etc.)
- Security (sudo, SELinux, firewalls)

**Easy**: Basic commands, file system hierarchy, permissions
**Medium**: System administration, troubleshooting, scripting
**Hard**: Advanced troubleshooting, security hardening, automation

**Sample Topic Distribution**:
```
File System & Permissions (20%) | Users & Groups (15%)
Package & Services (15%) | Shell Scripting (15%)
Networking (15%) | Security (10%) | Systemd (10%)
```

---

### 10. **Windows Administration**

**Focus Areas**:
- File system (NTFS), permissions
- User/computer management
- Services, tasks, event logs
- Updates, patches, deployment
- PowerShell fundamentals
- Group Policy (basic)

**Easy**: Windows basics, built-in tools, terminology
**Medium**: User management, services configuration
**Hard**: Automation, security hardening, troubleshooting

**Sample Topic Distribution**:
```
File System & Permissions (20%) | User Management (15%)
Services & Processes (15%) | PowerShell (20%)
Event Logs (15%) | Security (10%) | Updates (5%)
```

---

### 11. **ITIL Foundations**

**Focus Areas**:
- Service management principles
- Service lifecycle (5 phases)
- Key processes: Incident, Problem, Change, Release
- ITSM concepts: CMDB, KPI, SLA
- Best practices, terminology

**Easy**: ITIL concepts, definitions, process names
**Medium**: Applying ITIL principles, scenario-based
**Hard**: Complex process interactions, strategy questions

**Sample Topic Distribution**:
```
Service Fundamentals (20%) | Service Lifecycle (25%)
Incident Management (15%) | Problem Management (15%)
Change & Release (15%) | Concepts & Strategy (10%)
```

---

### 12. **CISSP (Information Security)**

**Focus Areas** (Advanced):
- Security governance, risk management
- Cryptography, access control
- Security architecture, network security
- Software security, operations
- Legal, compliance, ethics

**Easy**: Security concepts, types of attacks, terminology
**Medium**: Risk analysis, mitigation strategies, solutions
**Hard**: Enterprise security design, compliance strategy

**Sample Topic Distribution**:
```
Governance (15%) | Cryptography (15%)
Access Control (15%) | Security Design (20%)
Operations (15%) | Ethics & Compliance (10%)
Advanced Topics (15%)
```

---

### 13. **Kubernetes Orchestration**

**Focus Areas**:
- Pods, deployments, services
- ConfigMaps, secrets, volumes
- Networking, ingress
- RBAC, security policies
- Monitoring, logging, scaling

**Easy**: Kubernetes concepts, object types, terminology
**Medium**: Deployment scenarios, troubleshooting basics
**Hard**: Complex deployments, security hardening, optimization

**Sample Topic Distribution**:
```
Core Objects (25%) | Networking (20%)
Storage (15%) | Security & RBAC (20%)
Monitoring & Logging (10%) | Advanced (10%)
```

---

### 14. **Behavioral Interviews (Competency-Based)**

**Focus Areas**:
- Leadership & teamwork
- Problem-solving & decision-making
- Communication & influence
- Adaptability & learning
- Customer focus, integrity

**Easy**: Recognition of behaviors, basic competencies
**Medium**: Scenario evaluation, best practice selection
**Hard**: Complex behavioral scenarios, multiple variables

**Sample Topic Distribution** (Question Types):
```
Teamwork (15%) | Leadership (15%)
Communication (15%) | Problem-Solving (15%)
Adaptability (15%) | Customer Focus (15%)
Integrity & Ethics (10%)
```

---

## Quality Assurance Checklists

### Pre-Generation Checklist

- [ ] Assessment type clearly defined
- [ ] Difficulty levels understood (Easy/Medium/Hard)
- [ ] Content focus areas identified
- [ ] Target audience confirmed
- [ ] Expected passing score determined (usually 70%)
- [ ] Question type mix approved
- [ ] Time constraints considered

### Question Quality Checklist (Per Question)

- [ ] Question is relevant to stated learning objective
- [ ] Wording is clear and unambiguous
- [ ] No grammatical or spelling errors
- [ ] Appropriate difficulty for category
- [ ] Has exactly one best answer (multiple choice)
- [ ] Distractors are plausible but incorrect
- [ ] No "trick" or unfair questions
- [ ] Not multiple correct answers (unless specified)
- [ ] Validates understanding, not just memorization (hard/medium)
- [ ] Follows formatting standards

### Assessment Completeness Checklist

- [ ] Exactly 180 questions total
- [ ] 60 Easy (Q1-Q60)
- [ ] 60 Medium (Q61-Q120)
- [ ] 60 Hard (Q121-Q180)
- [ ] All topics covered appropriately
- [ ] Balanced question types per difficulty
- [ ] Answer key complete and verified
- [ ] Explanations for all answers (recommended)
- [ ] No duplicate questions
- [ ] Difficulty progression is smooth

### Content Coverage Checklist

- [ ] Core concepts covered: 40% (72 questions)
- [ ] Applied scenarios present: 35% (63 questions)
- [ ] Advanced/edge cases included: 25% (45 questions)
- [ ] No major gaps in content areas
- [ ] Aligned with industry standards
- [ ] Culturally appropriate language
- [ ] No biased or offensive content

---

## Output Format Specifications

### Assessment File Structure

```
ASSESSMENT_NAME_COMPLETE.md
├── Header Section
│   ├── Assessment Title
│   ├── Type & Category
│   ├── Difficulty Level
│   ├── Duration (minutes)
│   ├── Passing Score
│   └── Target Audience
│
├── Learning Objectives
│
├── Question Bank (180 Questions)
│   ├── EASY SECTION (Q1-Q60)
│   ├── MEDIUM SECTION (Q61-Q120)
│   └── HARD SECTION (Q121-Q180)
│
├── Answer Key
│   ├── Easy Answers (Q1-Q60)
│   ├── Medium Answers (Q61-Q120)
│   └── Hard Answers (Q121-Q180)
│
└── Scoring Guide
    ├── Points per question
    ├── Passing thresholds
    └── Interpretation
```

### Question Format Standards

**Multiple Choice**:
```
Q#. [Question Text]
A) Option 1
B) Option 2 ✓ (correct answer marker)
C) Option 3
D) Option 4

Explanation: [Why this is correct]
Category: [Content area]
Difficulty: Easy/Medium/Hard
Learning Objective: [What this validates]
```

**Multiple Select**:
```
Q#. [Question Text] (Select all that apply)
□ Option 1 ✓
□ Option 2
□ Option 3 ✓
□ Option 4

Correct Answers: Options 1 & 3
Explanation: [Full explanation]
Category: [Content area]
```

**Short Answer**:
```
Q#. [Question Text]
Expected Answer:
- Key concept 1
- Key concept 2
- Key concept 3 (optional details)

Explanation: [Full explanation of answer]
Category: [Content area]
```

### Answer Key Format

```
## ANSWER KEY

### EASY SECTION (Q1-Q60)

| Q | Answer | Explanation | Category |
|---|--------|-------------|----------|
| 1 | B | [Explanation] | [Topic] |
| 2 | A | [Explanation] | [Topic] |
| ... | ... | ... | ... |

### MEDIUM SECTION (Q61-Q120)

| Q | Answer | Explanation | Category |
|---|--------|-------------|----------|
| 61 | C | [Explanation] | [Topic] |
| 62 | A, D | [Explanation] | [Topic] |
| ... | ... | ... | ... |

### HARD SECTION (Q121-Q180)

| Q | Answer | Explanation | Category |
|---|--------|-------------|----------|
| 121 | C | [Complex explanation] | [Topic] |
| 122 | A | [Complex explanation] | [Topic] |
| ... | ... | ... | ... |

## SCORING SUMMARY

Total Questions: 180
Easy (60): Weight 20%
Medium (60): Weight 30%
Hard (60): Weight 50%
Passing Score: 70% Overall
```

---

## Assessment-Specific Templates

### Template 1: Technical Assessments (Networking, Cloud, Admin)

**Standard Question Structure**:

```
Q[#]. [Core Concept Question]

Context/Scenario (if applicable):
[Background information for realistic scenarios]

Question:
[Specific technical question]

Options (MC):
A) [Plausible but wrong - common mistake]
B) [Plausible but wrong - misconception]
C) [Correct answer] ✓
D) [Plausible but wrong - another common mistake]

Explanation:
[Why C is correct, why others are wrong]

Related Concepts:
- [Concept 1]
- [Concept 2]
- [Concept 3]

Difficulty Justification:
[Why this is Easy/Medium/Hard]
```

---

### Template 2: Behavioral/Competency Assessments

**Standard Question Structure**:

```
Q[#]. [Competency Area]: [Specific Scenario]

Situation:
[Context: who, what, where, when]

Challenge:
[What was difficult or complex]

Question:
[How did you handle this or what would you do?]

Options (MC):
A) [Weak/ineffective approach]
B) [Good approach] ✓
C) [Alternative good approach] ✓
D) [Poor approach]

Competencies Evaluated:
- [Competency 1]
- [Competency 2]
- [Competency 3]

Scoring Notes:
[Expectations for answers]

Difficulty Justification:
[Why this is Easy/Medium/Hard]
```

---

### Template 3: Programming/Coding Assessments

**Standard Question Structure**:

```
Q[#]. [Programming Concept]

Concept:
[What programming concept is being tested]

Code Context (if applicable):
[Sample code or pseudocode]

Question:
[What will this do, or fix this code]

Options (MC):
A) [Plausible wrong output/fix]
B) [Correct answer] ✓
C) [Off-by-one error]
D) [Different but valid approach]

Explanation:
[Detailed explanation of correct answer]

Key Learning Points:
- [Point 1]
- [Point 2]
- [Point 3]

Difficulty Justification:
[Why this is Easy/Medium/Hard]
```

---

## Master Prompt Template

Use this template to generate assessments with AI (Claude, ChatGPT, etc.):

```markdown
# Assessment Generation Master Prompt

You are an expert assessment designer creating a comprehensive 
180-question professional certification assessment.

## ASSESSMENT SPECIFICATIONS

### Basic Information
- **Assessment Name**: [NAME]
- **Assessment Type**: [1 of 14 types]
- **Target Audience**: [Who takes this]
- **Industry Standard**: [If applicable]
- **Passing Score**: 70% (recommended)

### Difficulty Distribution
- Easy Questions (Q1-Q60): 60 questions @ 20% weight
- Medium Questions (Q61-Q120): 60 questions @ 30% weight
- Hard Questions (Q121-Q180): 60 questions @ 50% weight

### Content Focus Areas
List the 5-7 main topics to cover:
1. [Topic 1] - X%
2. [Topic 2] - X%
3. [Topic 3] - X%
...

### Question Types Mix
- Multiple Choice: 60%
- Multiple Select: 15%
- Short Answer: 15%
- Matching/Ordering: 10%

## QUALITY REQUIREMENTS

### For EASY Questions (Q1-Q60)
- Focus on recall and understanding
- Single concepts per question
- Clear, unambiguous wording
- Standard vocabulary
- Direct answers from core materials
- Mix of definitions, terminology, and basic scenarios

### For MEDIUM Questions (Q61-Q120)
- Focus on application and analysis
- Combine 2-3 related concepts
- Scenario-based contexts (brief case studies)
- Require interpretation and judgment
- Real-world applications
- Mix of scenario analysis and problem-solving

### For HARD Questions (Q121-Q180)
- Focus on evaluation and synthesis
- Complex, multi-step scenarios
- Require critical thinking and judgment
- Integration of multiple concepts
- Edge cases and exceptions
- Research/design components when applicable

## MANDATORY GUIDELINES

✅ INCLUDE IN OUTPUT:
1. All 180 questions precisely formatted
2. Answer key with complete explanations
3. Learning objectives for each question
4. Content category/topic for each question
5. Difficulty justification for hard questions
6. Common misconceptions addressed in explanations

✅ FORMATTING REQUIREMENTS:
- Questions: Q1-Q180 (consecutive numbering)
- Answer markers: Use ✓ for correct answer in MC
- Explanations: 2-3 sentences minimum
- No duplicate questions

❌ DO NOT INCLUDE:
- Questions outside the specified domains
- Ambiguous questions with multiple valid answers
- Overly wordy or convoluted questions
- Outdated or deprecated information
- Biased, offensive, or discriminatory content

## OUTPUT FORMAT

Present the assessment in this structure:

```
# [ASSESSMENT NAME] - Complete Assessment Bank

## Assessment Overview
- Type: [Type]
- Total Questions: 180
- Duration: [X minutes]
- Passing Score: 70%

## Learning Objectives
1. [Objective 1]
2. [Objective 2]
...

## EASY SECTION (Q1-Q60)

[Questions presented with answers inline]

## MEDIUM SECTION (Q61-Q120)

[Questions presented with answers inline]

## HARD SECTION (Q121-Q180)

[Questions presented with answers inline]

## ANSWER KEY & EXPLANATIONS

[Complete answer key table with explanations]

## SCORING GUIDE

[How to calculate and interpret scores]
```

## ASSESSMENT TYPE SPECIFICS

[Include 2-3 specific guidelines for this assessment type]

---

GENERATE THE COMPLETE ASSESSMENT WITH ALL 180 QUESTIONS NOW.
START WITH EASY QUESTIONS (Q1-Q60).
```

---

## Best Practices Summary

| Aspect | Best Practice |
|--------|---------------|
| **Question Count** | Always 180 total (60-60-60) |
| **Difficulty Progression** | Smooth: Easy → Medium → Hard |
| **Wording** | Clear, professional, industry-standard |
| **Answers** | One best answer for MC, multiple allowed for select-all |
| **Explanations** | Include for all questions, especially hard |
| **Validation** | Check each question against QA checklist |
| **Relevance** | Ensure all questions align with learning objectives |
| **Timeframe** | ~2.5 minutes per question average |
| **Format** | Consistent markdown or PDF structure |
| **Review** | Have 2+ subject matter experts review |

---

## Quick Reference: 14 Assessment Types

1. ✅ **Networking Fundamentals** - OSI model, TCP/IP, basic protocols
2. ✅ **Cloud Architecture (AWS)** - EC2, S3, VPC, RDS
3. ✅ **Cloud Architecture (Azure)** - VMs, App Service, SQL
4. ✅ **Active Directory** - AD objects, GPO, security groups
5. ✅ **AWS Solutions Architect** - Advanced AWS design
6. ✅ **Azure Administrator** - Azure management, operations
7. ✅ **Python Programming** - Fundamentals to OOP
8. ✅ **SQL / Database** - Query design, normalization, optimization
9. ✅ **Linux Administration** - CLI, scripts, security
10. ✅ **Windows Administration** - User management, PowerShell
11. ✅ **ITIL Foundations** - Service management processes
12. ✅ **CISSP** - Information security, governance
13. ✅ **Kubernetes** - Container orchestration, deployment
14. ✅ **Behavioral Interviews** - Competency-based scenarios

---

**Last Updated**: April 3, 2026  
**Version**: 1.0 - Complete Framework  
**Status**: Ready for Production Use
