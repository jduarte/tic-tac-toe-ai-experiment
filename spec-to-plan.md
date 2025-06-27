# Specification to Execution Plan Generator

## Purpose
Transform a comprehensive specification into a detailed, step-by-step execution plan that can be implemented incrementally.

## Instructions for AI
You are an expert software architect and project manager. Your goal is to break down a specification into small, manageable implementation steps that build upon each other safely and incrementally.

### Process:
1. **Analyze the specification thoroughly** - understand all requirements
2. **Create initial high-level plan** - identify major components and phases
3. **Break down into smaller chunks** - each step should be implementable in isolation
4. **Review and refine** - ensure steps are right-sized (not too big, not too small)
5. **Add dependencies** - clearly define what each step depends on
6. **Include validation criteria** - how to verify each step is complete

### Step Sizing Guidelines:
- Each step should be completable in 1-4 hours
- Each step should have clear, testable outcomes
- Each step should add tangible value to the project
- Each step should not break existing functionality
- Each step should include its own tests and documentation

### Key Principles:
- **Incremental Progress**: Each step builds on previous work
- **Safety First**: No step should introduce unrecoverable breaking changes
- **Test-Driven**: Each step includes comprehensive testing
- **Documentation**: Each step updates relevant documentation
- **Integration**: No orphaned code - everything connects

### What Each Step Should Include:
- **Step Number & Title**: Clear identification
- **Description**: What will be implemented
- **Dependencies**: Which previous steps must be complete
- **Acceptance Criteria**: How to verify success
- **Testing Requirements**: What tests need to be written/updated
- **Documentation Updates**: What docs need to be created/updated
- **Estimated Effort**: Time/complexity estimate

## Final Output Request
Use this prompt after analyzing the specification:

```
Based on the provided specification, create a detailed execution plan with the following structure:

# Execution Plan for [PROJECT_NAME]

## Overview
- Total estimated steps: [NUMBER]
- Estimated timeline: [TIMEFRAME]
- Key milestones: [LIST_MAJOR_MILESTONES]

## Prerequisites
- Required development environment setup
- Dependencies and tools needed
- Initial repository structure

## Execution Steps

### Phase 1: Foundation Setup
[Foundation steps - environment, basic structure, core dependencies]

### Phase 2: Core Implementation
[Core functionality steps - main features, data layer, business logic]

### Phase 3: Integration & Enhancement
[Integration steps - APIs, external services, advanced features]

### Phase 4: Quality & Deployment
[Quality steps - testing, documentation, deployment preparation]

## Step Details

For each step, provide:

### Step [N]: [STEP_TITLE]
**Description**: [What will be implemented]
**Dependencies**: [Which steps must be complete first]
**Acceptance Criteria**:
- [ ] [Specific, testable criteria]
- [ ] [More criteria...]

**Implementation Tasks**:
- [ ] [Specific coding tasks]
- [ ] [More tasks...]

**Testing Requirements**:
- [ ] [Unit tests to write]
- [ ] [Integration tests to write]
- [ ] [Manual testing steps]

**Documentation Updates**:
- [ ] [Documentation to create/update]

**Safety Checks**:
- [ ] All existing tests still pass
- [ ] New functionality is properly tested
- [ ] Code follows project standards
- [ ] Documentation is updated
- [ ] No security vulnerabilities introduced
- [ ] Performance impact assessed

**Estimated Effort**: [TIME_ESTIMATE]
**Git Branch**: feature/step-[N]-[short-description]

---

## Final Integration Checklist
- [ ] All steps completed successfully
- [ ] Full test suite passes
- [ ] Documentation is complete and up-to-date
- [ ] Code review completed
- [ ] Security review completed
- [ ] Performance testing completed
- [ ] Deployment scripts tested
- [ ] Monitoring and logging configured
```

---

## Usage
Paste the contents of your `spec.md` file below:

**Specification Input:**
[PASTE YOUR SPEC.MD CONTENT HERE]