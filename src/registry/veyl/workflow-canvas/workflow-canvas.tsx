"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import "./workflow-canvas.css";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type FlowNode = {
  id: string;
  /** The name shown under the box. */
  label: string;
  /** Where the box starts, as its centre, in canvas units (see `width` and `height`). */
  x: number;
  y: number;
  /** A built-in icon name, or your own element. */
  icon?: FlowIconName | ReactNode;
  /** "step" is a small square box. "agent" is a wide box. "tool" is a round box that hangs under an agent. */
  kind?: "step" | "agent" | "tool";
  /** Box width in canvas units. Default 54, or 138 for an agent. */
  width?: number;
  /** Icon colour. */
  tint?: string;
  /** Start hidden. A "reveal" step shows it. */
  hidden?: boolean;
};

export type FlowEdge = {
  from: string;
  to: string;
  /** The colour of this wire. By default the wires take turns through the `colors` list. */
  color?: string;
};

export type FlowStep =
  | {
      type: "connect";
      from: string;
      to: string;
      /** Wires that draw themselves once the visitor has made this one. */
      then?: Array<[from: string, to: string]>;
    }
  | {
      type: "reveal";
      /** Boxes that appear when the visitor clicks the + button. */
      nodes: string[];
      /** Where the + button sits, in canvas units. */
      at: { x: number; y: number };
    };

export type WorkflowCanvasProps = {
  /** A heading above the canvas. Left out, no heading is shown. */
  title?: ReactNode;
  /** A line under the heading. */
  description?: ReactNode;
  nodes: FlowNode[];
  edges: FlowEdge[];
  /**
   * The order things happen in: the visitor makes a connection, wires follow on their own up to
   * a checkpoint, the visitor clicks "+", more boxes appear, and so on.
   * Left out, the whole graph is already connected and the boxes can only be moved.
   */
  steps?: FlowStep[];
  /** Canvas size in canvas units. Everything scales to fit. Default 1160 x 440. */
  width?: number;
  height?: number;
  /** The colours wires take turns through. */
  colors?: string[];
  /** After a few idle seconds, a cursor shows how to make the next step. Default true. */
  demo?: boolean;
  /** Start over after the last step. Default true. */
  loop?: boolean;
  /** The canvas never scales below this, and scrolls sideways instead. Default 0.55. */
  minScale?: number;
  /** Follow the site's dark mode (the default), or force one look for this block. */
  theme?: "light" | "dark";
  className?: string;
};

/* ------------------------------------------------------------------ */
/* Icons: small hand-drawn line icons, no brand logos                  */
/* ------------------------------------------------------------------ */

export const flowIcons = {
  webhook: (
    <>
      <circle cx="12" cy="6" r="2.6" />
      <circle cx="5.5" cy="17" r="2.6" />
      <circle cx="18.5" cy="17" r="2.6" />
      <path d="M11 8.4 6.8 14.6M8.2 17h7.6M13 8.4l4.3 6.2" />
    </>
  ),
  db: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </>
  ),
  bot: (
    <>
      <rect x="5" y="8" width="14" height="10" rx="3.2" />
      <circle cx="12" cy="4.4" r="1.2" />
      <path d="M12 5.6V8M9.5 13h.01M14.5 13h.01M3 12v3M21 12v3" />
    </>
  ),
  braces: (
    <path d="M9 4C7 4 6.5 5 6.5 7v2c0 1.2-.7 2-2 3 1.3 1 2 1.8 2 3v2c0 2 .5 3 2.5 3M15 4c2 0 2.5 1 2.5 3v2c0 1.2.7 2 2 3-1.3 1-2 1.8-2 3v2c0 2-.5 3-2.5 3" />
  ),
  chat: <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />,
  spark: (
    <>
      <path d="M12 3l2 5.5L19.5 10 14 12l-2 5.5L10 12 4.5 10 10 8.5z" />
      <path d="M19 17v4M17 19h4" />
    </>
  ),
  book: <path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4zM5 17a3 3 0 0 1 3-3h10" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M16 5a3.2 3.2 0 0 1 0 6M18 14c2 .8 3 2.8 3 6" />
    </>
  ),
  split: <path d="M4 12h6M10 12c3 0 3-6 7-6h3M10 12c3 0 3 6 7 6h3M17 3l3 3-3 3M17 15l3 3-3 3" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
  bell: <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0" />,
  bolt: <path d="M13 3 5 13h6l-1 8 8-10h-6z" />,
} satisfies Record<string, ReactNode>;

export type FlowIconName = keyof typeof flowIcons;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const PALETTE = ["#e9b95e", "#5b9cff", "#a78bfa", "#3ecf8e", "#ff8fa8", "#fb923c"];
const NODE_H = 54;

type Pt = { x: number; y: number };
type Hint =
  | { kind: "connect"; from: string; to: string }
  | { kind: "plus"; at: Pt }
  | null;
type Pending =
  | { kind: "connect"; step: Extract<FlowStep, { type: "connect" }>; resolve: () => void }
  | { kind: "reveal"; step: Extract<FlowStep, { type: "reveal" }>; resolve: () => void };
type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;
type Drag = { kind: "link"; from: string } | { kind: "move"; id: string; dx: number; dy: number } | null;

const nodeW = (n: FlowNode) => n.width ?? (n.kind === "agent" ? 138 : 54);

function curve(x1: number, y1: number, x2: number, y2: number) {
  const k = Math.max(50, Math.abs(x2 - x1) * 0.5);
  return `M${x1} ${y1} C${x1 + k} ${y1} ${x2 - k} ${y2} ${x2} ${y2}`;
}
function drop(x1: number, y1: number, x2: number, y2: number) {
  const k = Math.max(40, Math.abs(y2 - y1) * 0.5);
  return `M${x1} ${y1} C${x1} ${y1 + k} ${x2} ${y2 - k} ${x2} ${y2}`;
}

/** Spells a label out letter by letter when a box appears. */
function TypedLabel({ text, shown, typed }: { text: string; shown: boolean; typed: boolean }) {
  const [n, setN] = useState(typed ? 0 : text.length);
  useEffect(() => {
    if (!typed) return;
    if (!shown) {
      setN(0);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) window.clearInterval(id);
    }, 26);
    return () => window.clearInterval(id);
  }, [typed, shown, text]);
  return <>{text.slice(0, n)}</>;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function WorkflowCanvas({
  title,
  description,
  nodes,
  edges,
  steps,
  width = 1160,
  height = 440,
  colors = PALETTE,
  demo = true,
  loop = true,
  minScale = 0.55,
  theme,
  className,
}: WorkflowCanvasProps) {
  const uid = useId().replace(/:/g, "");
  const interactive = !!steps?.length;

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const edgeList = useMemo(
    () =>
      edges.map((e, i) => ({
        ...e,
        key: `${e.from}>${e.to}`,
        color: e.color ?? colors[i % colors.length],
      })),
    [edges, colors],
  );
  const edgeByKey = useMemo(() => new Map(edgeList.map((e) => [e.key, e])), [edgeList]);

  /* The latest props, for the timers that outlive a render. */
  const P = useRef({ nodes, edgeList, steps, demo, loop, width, height });
  P.current = { nodes, edgeList, steps, demo, loop, width, height };

  const [pos, setPos] = useState<Record<string, Pt>>(() =>
    Object.fromEntries(nodes.map((n) => [n.id, { x: n.x, y: n.y }])),
  );
  const [shown, setShown] = useState<Set<string>>(
    () => new Set(nodes.filter((n) => !n.hidden || !interactive).map((n) => n.id)),
  );
  const [ghost, setGhost] = useState<Set<string>>(() => new Set());
  const [live, setLive] = useState<string[]>(() => (interactive ? [] : edgeList.map((e) => e.key)));
  const [hint, setHint] = useState<Hint>(null);
  const [link, setLink] = useState<{ from: string; x: number; y: number; hit: string | null; color: string } | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [shake, setShake] = useState<string | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number; show: boolean; click: boolean; snap: boolean }>({
    x: 0,
    y: 0,
    show: false,
    click: false,
    snap: true,
  });
  const [scale, setScale] = useState(1);

  const posRef = useRef(pos);
  posRef.current = pos;
  const shownRef = useRef(shown);
  shownRef.current = shown;
  const pend = useRef<Pending | null>(null);
  const drag = useRef<Drag>(null);
  const api = useRef({ arm: () => {}, cancel: () => {}, resolve: () => {} });
  const inView = useRef(true);
  const rootRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(1);
  scaleRef.current = scale;

  /* Scale the canvas to the space it has. Below `minScale` it scrolls sideways instead. */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const fit = () => setScale(Math.max(minScale, el.clientWidth / width));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, minScale]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* On a narrow screen the canvas scrolls sideways, so bring the next thing to do into view. */
  const hintX = hint?.kind === "plus" ? hint.at.x : hint?.kind === "connect" ? pos[hint.from]?.x : undefined;
  const hintKey = hint ? (hint.kind === "plus" ? "plus" : `${hint.from}>${hint.to}`) : "";
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || hintX === undefined || el.scrollWidth <= el.clientWidth + 1) return;
    el.scrollTo({ left: Math.max(0, hintX * scaleRef.current - el.clientWidth / 2), behavior: "smooth" });
    // only when the hint changes, never while a box is being dragged
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hintKey]);

  /* Which colour each box glows. The wire that touched it last decides. */
  const glow = useMemo(() => {
    const g: Record<string, { color: string; count: number }> = {};
    for (const key of live) {
      const e = edgeByKey.get(key);
      if (!e) continue;
      for (const id of [e.from, e.to]) g[id] = { color: e.color, count: (g[id]?.count ?? 0) + 1 };
    }
    return g;
  }, [live, edgeByKey]);

  const worldPoint = (e: { clientX: number; clientY: number }): Pt => {
    const r = stageRef.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) / scaleRef.current, y: (e.clientY - r.top) / scaleRef.current };
  };

  const hitNode = useCallback((x: number, y: number, except?: string) => {
    for (const n of P.current.nodes) {
      if (n.id === except || n.kind === "tool" || !shownRef.current.has(n.id)) continue;
      const p = posRef.current[n.id];
      if (Math.abs(x - p.x) < nodeW(n) / 2 + 16 && Math.abs(y - p.y) < NODE_H / 2 + 16) return n.id;
    }
    return null;
  }, []);

  /* ---------------------------------------------------------------- */
  /* The story: the visitor connects, the wires follow to a checkpoint */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const cfg = P.current;
    if (!cfg.steps?.length) return;

    const startPos = () => Object.fromEntries(cfg.nodes.map((n) => [n.id, { x: n.x, y: n.y }]));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPos(startPos());
      setShown(new Set(cfg.nodes.map((n) => n.id)));
      setLive(cfg.edgeList.map((e) => e.key));
      return;
    }

    let alive = true;
    let idleT = 0;
    let demoTok = 0;
    const timers = new Set<number>();
    const sleep = (ms: number) =>
      new Promise<void>((r) => {
        const t = window.setTimeout(() => {
          timers.delete(t);
          r();
        }, ms);
        timers.add(t);
      });
    const gate = async () => {
      while (alive && (!inView.current || document.hidden)) await sleep(400);
    };
    const draw = (a: string, b: string) =>
      setLive((l) => (l.includes(`${a}>${b}`) || !P.current.edgeList.some((e) => e.key === `${a}>${b}`) ? l : [...l, `${a}>${b}`]));

    const reset = () => {
      setPos(startPos());
      setShown(new Set(cfg.nodes.filter((n) => !n.hidden).map((n) => n.id)));
      setGhost(new Set());
      setLive([]);
      setHint(null);
      setLink(null);
    };

    const accept = () => {
      const p = pend.current;
      if (!p) return;
      pend.current = null;
      clearTimeout(idleT);
      setHint(null);
      setLink(null);
      setCursor((c) => ({ ...c, show: false, click: false, snap: false }));
      p.resolve();
    };

    const waitFor = (p: DistributiveOmit<Pending, "resolve">) =>
      new Promise<void>((resolve) => {
        pend.current = { ...p, resolve } as Pending;
        if (p.kind === "connect") setHint({ kind: "connect", from: p.step.from, to: p.step.to });
        else setHint({ kind: "plus", at: p.step.at });
        arm();
      });

    /* A few idle seconds in, a cursor shows how. Touching the canvas cancels it. */
    const arm = () => {
      clearTimeout(idleT);
      if (!P.current.demo) return;
      idleT = window.setTimeout(() => {
        if (!alive || !pend.current || drag.current) return;
        if (!inView.current || document.hidden) return arm();
        void runDemo();
      }, 4200);
    };
    const cancel = () => {
      demoTok += 1;
      clearTimeout(idleT);
      setCursor((c) => ({ ...c, show: false, click: false, snap: false }));
      setLink((l) => (drag.current ? l : null));
    };

    const glide = (from: Pt, to: Pt, ms: number, each: (p: Pt) => void, tok: number) =>
      new Promise<boolean>((res) => {
        const t0 = performance.now();
        const frame = (t: number) => {
          if (tok !== demoTok || !alive) return res(false);
          const k = Math.min(1, (t - t0) / ms);
          const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          each({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e });
          if (k < 1) requestAnimationFrame(frame);
          else res(true);
        };
        requestAnimationFrame(frame);
      });

    const runDemo = async () => {
      const tok = ++demoTok;
      const p = pend.current;
      if (!p) return;
      const rest = { x: cfg.width - 60, y: cfg.height - 40 };
      setCursor({ ...rest, show: true, click: false, snap: true });
      await sleep(40);
      if (tok !== demoTok) return;

      if (p.kind === "reveal") {
        setCursor({ x: p.step.at.x + 4, y: p.step.at.y + 4, show: true, click: false, snap: false });
        await sleep(1150);
        if (tok !== demoTok) return;
        setCursor((c) => ({ ...c, click: true }));
        await sleep(170);
        if (tok === demoTok && pend.current === p) accept();
        return;
      }

      const { from, to } = p.step;
      const nf = P.current.nodes.find((n) => n.id === from)!;
      const src = { x: posRef.current[from].x + nodeW(nf) / 2, y: posRef.current[from].y };
      const dst = posRef.current[to];
      const color = P.current.edgeList.find((e) => e.key === `${from}>${to}`)?.color ?? PALETTE[0];
      setCursor({ x: src.x, y: src.y, show: true, click: false, snap: false });
      await sleep(1100);
      if (tok !== demoTok) return;
      setCursor({ x: src.x, y: src.y, show: true, click: true, snap: false });
      setLink({ from, x: src.x, y: src.y, hit: null, color });
      await sleep(150);
      const ok = await glide(
        src,
        dst,
        1000,
        (q) => {
          setCursor({ x: q.x, y: q.y, show: true, click: true, snap: true });
          setLink({ from, x: q.x, y: q.y, hit: hitNode(q.x, q.y, from), color });
        },
        tok,
      );
      if (!ok) return;
      await sleep(120);
      if (tok === demoTok && pend.current === p) accept();
    };

    api.current = { arm, cancel, resolve: accept };

    const run = async () => {
      await sleep(600);
      while (alive) {
        reset();
        await sleep(500);
        for (const st of cfg.steps!) {
          if (!alive) return;
          if (st.type === "connect") {
            await waitFor({ kind: "connect", step: st });
            if (!alive) return;
            draw(st.from, st.to);
            await sleep(450);
            let prev = st.from;
            for (const [a, b] of st.then ?? []) {
              if (a !== prev) await sleep(260);
              draw(a, b);
              prev = a;
            }
            await sleep(600);
          } else {
            await waitFor({ kind: "reveal", step: st });
            if (!alive) return;
            await sleep(150);
            setGhost(new Set(st.nodes));
            await sleep(380);
            for (const id of st.nodes) {
              setShown((s) => new Set(s).add(id));
              setGhost((g) => {
                const n = new Set(g);
                n.delete(id);
                return n;
              });
              await sleep(130);
            }
            await sleep(750);
          }
        }
        if (!P.current.loop) return;
        await sleep(3200);
        while (alive && (drag.current || !inView.current || document.hidden)) await sleep(400);
        await gate();
      }
    };
    void run();

    return () => {
      alive = false;
      timers.forEach((t) => window.clearTimeout(t));
      clearTimeout(idleT);
      pend.current = null;
      api.current = { arm: () => {}, cancel: () => {}, resolve: () => {} };
    };
  }, [hitNode]);

  /* ---------------------------------------------------------------- */
  /* Pointer: drag a box to move it, drag from a dot to connect        */
  /* ---------------------------------------------------------------- */
  const startMove = (e: ReactPointerEvent, id: string) => {
    if (e.button !== 0) return;
    api.current.cancel();
    const w = worldPoint(e);
    const p = posRef.current[id];
    drag.current = { kind: "move", id, dx: w.x - p.x, dy: w.y - p.y };
    setMovingId(id);
    stageRef.current?.setPointerCapture(e.pointerId);
  };
  const startLink = (e: ReactPointerEvent, id: string) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    api.current.cancel();
    const p = pend.current;
    if (!p || p.kind !== "connect") {
      api.current.arm();
      return;
    }
    const w = worldPoint(e);
    const color = edgeByKey.get(`${p.step.from}>${p.step.to}`)?.color ?? PALETTE[0];
    drag.current = { kind: "link", from: id };
    setLink({ from: id, x: w.x, y: w.y, hit: null, color });
    stageRef.current?.setPointerCapture(e.pointerId);
  };
  const onMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const w = worldPoint(e);
    if (d.kind === "move") {
      const n = nodeMap.get(d.id)!;
      const hw = nodeW(n) / 2;
      const next = {
        x: Math.min(width - hw - 14, Math.max(hw + 14, w.x - d.dx)),
        y: Math.min(height - 46, Math.max(NODE_H / 2 + 10, w.y - d.dy)),
      };
      posRef.current = { ...posRef.current, [d.id]: next };
      setPos(posRef.current);
    } else {
      setLink((l) => (l ? { ...l, x: w.x, y: w.y, hit: hitNode(w.x, w.y, d.from) } : l));
    }
  };
  const onUp = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (stageRef.current?.hasPointerCapture(e.pointerId)) stageRef.current.releasePointerCapture(e.pointerId);
    if (d.kind === "move") {
      setMovingId(null);
      api.current.arm();
      return;
    }
    const w = worldPoint(e);
    const hit = hitNode(w.x, w.y, d.from);
    const p = pend.current;
    if (p?.kind === "connect" && p.step.from === d.from && p.step.to === hit) {
      api.current.resolve();
    } else {
      setLink(null);
      if (hit) {
        setShake(hit);
        window.setTimeout(() => setShake(null), 400);
      }
      api.current.arm();
    }
  };

  /* ---------------------------------------------------------------- */
  /* Geometry                                                          */
  /* ---------------------------------------------------------------- */
  const out = (id: string, dx = 0): Pt => {
    const n = nodeMap.get(id)!;
    const p = pos[id];
    return n.kind === "tool" ? { x: p.x, y: p.y - NODE_H / 2 } : { x: p.x + nodeW(n) / 2 + dx, y: p.y };
  };
  const inn = (id: string): Pt => {
    const n = nodeMap.get(id)!;
    const p = pos[id];
    return n.kind === "tool" ? { x: p.x, y: p.y - NODE_H / 2 } : { x: p.x - nodeW(n) / 2, y: p.y };
  };

  const wires = live
    .map((key) => edgeByKey.get(key))
    .filter((e): e is NonNullable<typeof e> => !!e && !!pos[e.from] && !!pos[e.to])
    .map((e) => {
      const to = nodeMap.get(e.to)!;
      let a: Pt, b: Pt, d: string;
      if (to.kind === "tool") {
        /* tool wires leave the bottom of the agent, spread out so they don't pile up */
        const sibs = edgeList.filter((x) => x.from === e.from && nodeMap.get(x.to)?.kind === "tool");
        const i = sibs.findIndex((x) => x.key === e.key);
        const from = nodeMap.get(e.from)!;
        const spread = Math.min(32, (nodeW(from) - 30) / Math.max(1, sibs.length - 1));
        a = { x: pos[e.from].x + (i - (sibs.length - 1) / 2) * spread, y: pos[e.from].y + NODE_H / 2 };
        b = inn(e.to);
        d = drop(a.x, a.y, b.x, b.y);
      } else {
        a = out(e.from);
        b = inn(e.to);
        d = curve(a.x, a.y, b.x, b.y);
      }
      return { ...e, a, b, d };
    });

  const linkPath = (() => {
    if (!link) return null;
    const a = out(link.from);
    return { d: curve(a.x, a.y, link.x, link.y), a };
  })();

  /* The next wire's colour tints the hint dots, the chip and the cursor. */
  const hintColor =
    (hint?.kind === "connect" ? edgeByKey.get(`${hint.from}>${hint.to}`)?.color : undefined) ?? colors[0] ?? PALETTE[0];
  const hintStyle = { "--wc": hintColor } as CSSProperties;

  const stageStyle = { width: width * scale, height: height * scale, "--wfc-s": scale } as CSSProperties;

  return (
    <section
      ref={rootRef}
      className={cn("wfc", className)}
      data-theme={theme}
      aria-label="Workflow canvas"
    >
      {(title || description) && (
        <header className="wfc-head">
          {title && <h2 className="wfc-title">{title}</h2>}
          {description && <p className="wfc-desc">{description}</p>}
        </header>
      )}

      <div className="wfc-scroll" ref={scrollRef}>
        <div
          ref={stageRef}
          className="wfc-stage"
          style={stageStyle}
          onPointerDown={() => api.current.cancel()}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <div className="wfc-world" style={{ width, height, transform: `scale(${scale})` }}>
            {/* wires, under the boxes */}
            <svg className="wfc-svg" width={width} height={height} aria-hidden="true">
              <defs>
                <filter id={`${uid}-b`} filterUnits="userSpaceOnUse" x={-60} y={-60} width={width + 120} height={height + 120}>
                  <feGaussianBlur stdDeviation="4" />
                </filter>
              </defs>
              {wires.map((w) => (
                <g key={w.key} style={{ "--wc": w.color } as CSSProperties}>
                  <path className="wfc-glow" d={w.d} pathLength={1} filter={`url(#${uid}-b)`} />
                  <path className="wfc-wire" d={w.d} pathLength={1} />
                  <path className="wfc-flow" d={w.d} />
                </g>
              ))}
              {link && linkPath && (
                <g style={{ "--wc": link.color } as CSSProperties}>
                  <path className="wfc-glow wfc-glow--live" d={linkPath.d} filter={`url(#${uid}-b)`} />
                  <path className="wfc-wire wfc-wire--live" d={linkPath.d} />
                </g>
              )}
            </svg>

            {/* boxes */}
            {nodes.map((n) => {
              const p = pos[n.id];
              const w = nodeW(n);
              const g = glow[n.id];
              const isShown = shown.has(n.id);
              const linking = link?.from === n.id;
              const color = linking ? link!.color : g?.color;
              const iconEl = typeof n.icon === "string" ? flowIcons[n.icon as FlowIconName] : n.icon;
              const tint = n.tint ? ({ color: n.tint } as CSSProperties) : undefined;
              const hintOut = hint?.kind === "connect" && hint.from === n.id;
              const hintIn = hint?.kind === "connect" && hint.to === n.id;
              return (
                <div
                  key={n.id}
                  className={cn(
                    "wfc-node",
                    n.kind === "tool" && "is-tool",
                    !isShown && "is-hidden",
                    ghost.has(n.id) && "is-ghost",
                    (g || linking) && "is-live",
                    linking && "is-linking",
                    link?.hit === n.id && "is-target",
                    movingId === n.id && "is-moving",
                    shake === n.id && "is-shake",
                  )}
                  style={{ left: p.x - w / 2, top: p.y - NODE_H / 2, width: w, "--wf-glow": color } as CSSProperties}
                  onPointerDown={(e) => startMove(e, n.id)}
                  role="group"
                  aria-label={n.label}
                >
                  {g && <span key={g.count} className="wfc-burst" aria-hidden="true" />}
                  <span className="wfc-shine" aria-hidden="true" />
                  {n.kind === "tool" ? (
                    <i className="wfc-diamond" aria-hidden="true" />
                  ) : (
                    <>
                      <i className={cn("wfc-port wfc-port--in", hintIn && "is-hint")} style={hintIn ? hintStyle : undefined} aria-hidden="true" />
                      <i
                        className={cn("wfc-port wfc-port--out", hintOut && "is-hint")}
                        style={hintOut ? hintStyle : undefined}
                        aria-hidden="true"
                        onPointerDown={(e) => startLink(e, n.id)}
                      />
                    </>
                  )}
                  {n.kind === "agent" ? (
                    <span className="wfc-agent">
                      <svg className="wfc-icon" viewBox="0 0 24 24" style={tint} aria-hidden="true">{iconEl}</svg>
                      <span>{n.label}</span>
                    </span>
                  ) : typeof n.icon === "string" ? (
                    <svg className="wfc-icon" viewBox="0 0 24 24" style={tint} aria-hidden="true">{iconEl}</svg>
                  ) : (
                    <span className="wfc-icon-box" style={tint}>{iconEl}</span>
                  )}
                  <span className="wfc-dots" aria-hidden="true"><i /><i /></span>
                  {n.kind !== "agent" && (
                    <span className="wfc-label" aria-hidden="true">
                      <TypedLabel text={n.label} shown={isShown} typed={!!n.hidden && interactive} />
                    </span>
                  )}
                </div>
              );
            })}

            {/* the round ends of each wire, over the boxes */}
            <svg className="wfc-svg wfc-svg--caps" width={width} height={height} aria-hidden="true">
              {wires.map((w) => (
                <g key={w.key} style={{ "--wc": w.color } as CSSProperties}>
                  {[w.a, w.b].map((c, i) => (
                    <g key={i} className="wfc-cap">
                      <circle cx={c.x} cy={c.y} r={11} className="wfc-cap-glow" filter={`url(#${uid}-b)`} />
                      <circle cx={c.x} cy={c.y} r={9.5} className="wfc-cap-ring" />
                      <circle cx={c.x} cy={c.y} r={6} className="wfc-cap-dot" />
                    </g>
                  ))}
                </g>
              ))}
              {link && linkPath && (
                <g style={{ "--wc": link.color } as CSSProperties}>
                  <circle cx={link.x} cy={link.y} r={7} className="wfc-cap-ring" />
                  <circle cx={link.x} cy={link.y} r={4.5} className="wfc-cap-dot" />
                </g>
              )}
            </svg>

            {/* hints: the + checkpoint, and a chip over the box to start from */}
            {hint?.kind === "plus" && (
              <>
                <button
                  type="button"
                  className="wfc-plus"
                  style={{ left: hint.at.x, top: hint.at.y }}
                  aria-label="Add the next steps"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    api.current.cancel();
                  }}
                  onClick={() => api.current.resolve()}
                >
                  +
                </button>
                <span className="wfc-chip" style={{ left: hint.at.x - 36, top: hint.at.y - 52, ...hintStyle }}>CLICK HERE</span>
              </>
            )}
            {hint?.kind === "connect" && pos[hint.from] && !link && (
              <>
                <span className="wfc-chip" style={{ left: pos[hint.from].x - 52, top: pos[hint.from].y - 62, ...hintStyle }}>
                  DRAG TO CONNECT
                </span>
                {/* the same step for keyboard and screen reader users */}
                <button type="button" className="wfc-sr" onClick={() => api.current.resolve()}>
                  Connect {nodeMap.get(hint.from)?.label} to {nodeMap.get(hint.to)?.label}
                </button>
              </>
            )}

            <span
              className={cn("wfc-cursor", cursor.show && "is-on", cursor.click && "is-click", cursor.snap && "is-snap")}
              style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)`, ...hintStyle }}
              aria-hidden="true"
            >
              <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                <path d="M2.5 1.8 17 10.6l-6.4 1.5-3 6.2L2.5 1.8Z" style={{ fill: "var(--wc)" }} stroke="rgb(0 0 0 / 0.55)" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}