import { useState } from 'react'

/* ─── Brand colors ─── */
const C = {
  bg: '#faf9f5',
  dark: '#141413',
  orange: '#d97757',
  blue: '#6a9bcc',
  green: '#788c5d',
  gray: '#b0aea5',
  lightGray: '#e8e6dc',
  cream: '#f5f3ee',
  muted: '#6a685e',
  faint: '#b0aea5',
}

/* ─── Day 2 steps extracted from App.jsx ─── */
const DAY2_STEPS = [
  {
    title: "Set the scene: Lumen's problem",
    desc: "Before touching any code, internalize the customer scenario. Lumen Logistics has 40 developers, zero documentation, and a 3-week ramp time for new hires. The CTO wants Claude Code to fix this. Your job today: prove that a single file \u2014 CLAUDE.md \u2014 can transform how Claude understands and works within their codebase.",
    narration: "Open with: 'Imagine you're walking into Lumen Logistics. Their CTO tells you: our new hires take three weeks to get productive because nothing is written down. Can Claude Code fix that?' Pause. Let that land. The answer is yes \u2014 and the key is CLAUDE.md.",
    timing: "2 min",
  },
  {
    title: "Fork and clone the messy repo",
    context: "terminal",
    desc: "We've prepared a repo with no documentation, inconsistent patterns, and no CLAUDE.md. Fork it to your account and clone locally.",
    commands: ["git clone https://github.com/amurray101/basecamp-messy-repo.git", "cd basecamp-messy-repo", "npm install"],
    narration: "As you clone: 'This repo is designed to be messy on purpose. Mixed coding styles, no docs, no tests in some modules. It's what a real customer codebase looks like on day one.'",
    timing: "3 min",
  },
  {
    title: "Explore the codebase without Claude",
    context: "terminal",
    desc: "Before writing a CLAUDE.md, understand what you're working with. Browse the directory structure and notice the inconsistencies.",
    commands: ["ls -la src/", "cat package.json"],
    keyPoint: "You have to understand the conventions before you can teach them to Claude. This exploration step is what you'd do in a real customer engagement \u2014 and it's what you'd coach the customer's tech lead to do.",
    timing: "3 min",
  },
  {
    title: "The 'before' \u2014 Claude without CLAUDE.md",
    context: "claude",
    desc: "Launch Claude Code in the messy repo. Without a CLAUDE.md, Claude infers conventions from the code itself \u2014 sometimes right, sometimes wrong. Ask it to refactor a module and watch where it guesses.",
    prompt: "Refactor src/utils/helpers.js \u2014 improve the code quality, add error handling, and write tests.",
    narration: "After Claude finishes: 'Look at the output. Did it use async/await or Promises? Did it add JSDoc or just inline comments? Did it put the test file in the right place? It made choices \u2014 but they were guesses. In a customer codebase with strong conventions, guesses create inconsistency.'",
    keyPoint: "This is the most important demo moment in the entire program. The 'before' output isn't bad \u2014 it's just inconsistent. That's the problem CLAUDE.md solves.",
    timing: "8 min",
  },
  {
    title: "Write your CLAUDE.md",
    context: "file",
    desc: "CLAUDE.md has four key sections: Architecture (where things live), Conventions (how to write code), Testing (what 'tested' means), and Before Committing (the checklist). Create one now.",
    code: `# Project: Basecamp Sample App

## Architecture
- Express.js backend with route handlers in /src/routes/
- Utility modules in /src/utils/
- Tests live next to source files: foo.ts \u2192 foo.test.ts

## Conventions
- Use async/await, never raw Promises
- All functions need JSDoc comments
- Error handling: always use try/catch with specific error types
- Imports: group by external, internal, types

## Testing
- Framework: Jest with supertest for API tests
- Every route needs at least one happy path and one error test
- Run \`npm test\` before committing

## Before committing
- Run \`npm run lint && npm test\`
- Never commit .env or node_modules`,
    codeTitle: "CLAUDE.md",
    tip: "In a customer engagement, writing the first CLAUDE.md together is a powerful onboarding moment. It forces the team to articulate conventions they've never written down \u2014 which is itself valuable even without Claude Code.",
    timing: "8 min",
  },
  {
    title: "The 'after' \u2014 Claude with CLAUDE.md",
    context: "claude",
    desc: "Exit and re-launch Claude Code so it picks up your CLAUDE.md. Ask the exact same refactoring question. The difference should be visible \u2014 async/await instead of callbacks, JSDoc instead of inline comments, co-located tests.",
    prompt: "Refactor src/utils/helpers.js to follow our project conventions. Add proper error handling, documentation, and tests.",
    narration: "As Claude works: 'Same task, same repo, different output. Watch \u2014 async/await instead of callbacks. JSDoc instead of inline comments. Tests co-located with the source file. It's following the CLAUDE.md like a new team member who actually read the onboarding doc.'",
    keyPoint: "This before/after comparison is the single most persuasive demo in the entire Basecamp program. When you show this to a customer, you're not talking about AI in the abstract \u2014 you're showing their conventions being followed automatically.",
    timing: "8 min",
  },
  {
    title: "The CLAUDE.md iteration loop",
    context: "claude",
    desc: "Your first CLAUDE.md is never perfect. Look at Claude's output from the previous step \u2014 what did it get right? What would you add? Try refining your CLAUDE.md based on what you observed.",
    prompt: "What conventions did you infer from the existing code that I should add to my CLAUDE.md?",
    narration: "'Ask Claude itself what you should add. This is a powerful move in customer engagements \u2014 Claude can help you write the CLAUDE.md by analyzing the codebase. The loop is: write CLAUDE.md, observe output, ask Claude what's missing, refine. Each iteration makes the output better.'",
    tip: "This iteration loop \u2014 write, observe, refine \u2014 is how teams get the most value from CLAUDE.md. In a customer engagement, plan to iterate 2-3 times during the first session.",
    timing: "5 min",
  },
  {
    title: "Session management: /compact",
    context: "claude",
    desc: "In long coding sessions, Claude's context window fills up. The /compact command summarizes the conversation to free space while preserving important context.",
    commands: ["/compact"],
    narration: "'After 15-20 minutes of work, you'll notice Claude starting to forget earlier context. That's the context window filling up. /compact is your pressure release valve \u2014 it summarizes what happened and frees up space. Watch what it preserves and what it drops.'",
    keyPoint: "Teach customers to use /compact proactively, not reactively. If you wait until Claude starts forgetting, you've already lost context. Compact every 15-20 minutes in long sessions.",
    timing: "3 min",
  },
  {
    title: "Session management: /clear and /cost",
    context: "claude",
    desc: "Two more essential commands for session hygiene:",
    commands: ["/cost", "/clear"],
    narration: "'/cost shows you exactly what this session has consumed \u2014 tokens in, tokens out, total spend. Essential for customers tracking costs. /clear resets the entire context. Use it when you're switching tasks or when /compact isn't enough.'",
    tip: "/cost is your friend in customer conversations about pricing. Run it after a real task: 'That refactoring task \u2014 reading the codebase, planning changes, writing code, running tests \u2014 cost $0.08. Your developer would have spent 45 minutes.'",
    timing: "3 min",
  },
  {
    title: "Plan Mode: think before acting",
    context: "claude",
    desc: "Plan Mode is Claude Code's most powerful trust-building feature. The 'plan:' prefix tells Claude to analyze and plan without making any changes.",
    prompt: "plan: Analyze this codebase and propose a strategy for adding TypeScript. Identify the riskiest files to migrate first, suggest a tsconfig.json, and outline the migration order.",
    narration: "'Plan Mode is your secret weapon in customer demos. Skeptical engineers don't trust AI that immediately starts editing their code. Plan Mode lets them see Claude's reasoning first \u2014 what it would change and why. They can review the plan, give feedback, then green-light execution. It's the difference between trust and anxiety.'",
    keyPoint: "In customer demos, always start complex tasks in Plan Mode. It shows the reasoning, builds trust, and lets the customer feel in control. Then switch to execution: 'That plan look right? Let's build it.'",
    timing: "5 min",
  },
  {
    title: "Prompt patterns that work",
    context: "claude",
    desc: "The difference between a good prompt and a great prompt comes down to specificity and structure. Compare these patterns:",
    prompt: "Using the patterns from our CLAUDE.md, add a new POST /api/shipments endpoint that creates a shipment record. Follow the same patterns as the existing routes. Include input validation, error handling, and tests.",
    narration: "'Notice the prompt structure: what to build, which patterns to follow, and what quality means. Vague prompts like 'add a shipments endpoint' force Claude to guess. Specific prompts like this one get consistent, convention-matching output on the first try.'",
    tip: "The three-part prompt pattern: WHAT (the task) + HOW (the conventions/patterns) + VERIFY (tests, validation). This pattern works for any coding task and is the foundation of effective agentic prompting.",
    timing: "5 min",
  },
  {
    title: "Anti-pattern: the kitchen-sink session",
    context: "claude",
    desc: "One of the most common mistakes is cramming too many unrelated tasks into a single session. Claude's context fills up, quality degrades, and you end up fighting the tool instead of using it.",
    narration: "'Let me show you what NOT to do. If you ask Claude to refactor a module, then add a new feature, then fix a bug in a different file, then update the README \u2014 all in one session \u2014 quality drops after the third task. The context is full of unrelated code. The fix: one session per task, or /compact between tasks.'",
    keyPoint: "Teach customers the 'one job, one session' rule. For complex work: Plan Mode to scope it, then a fresh session to execute each piece. This is the habit that separates power users from frustrated users.",
    timing: "3 min",
  },
  {
    title: "CLAUDE.md hierarchy: team-wide conventions",
    context: "file",
    desc: "In enterprise deployments, CLAUDE.md works at multiple levels. A root-level file sets org-wide standards. Team-level files add team-specific conventions. Project-level files override where needed.",
    code: `# Hierarchy (top to bottom, each layer overrides):

~/.claude/CLAUDE.md           # Personal preferences
repo-root/CLAUDE.md            # Project conventions
repo-root/src/CLAUDE.md        # Subdirectory overrides

# Example: org-level CLAUDE.md (repo root)
# Sets company-wide rules:
# - Always use TypeScript
# - All PRs need tests
# - Follow the company style guide

# Example: team-level CLAUDE.md (subdirectory)
# Adds team-specific rules:
# - This service uses PostgreSQL
# - API routes follow REST conventions
# - Integration tests use the staging DB`,
    codeTitle: "CLAUDE.md hierarchy",
    narration: "'When a customer asks: how does this scale to 200 developers? \u2014 this is the answer. The engineering director writes the root CLAUDE.md with company-wide standards. Each team adds their own file with team-specific conventions. It's the same pattern as .eslintrc \u2014 cascading configuration. Developers don't need to know it exists; it just works.'",
    keyPoint: "The hierarchy question always comes up in enterprise conversations. Having this answer ready \u2014 with the .eslintrc analogy \u2014 closes the 'but how does it scale?' objection.",
    timing: "4 min",
  },
  {
    type: "checkpoint",
    title: "The pitch to Lumen's CTO",
    desc: "You've now seen the full arc: messy codebase without CLAUDE.md (inconsistent output) vs. with CLAUDE.md (convention-matching output). You know session management, Plan Mode, and prompt patterns. Now practice the pitch: How would you explain to Lumen's CTO what you just did? What's the one-sentence version? What's the three-minute version? What would you show them?",
    narration: "'The one-sentence pitch: CLAUDE.md turns your team's unwritten conventions into explicit instructions that Claude follows automatically \u2014 so every developer, including Claude, writes code that looks like your best engineer wrote it. The three-minute version: show the before/after. The ten-minute version: do it live on their repo.'",
  },
]

/* ─── Day 2 competencies ─── */
const COMPETENCIES = [
  { role: "PE Pre-Sales", text: "Write a CLAUDE.md for a prospect\u2019s repo during a live evaluation, showing how context transforms output quality \u2014 a best practice you can teach in every technical evaluation" },
  { role: "PE Post-Sales", text: "Pair-program with a customer engineering team to author CLAUDE.md files tailored to their codebase, conventions, and CI/CD pipeline" },
  { role: "Solutions Architect", text: "Design a CLAUDE.md strategy for a multi-team engineering org \u2014 root-level standards, team-level overrides, and integration patterns with existing style guides" },
  { role: "Applied Research", text: "Evaluate how CLAUDE.md content affects model reasoning quality, identify prompt patterns that improve code generation accuracy, and build evaluation harnesses to measure impact" },
]

/* ─── Prompt patterns data ─── */
const PROMPT_PATTERNS = [
  { num: 1, name: 'Migration', template: 'Migrate [system] from [old] to [new]. Maintain [invariant]. Verify with [test approach].', example: 'Migrate the payment module from Stripe v2 to v3. Maintain all existing webhook handlers. Run the integration test suite.' },
  { num: 2, name: 'Testing', template: 'Write [test type] for [module]. Cover [scenarios]. Use [framework]. Aim for [target].', example: 'Write integration tests for the orders API. Cover creation, cancellation, and refund flows. Use Jest + Supertest. Aim for 90% coverage.' },
  { num: 3, name: 'Debugging', template: '[Error description] when [trigger]. Trace across [scope]. Identify root cause and fix.', example: 'Intermittent 502 errors when orders service calls inventory. Trace HTTP client, retry logic, timeouts. Fix with proper error handling.' },
  { num: 4, name: 'Documentation', template: 'Generate [doc type] for [scope]. Include [elements]. Format as [output].', example: 'Generate onboarding docs for the codebase. Include architecture overview, setup guide, key patterns. Format as markdown.' },
  { num: 5, name: 'Refactor', template: 'Refactor [target] to [improve quality]. Preserve [constraint]. Verify [success criteria].', example: 'Refactor the notification service to use a plugin architecture. Preserve all existing notification channels. All tests pass.' },
]

const ANTI_PATTERNS = [
  { bad: '"Create a file called auth.js and write..."', fix: 'Too prescriptive. Let Claude plan.' },
  { bad: '"Do step 1, then step 2, then..."', fix: 'Micromanaging. Describe the destination, not the route.' },
  { bad: '"Fix the bug"', fix: 'Too vague. Describe symptoms, context, expected behavior.' },
]

const CONTEXT_COMMANDS = [
  { cmd: '/compact', desc: 'Compress context. Use between major tasks.' },
  { cmd: '/clear', desc: 'Reset session. Use when switching projects.' },
  { cmd: 'Plan Mode', desc: 'Think without acting. Use for complex planning.' },
  { cmd: '/review', desc: 'Code review mode.' },
  { cmd: '/commit', desc: 'Stage and commit with Claude.' },
  { cmd: '/test', desc: 'Run test suite.' },
]

const SESSION_HYGIENE = [
  'Start each session with a clear objective',
  'Use /compact after completing a major step (don\u2019t let context bloat)',
  'Switch to Plan Mode for complex multi-step work before executing',
  'Use /clear when switching to an unrelated task',
  'Let CLAUDE.md carry persistent context \u2014 don\u2019t repeat it every session',
]

/* ─── Context badge styles ─── */
const CONTEXT_STYLES = {
  terminal: { label: 'Terminal', bg: '#1a1a1a', fg: '#7ec699', border: '#2a2a2a' },
  claude: { label: 'Claude Code', bg: '#788c5d10', fg: '#788c5d', border: '#788c5d30' },
  file: { label: 'File', bg: '#6a9bcc10', fg: '#6a9bcc', border: '#6a9bcc30' },
}

/* ─── Copyable command ─── */
function CopyableCommand({ command }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '8px 0', borderRadius: 8, overflow: 'hidden', border: '1px solid #2a2a2a' }}>
      <div style={{ flex: 1, padding: '10px 14px', background: '#1a1a1a', fontFamily: 'var(--mono)', fontSize: 12.5, color: '#7ec699', whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
        <span style={{ color: '#666', userSelect: 'none' }}>$ </span>{command}
      </div>
      <button onClick={handleCopy} style={{ padding: '10px 14px', background: '#222', border: 'none', borderLeft: '1px solid #2a2a2a', color: copied ? '#28c840' : '#888', fontFamily: 'var(--mono)', fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {copied ? '\u2713 Copied' : 'Copy'}
      </button>
    </div>
  )
}

/* ─── Section wrapper ─── */
function Section({ id, children, style }) {
  return (
    <section id={id} style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px', width: '100%', ...style }}>
      {children}
    </section>
  )
}

/* ─── Section heading ─── */
function SectionTitle({ children, color = C.dark }) {
  return (
    <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 400, color, margin: '0 0 24px 0', lineHeight: 1.3 }}>
      {children}
    </h2>
  )
}

/* ─── Card wrapper ─── */
function Card({ children, style, borderColor }) {
  return (
    <div style={{
      background: C.cream,
      border: `1px solid ${C.lightGray}`,
      borderRadius: 10,
      padding: '20px 24px',
      ...(borderColor ? { borderLeft: `4px solid ${borderColor}` } : {}),
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ─── Main App ─── */
export default function App() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>

      {/* ═══════════ HEADER ═══════════ */}
      <header style={{ background: C.dark, padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.blue, marginBottom: 16 }}>
            Claude Code Basecamp
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 42, fontWeight: 400, color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>
            Day 2: Prompt Craft for Agentic Coding
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: C.gray, lineHeight: 1.6, margin: 0 }}>
            Materials package &mdash; slides, handouts, and hands-on exercises
          </p>
        </div>
      </header>

      {/* ═══════════ CLIENT SCENARIO ═══════════ */}
      <div style={{ background: '#1e1e1d', borderBottom: `3px solid ${C.blue}` }}>
        <Section style={{ padding: '32px 24px' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: C.blue, background: C.blue + '15', padding: '4px 12px', borderRadius: 20, flexShrink: 0, letterSpacing: 1, textTransform: 'uppercase' }}>
              Client Scenario
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 22, color: '#fff', marginBottom: 6 }}>
                Lumen Logistics
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: C.faint, marginBottom: 10, letterSpacing: 0.5 }}>
                Supply chain / logistics
              </div>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: C.gray, lineHeight: 1.7, margin: 0 }}>
                Lumen Logistics has 40 developers, a sprawling Node.js monorepo, and zero documentation. New hires take 3 weeks to become productive because conventions are unwritten. Your job: write the CLAUDE.md that makes Claude an effective team member, then prove it by refactoring a messy module to match.
              </p>
            </div>
          </div>
        </Section>
      </div>

      {/* ═══════════ LINKS ═══════════ */}
      <Section>
        <SectionTitle>Resources</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          <a href="https://amurray101.github.io/claude-code-basecamp/slides/basecamp-deck.html" target="_blank" rel="noopener noreferrer">
            <Card style={{ cursor: 'pointer', transition: 'border-color 0.2s' }} borderColor={C.orange}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: C.orange, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Slide Deck</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, color: C.dark, marginBottom: 4 }}>Basecamp Slides &mdash; Day 2 Section</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.muted }}>Full deck opens to slide 1; Day 2 starts at slide 10</div>
            </Card>
          </a>
          <a href="https://amurray101.github.io/claude-code-basecamp/" target="_blank" rel="noopener noreferrer">
            <Card style={{ cursor: 'pointer', transition: 'border-color 0.2s' }} borderColor={C.blue}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: C.blue, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Training Platform</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, color: C.dark, marginBottom: 4 }}>Full Claude Code Basecamp</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.muted }}>All 5 days of materials, exercises, and handouts</div>
            </Card>
          </a>
          <a href="https://github.com/amurray101/basecamp-messy-repo" target="_blank" rel="noopener noreferrer">
            <Card style={{ cursor: 'pointer', transition: 'border-color 0.2s' }} borderColor={C.green}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: C.green, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>GitHub Repo</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, color: C.dark, marginBottom: 4 }}>Messy Repo for Hands-on Exercise</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.muted }}>Intentionally inconsistent codebase for CLAUDE.md practice</div>
            </Card>
          </a>
        </div>
      </Section>

      {/* ═══════════ DIVIDER ═══════════ */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ borderTop: `1px solid ${C.lightGray}` }} />
      </div>

      {/* ═══════════ HANDS-ON EXERCISE ═══════════ */}
      <Section>
        <SectionTitle color={C.blue}>Hands-on Exercise: Step-by-Step Walkthrough</SectionTitle>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: C.muted, marginBottom: 32, lineHeight: 1.7 }}>
          <strong>Challenge:</strong> Lumen's CTO says: "Our new hires take three weeks to get productive. Can Claude Code fix that?" Write a CLAUDE.md that captures their conventions, then use Claude to refactor their messiest utility module with tests and docs that match. Show a before/after that makes the case.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {DAY2_STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '20px 0', borderBottom: i < DAY2_STEPS.length - 1 ? `1px solid ${C.lightGray}` : 'none' }}>
              {/* Step number */}
              <div style={{
                flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
                background: step.type === 'checkpoint' ? C.blue + '15' : C.cream,
                border: `1px solid ${step.type === 'checkpoint' ? C.blue + '40' : C.lightGray}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600,
                color: step.type === 'checkpoint' ? C.blue : C.muted,
              }}>
                {step.type === 'checkpoint' ? '\u2713' : i + 1}
              </div>

              {/* Step content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 500, color: C.dark }}>{step.title}</div>
                  {step.context && (() => {
                    const s = CONTEXT_STYLES[step.context] || CONTEXT_STYLES.terminal
                    return (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 4, background: s.bg, color: s.fg, border: `1px solid ${s.border}` }}>
                        {s.label}
                      </span>
                    )
                  })()}
                  {step.timing && (
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: C.faint, background: C.faint + '15', padding: '3px 10px', borderRadius: 12 }}>
                      {step.timing}
                    </span>
                  )}
                </div>

                {step.desc && (
                  <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: C.muted, lineHeight: 1.7, margin: '0 0 8px' }}>{step.desc}</p>
                )}

                {step.commands && step.commands.map((cmd, j) => (
                  <CopyableCommand key={j} command={cmd} />
                ))}

                {step.code && (
                  <div style={{ margin: '8px 0', borderRadius: 8, overflow: 'hidden', border: '1px solid #2a2a2a', background: '#1a1a1a' }}>
                    {step.codeTitle && (
                      <div style={{ padding: '6px 14px', background: '#222', fontFamily: 'var(--mono)', fontSize: 10, color: '#888', borderBottom: '1px solid #2a2a2a' }}>{step.codeTitle}</div>
                    )}
                    <div style={{ padding: '12px 14px', fontFamily: 'var(--mono)', fontSize: 12, color: '#d4d4d4', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{step.code}</div>
                  </div>
                )}

                {step.prompt && (
                  <div style={{ margin: '8px 0', padding: '12px 16px', borderRadius: 8, background: C.blue + '08', border: `1px solid ${C.blue}20` }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: C.blue, marginBottom: 4 }}>Type this prompt</div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: C.dark, lineHeight: 1.6, fontStyle: 'italic' }}>{step.prompt}</div>
                  </div>
                )}

                {step.tip && (
                  <div style={{ margin: '8px 0 0', padding: '10px 14px', borderRadius: 6, background: C.cream, border: `1px solid ${C.lightGray}`, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: C.blue, flexShrink: 0, marginTop: 2 }}>TIP</span>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{step.tip}</span>
                  </div>
                )}

                {step.narration && (
                  <div style={{ margin: '10px 0 0', padding: '12px 16px', background: '#f0eee8', borderRadius: 8, borderLeft: `3px solid ${C.orange}` }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 1.5, color: C.orange, textTransform: 'uppercase', marginBottom: 6 }}>Facilitator script</div>
                    <p style={{ fontFamily: 'var(--serif)', fontSize: 13.5, color: C.dark, lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>{step.narration}</p>
                  </div>
                )}

                {step.keyPoint && (
                  <div style={{ margin: '8px 0 0', padding: '10px 14px', borderRadius: 6, background: C.green + '08', border: `1px solid ${C.green}20`, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: C.green, flexShrink: 0, marginTop: 2 }}>KEY POINT</span>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.5 }}>{step.keyPoint}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════ DIVIDER ═══════════ */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ borderTop: `1px solid ${C.lightGray}` }} />
      </div>

      {/* ═══════════ CLAUDE.MD BUILDER ═══════════ */}
      <Section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <SectionTitle color={C.blue}>CLAUDE.md Builder Worksheet</SectionTitle>
        </div>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: C.muted, marginBottom: 24 }}>Build your project's AI configuration. Fill in the sections below to create an effective CLAUDE.md.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          {/* Project Overview */}
          <Card>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 400, color: C.dark, margin: '0 0 12px' }}>Project Overview</h3>
            {['Project name', 'Primary language/framework', 'What does this project do? (2-3 sentences)'].map((label, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.muted, marginBottom: 4 }}>{label}:</div>
                <div style={{ borderBottom: `1.5px solid ${C.lightGray}`, minHeight: '1.6em' }} />
              </div>
            ))}
          </Card>

          {/* Architecture */}
          <Card>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 400, color: C.dark, margin: '0 0 12px' }}>Architecture</h3>
            {['Backend', 'Frontend', 'Database / ORM', 'Key directories'].map((label, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.muted, marginBottom: 4 }}>{label}:</div>
                <div style={{ borderBottom: `1.5px solid ${C.lightGray}`, minHeight: '1.6em' }} />
              </div>
            ))}
          </Card>

          {/* Conventions */}
          <Card>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 400, color: C.dark, margin: '0 0 12px' }}>Conventions</h3>
            {['Code style', 'Naming conventions', 'Test framework & location', 'Import ordering'].map((label, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.muted, marginBottom: 4 }}>{label}:</div>
                <div style={{ borderBottom: `1.5px solid ${C.lightGray}`, minHeight: '1.6em' }} />
              </div>
            ))}
          </Card>

          {/* Pre-Commit Checks */}
          <Card>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 400, color: C.dark, margin: '0 0 12px' }}>Pre-Commit Checks</h3>
            {['Linting command', 'Type checking command', 'Test command', 'Other checks'].map((label, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.muted, marginBottom: 4 }}>{label}:</div>
                <div style={{ borderBottom: `1.5px solid ${C.lightGray}`, minHeight: '1.6em' }} />
              </div>
            ))}
          </Card>

          {/* Team Notes */}
          <Card>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 400, color: C.dark, margin: '0 0 12px' }}>Team Notes</h3>
            {['Things you\'d tell a new teammate on day one', 'Common gotchas', 'Off-limits areas'].map((label, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.muted, marginBottom: 4 }}>{label}:</div>
                <div style={{ borderBottom: `1.5px solid ${C.lightGray}`, minHeight: '1.6em' }} />
              </div>
            ))}
          </Card>

          {/* Quality Checklist */}
          <Card>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 400, color: C.dark, margin: '0 0 12px' }}>Quality Checklist</h3>
            {[
              'Does your CLAUDE.md cover architecture?',
              'Are coding conventions documented?',
              'Are pre-commit checks specified?',
              'Would a new teammate find this useful?',
              'Have you tested Claude\'s output with this CLAUDE.md?',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 14, height: 14, border: `1.5px solid ${C.gray}`, borderRadius: 2, flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Monorepo Strategy */}
        <Card style={{ marginTop: 20, borderTop: `3px solid ${C.blue}` }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 400, color: C.blue, margin: '0 0 10px' }}>Monorepo Strategy</h3>
          <ul style={{ margin: 0, paddingLeft: 18, listStyle: 'disc' }}>
            <li style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.6, marginBottom: 4 }}>
              <strong>Root CLAUDE.md:</strong> shared conventions (language, testing, CI)
            </li>
            <li style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.6, marginBottom: 4 }}>
              <strong>Package CLAUDE.md files:</strong> team-specific patterns
            </li>
            <li style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.6 }}>
              <strong>Hierarchy:</strong> subdirectory files inherit from and can override root
            </li>
          </ul>
        </Card>
      </Section>

      {/* ═══════════ DIVIDER ═══════════ */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ borderTop: `1px solid ${C.lightGray}` }} />
      </div>

      {/* ═══════════ PROMPT PATTERNS CHEAT SHEET ═══════════ */}
      <Section>
        <SectionTitle color={C.blue}>Prompt Patterns for Agentic Coding</SectionTitle>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: C.muted, marginBottom: 24 }}>The art of steering multi-step workflows</p>

        {/* Agentic Prompt Anatomy */}
        <Card style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400, color: C.dark, margin: '0 0 10px' }}>Agentic Prompt Anatomy</h3>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: C.blue, fontWeight: 600, marginBottom: 12 }}>
            Formula: Outcome + Constraints + Success Criteria
          </div>
          <div style={{ background: C.bg, border: `1px solid ${C.lightGray}`, borderLeft: `3px solid ${C.blue}`, borderRadius: 4, padding: '12px 14px', fontFamily: 'var(--sans)', fontSize: 13, color: C.dark, lineHeight: 1.6, fontStyle: 'italic' }}>
            &ldquo;Refactor the auth module to use JWT <span style={{ color: C.blue, fontWeight: 600, fontStyle: 'normal' }}>[outcome]</span>. Keep the existing API contract stable <span style={{ color: C.blue, fontWeight: 600, fontStyle: 'normal' }}>[constraint]</span>. All tests pass, no new dependencies beyond jsonwebtoken <span style={{ color: C.blue, fontWeight: 600, fontStyle: 'normal' }}>[success criteria]</span>.&rdquo;
          </div>
        </Card>

        {/* Anti-Patterns */}
        <div style={{ background: '#fef6f4', border: '1px solid #e8c5bb', borderLeft: `3px solid ${C.orange}`, borderRadius: 8, padding: '16px 20px', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 400, color: C.orange, margin: '0 0 12px' }}>Anti-Patterns</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ANTI_PATTERNS.map((a, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.orange, fontWeight: 600, lineHeight: 1.5 }}>{a.bad}</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.muted, lineHeight: 1.5, paddingLeft: 12 }}>&rarr; {a.fix}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Five Proven Patterns */}
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400, color: C.dark, margin: '0 0 14px' }}>Five Proven Patterns</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PROMPT_PATTERNS.map((p) => (
            <div key={p.num} style={{ background: C.cream, border: `1px solid ${C.lightGray}`, borderLeft: `3px solid ${C.blue}`, borderRadius: 6, padding: '12px 16px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                {p.num}. {p.name}
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.6, marginBottom: 4 }}>
                <strong>Template:</strong> &ldquo;{p.template}&rdquo;
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.muted, lineHeight: 1.6, fontStyle: 'italic' }}>
                <strong style={{ fontStyle: 'normal' }}>Example:</strong> &ldquo;{p.example}&rdquo;
              </div>
            </div>
          ))}
        </div>

        {/* Context Management Commands */}
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400, color: C.dark, margin: '32px 0 14px' }}>Context Management Commands</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {CONTEXT_COMMANDS.map((c) => (
            <div key={c.cmd} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: C.cream, border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: '10px 14px' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, background: C.lightGray, borderRadius: 3, padding: '1px 6px', flexShrink: 0 }}>{c.cmd}</span>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{c.desc}</span>
            </div>
          ))}
        </div>

        {/* Session Hygiene Checklist */}
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400, color: C.dark, margin: '0 0 14px' }}>Session Hygiene Checklist</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SESSION_HYGIENE.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: C.cream, border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: '#fff', background: C.blue, borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                {i + 1}
              </div>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Key Insight */}
        <Card style={{ marginTop: 24, borderTop: `3px solid ${C.blue}` }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.blue, marginBottom: 8, fontWeight: 600 }}>Key Insight</div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: C.dark, lineHeight: 1.65, fontStyle: 'italic' }}>
            The best agentic prompts describe the destination, not the route. Give Claude the outcome you want, the constraints it must respect, and how to verify success &mdash; then let it plan the approach. You&rsquo;re the architect; Claude is the builder.
          </div>
        </Card>
      </Section>

      {/* ═══════════ DIVIDER ═══════════ */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ borderTop: `1px solid ${C.lightGray}` }} />
      </div>

      {/* ═══════════ LEARNING OUTCOMES ═══════════ */}
      <Section>
        <SectionTitle color={C.green}>Learning Outcomes by Role</SectionTitle>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: C.muted, marginBottom: 24 }}>After completing Day 2, each role should be able to:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {COMPETENCIES.map((c, i) => (
            <Card key={i} borderColor={[C.orange, C.blue, C.green, C.dark][i]}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, color: [C.orange, C.blue, C.green, C.muted][i], textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                {c.role}
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: C.dark, lineHeight: 1.6 }}>
                {c.text}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer style={{ background: C.dark, padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: C.faint, letterSpacing: 1 }}>
          Claude Code Basecamp &mdash; Day 2: Prompt Craft for Agentic Coding
        </div>
      </footer>
    </div>
  )
}
