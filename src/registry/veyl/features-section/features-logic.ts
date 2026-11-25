export interface MeetingNote {
  id: string;
  title: string;
  date: string;
  duration: string;
  snippet: string;
  highlightTerm: string;
  participants: string[];
  matchCount: number;
}

export interface ActionTask {
  id: string;
  title: string;
  owner: string;
  initials: string;
  due: string;
  timestamp: string;
  done: boolean;
  quote: string;
  accentColor: string;
}

/**
 * Computes smooth macOS-style magnification scale for a dock item based on
 * cursor distance in pixels.
 */
export function calculateDockScale(
  distancePx: number | null,
  maxDistancePx = 140,
  peakScale = 1.42
): number {
  if (distancePx === null || !Number.isFinite(distancePx)) {
    return 1;
  }
  const absDist = Math.abs(distancePx);
  if (absDist >= maxDistancePx) {
    return 1;
  }
  // Cosine falloff creates a smooth, natural macOS dock bell curve
  const normalized = absDist / maxDistancePx;
  const weight = (Math.cos(normalized * Math.PI) + 1) / 2;
  return Number((1 + (peakScale - 1) * weight).toFixed(3));
}

/**
 * Computes vertical lift offset (negative Y in px) proportional to dock scale.
 */
export function calculateDockLift(scale: number, maxLiftPx = 14): number {
  if (scale <= 1) return 0;
  const progress = Math.min(1, (scale - 1) / 0.42);
  return Number((-progress * maxLiftPx).toFixed(2));
}

/**
 * Computes isolated dock item transform so hovering a single item only
 * magnifies that item and never leaks hover scale to adjacent items.
 */
export function getIsolatedDockTransform(
  isHovered: boolean,
  isActive: boolean
): {scale: number; y: number} {
  if (isHovered) {
    return {scale: 1.32, y: -13};
  }
  if (isActive) {
    return {scale: 1.08, y: -3};
  }
  return {scale: 1, y: 0};
}

/**
 * Filters meeting notes by case-insensitive substring query across title,
 * snippet, or participants.
 */
export function filterMeetingNotes(
  notes: readonly MeetingNote[],
  query: string
): MeetingNote[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return [...notes];
  }
  return notes.filter((note) => {
    const inTitle = note.title.toLowerCase().includes(trimmed);
    const inSnippet = note.snippet.toLowerCase().includes(trimmed);
    const inParticipants = note.participants.some((p) =>
      p.toLowerCase().includes(trimmed)
    );
    return inTitle || inSnippet || inParticipants;
  });
}

/**
 * Computes completion count and percentage for action items.
 */
export function getTaskProgress(tasks: readonly ActionTask[]): {
  done: number;
  total: number;
  percent: number;
} {
  const total = tasks.length;
  if (total === 0) {
    return {done: 0, total: 0, percent: 0};
  }
  const done = tasks.filter((t) => t.done).length;
  return {
    done,
    total,
    percent: Math.round((done / total) * 100),
  };
}

/**
 * Wraps index navigation cleanly for next/previous feature controls.
 */
export function stepFeatureIndex(
  currentIndex: number,
  delta: number,
  total: number
): number {
  if (total <= 0) return 0;
  return (((currentIndex + delta) % total) + total) % total;
}

/**
 * Formats elapsed recording seconds as MM:SS.
 */
export function formatElapsedSeconds(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}