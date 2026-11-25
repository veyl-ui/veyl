import type {ActionTask, MeetingNote} from './features-logic';

export type FeatureId = string;

export interface FeatureDefinition {
  id: FeatureId;
  indexLabel: string;
  dockLabel: string;
  title: string;
  subtitle: string;
  description: string;
  layoutStyleLabel: string;
  additionalTitle: string;
  additionalValue: string;
  additionalHint: string;
  highlights: {label: string; detail: string}[];
}

export const FEATURES: FeatureDefinition[] = [
  {
    id: 'capture',
    indexLabel: '01',
    dockLabel: 'One Shortcut',
    title: 'Instant Capture & Speaker Clarity',
    subtitle: 'Bento Live Capture Suite',
    description:
      'Start recording from any single key without opening a meeting bot or extra window. Audio hooks directly into macOS CoreAudio across every call app and resolves voices automatically.',
    layoutStyleLabel: '3-Card Live Bento Grid',
    additionalTitle: 'Zero-bot capture engine',
    additionalValue: '12 ms audio latency',
    additionalHint: 'Click any Bento card below to test shortcuts, switch apps, or isolate speakers.',
    highlights: [
      {label: 'Global Trigger', detail: 'Single key or custom chord'},
      {label: 'App Agnostic', detail: 'Meet, Zoom, Discord, Slack'},
    ],
  },
  {
    id: 'actions',
    indexLabel: '02',
    dockLabel: 'Task Ownership',
    title: 'Decisions & Tasks with Real Owners',
    subtitle: 'Transcript-to-Action Split View',
    description:
      'Every commitment spoken on a call is extracted inline with its exact timestamp, linked back to the transcript quote, and assigned to a teammate with a clear due date.',
    layoutStyleLabel: 'Synchronized Split Execution Board',
    additionalTitle: 'Traceable accountability',
    additionalValue: '1-click source jump',
    additionalHint: 'Click any task or check it off to jump straight to the spoken commitment.',
    highlights: [
      {label: 'Context Anchored', detail: 'Exact MM:SS quote reference'},
      {label: 'Owner Mapping', detail: 'Matched via attendee roster'},
    ],
  },
  {
    id: 'privacy',
    indexLabel: '03',
    dockLabel: 'Local Vault',
    title: 'Private by Default, On Your Silicon',
    subtitle: 'On-Device Processing Architecture',
    description:
      'Your audio, transcription, and semantic index never touch an external training server. Everything computes locally on Apple Silicon inside an encrypted vault until you choose to share.',
    layoutStyleLabel: 'Architectural Data-Flow Schematic',
    additionalTitle: 'Air-gapped storage',
    additionalValue: '0 bytes uploaded',
    additionalHint: 'Toggle sharing mode inside the diagram to inspect the local encryption boundary.',
    highlights: [
      {label: 'Vault Encryption', detail: 'AES-256 local SQLite store'},
      {label: 'Zero Telemetry', detail: 'No cloud bots join your calls'},
    ],
  },
  {
    id: 'search',
    indexLabel: '04',
    dockLabel: 'Instant Recall',
    title: 'Search Every Decision in 0.2 Seconds',
    subtitle: 'Spotlight Command & Context Drawer',
    description:
      'Find a specific launch date, budget figure, or design decision across hundreds of past conversations instantaneously—ranked by semantic meaning and exact phrase.',
    layoutStyleLabel: 'Spotlight Command Palette + Preview',
    additionalTitle: 'Local vector index',
    additionalValue: '14,200 segments indexed',
    additionalHint: 'Type your own query or select a preset prompt to filter live notes.',
    highlights: [
      {label: 'Sub-second Recall', detail: 'Instant local full-text + semantic'},
      {label: 'Quote Jump', detail: 'Inspect surrounding speaker context'},
    ],
  },
  {
    id: 'calendar',
    indexLabel: '05',
    dockLabel: 'Agenda Briefs',
    title: 'Prepared Before Every Call Starts',
    subtitle: 'Timeline & Pre-Meeting Dossier',
    description:
      'Two minutes before a meeting begins, Cadence surfaces unresolved tasks from your last session with those exact participants so nobody wastes time recapping.',
    layoutStyleLabel: 'Chronological Agenda & Dossier Stack',
    additionalTitle: 'Calendar sync',
    additionalValue: 'iCal & Google Calendar',
    additionalHint: 'Select any time block on the left timeline to inspect its pre-call dossier.',
    highlights: [
      {label: 'Carry-over Threads', detail: 'Unfinished tasks surfaced automatically'},
      {label: 'Participant History', detail: 'Last spoken decisions per person'},
    ],
  },
  {
    id: 'digest',
    indexLabel: '06',
    dockLabel: 'Team Export',
    title: 'Ship Clean Summaries Anywhere',
    subtitle: 'Multi-Format Publishing Canvas',
    description:
      'Transform raw transcripts into structured release notes, Linear issues, Slack standup recaps, or clean Markdown without rewriting a single bullet by hand.',
    layoutStyleLabel: 'Live Morphing Output Studio',
    additionalTitle: 'Structured handoff',
    additionalValue: '4 native formats',
    additionalHint: 'Switch target formats on the right and copy the generated brief.',
    highlights: [
      {label: 'Clean Markdown', detail: 'Zero-fluff headings and owners'},
      {label: 'Direct Handoff', detail: 'Slack, Linear, Notion, Clipboard'},
    ],
  },
];

export const CONNECTED_APPS = [
  {id: 'meet', name: 'Google Meet', color: '#22C55E', short: 'GM'},
  {id: 'webex', name: 'Webex', color: '#38BDF8', short: 'WX'},
  {id: 'discord', name: 'Discord', color: '#818CF8', short: 'DC'},
  {id: 'whatsapp', name: 'WhatsApp', color: '#34D399', short: 'WA'},
  {id: 'signal', name: 'Signal', color: '#60A5FA', short: 'SG'},
  {id: 'slack', name: 'Slack Huddle', color: '#F59E0B', short: 'SL'},
];

export const SPEAKERS_DATA = [
  {
    id: 'sp1',
    rawLabel: 'Speaker 1',
    name: 'Dana Ruiz',
    role: 'Product Lead',
    initials: 'DR',
    color: '#F97316',
    sampleQuote: 'Let us lock the v2.4 launch date for Thursday morning.',
    talkShare: 44,
  },
  {
    id: 'sp2',
    rawLabel: 'Speaker 2',
    name: 'Priya Nair',
    role: 'Staff Engineer',
    initials: 'PN',
    color: '#38BDF8',
    sampleQuote: 'Local indexing benchmarks hit 180 ms across 10k transcripts.',
    talkShare: 34,
  },
  {
    id: 'sp3',
    rawLabel: 'Speaker 3',
    name: 'Sam Okafor',
    role: 'Design Systems',
    initials: 'SO',
    color: '#A78BFA',
    sampleQuote: 'Dock spring physics and keyboard focus states are ready for QA.',
    talkShare: 22,
  },
];

export const INITIAL_TASKS: ActionTask[] = [
  {
    id: 't1',
    title: 'Send the recap to the team',
    owner: 'Dana',
    initials: 'DR',
    due: 'due today',
    timestamp: '14:59',
    done: true,
    quote: 'Dana: I will send the recap out right after we wrap up.',
    accentColor: '#F97316',
  },
  {
    id: 't2',
    title: 'Share the draft roadmap',
    owner: 'Priya',
    initials: 'PN',
    due: 'due Thu',
    timestamp: '22:40',
    done: true,
    quote: 'Priya: I can share the draft Q4 roadmap before Thursday standup.',
    accentColor: '#38BDF8',
  },
  {
    id: 't3',
    title: 'Book the design review',
    owner: 'Sam',
    initials: 'SO',
    due: 'due Mon',
    timestamp: '30:05',
    done: false,
    quote: 'Sam: Let me book a 45-minute design review for Monday morning.',
    accentColor: '#A78BFA',
  },
];

export const MEETING_NOTES: MeetingNote[] = [
  {
    id: 'n1',
    title: 'Product sync',
    date: 'Aug 18',
    duration: '34m',
    snippet: 'Finalised the launch date for the new onboarding flow and confirmed telemetry checks.',
    highlightTerm: 'launch date',
    participants: ['Dana Ruiz', 'Priya Nair'],
    matchCount: 14,
  },
  {
    id: 'n2',
    title: 'Engineering architecture',
    date: 'Aug 16',
    duration: '48m',
    snippet: 'Target launch date is the 28th pending final regression pass on CoreAudio buffers.',
    highlightTerm: 'launch date',
    participants: ['Priya Nair', 'Sam Okafor'],
    matchCount: 9,
  },
  {
    id: 'n3',
    title: 'Team standup',
    date: 'Aug 20',
    duration: '15m',
    snippet: 'Confirmed the Q4 launch checklist and budget allocation with finance lead.',
    highlightTerm: 'budget',
    participants: ['Dana Ruiz', 'Sam Okafor'],
    matchCount: 6,
  },
  {
    id: 'n4',
    title: 'Marketing review',
    date: 'Aug 22',
    duration: '29m',
    snippet: 'Press embargo lifts on the launch date at 09:00 PST with interactive Mac demo.',
    highlightTerm: 'launch date',
    participants: ['Dana Ruiz', 'Maya Chen'],
    matchCount: 9,
  },
  {
    id: 'n5',
    title: 'Design critique',
    date: 'Aug 24',
    duration: '40m',
    snippet: 'Refined macOS dock spring curve and latency budget under 16ms per frame.',
    highlightTerm: 'latency',
    participants: ['Sam Okafor', 'Dana Ruiz'],
    matchCount: 5,
  },
];

export const CALENDAR_SLOTS = [
  {
    id: 'c1',
    time: '09:30',
    title: 'Design Systems Critique',
    app: 'Google Meet',
    attendees: ['Sam Okafor', 'Dana Ruiz'],
    lastMet: '6 days ago',
    carryOver: 'Finalize macOS dock tooltip elevation and reduce border contrast.',
    decisions: ['Adopt #09090B studio obsidian canvas', 'Use tabular numerals on all timers'],
  },
  {
    id: 'c2',
    time: '11:00',
    title: 'CoreAudio Engine Sync',
    app: 'Zoom',
    attendees: ['Priya Nair', 'Alex Kim'],
    lastMet: '2 days ago',
    carryOver: 'Verify 48kHz loopback capture stability on macOS Sequoia.',
    decisions: ['Buffer ring size locked at 512 samples', 'Zero-copy VAD filter enabled'],
  },
  {
    id: 'c3',
    time: '14:30',
    title: 'Enterprise Pilot Check-in',
    app: 'Webex',
    attendees: ['Dana Ruiz', 'Claire Vance'],
    lastMet: '14 days ago',
    carryOver: 'Confirm air-gapped vault compliance sign-off with security team.',
    decisions: ['Disable outbound telemetry by default', 'Provide signed SHA-256 export'],
  },
];

export const EXPORT_FORMATS = [
  {
    id: 'markdown',
    label: 'Markdown',
    filename: 'product-sync-aug-18.md',
    content: `# Product Sync — Aug 18 (34m)

## Key Decisions
- Locked **v2.4 launch date** for Thursday at 09:00 PST
- Confirmed local SQLite encryption passes security audit

## Action Items
- [x] **Dana Ruiz**: Send recap to team (14:59)
- [x] **Priya Nair**: Share draft Q4 roadmap (22:40)
- [ ] **Sam Okafor**: Book design review for Monday (30:05)`,
  },
  {
    id: 'linear',
    label: 'Linear',
    filename: 'CAD-412 · Batch Issues',
    content: `ISSUE CAD-412 · Priority: High
Title: Finalize v2.4 launch checklist & embargo notes
Assignee: @dana-ruiz · Due: Today
Source: Product Sync @ 14:59

ISSUE CAD-413 · Priority: Medium
Title: Publish Q4 CoreAudio roadmap draft
Assignee: @priya-nair · Due: Thursday
Source: Product Sync @ 22:40

ISSUE CAD-414 · Priority: Medium
Title: Schedule Monday design systems review
Assignee: @sam-okafor · Due: Monday`,
  },
  {
    id: 'slack',
    label: 'Slack',
    filename: '#product-launches',
    content: `*Recap: Product Sync (34m)*
Participants: Dana Ruiz, Priya Nair, Sam Okafor

*Decisions*
• Launch date locked for Thursday 09:00 PST
• Local search latency verified at 0.2s across 14k segments

*Next Steps*
• @priya — Draft roadmap by Thu
• @sam — Design review invite for Mon`,
  },
  {
    id: 'notion',
    label: 'Notion',
    filename: 'Meetings DB / Aug 18',
    content: `Database: Weekly Product Reviews
Status: Ready for Review  |  Privacy: Local Vault Only

Summary
Team aligned on Thursday launch window. CoreAudio loopback
capture passed 48kHz stability testing with zero dropped frames.

Linked Tasks (3)
1. Send team recap — Done (Dana)
2. Share draft roadmap — Done (Priya)
3. Book design review — Pending (Sam)`,
  },
] as const;