import type { CSSProperties } from "react";

/** Cells that light up on the grid: [column, row, delay in seconds]. Fixed, so the server and the browser draw the same thing. */
const floorCells: [number, number, number][] = [
  [20, 1, 0], [24, 2, 1.1], [28, 1, 2.3], [17, 3, 3.4], [31, 3, 4.2], [22, 4, 0.7], [26, 5, 1.8], [19, 6, 2.9],
  [29, 6, 3.7], [23, 7, 4.8], [15, 8, 0.4], [33, 8, 1.5], [21, 9, 2.6], [27, 10, 3.1], [25, 3, 4.5], [18, 10, 5.1],
];
const ceilCells: [number, number, number][] = [
  [21, 1, 1.6], [26, 2, 3.0], [18, 3, 0.2], [30, 4, 2.1], [23, 5, 4.4], [16, 7, 3.6], [28, 8, 0.9], [24, 9, 5.0],
];

const cell = ([c, r, d]: [number, number, number]) => (
  <i key={`${c}-${r}`} style={{ "--c": c, "--r": r, "--d": `${d}s` } as CSSProperties} />
);

/** The 3D grid behind a page header. Put it first inside a `HeroStage` with the class "tm-hero tm-stage". Styles live in theming/motion.css. */
export function HeroGrid() {
  return (
    <div className="tm-grid" aria-hidden="true">
      <div className="tm-rig">
        <div className="tm-plane tm-floor">
          <div className="tm-cells">{floorCells.map(cell)}</div>
        </div>
        <div className="tm-plane tm-ceil">
          <div className="tm-cells">{ceilCells.map(cell)}</div>
        </div>
      </div>
      <div className="tm-spot" />
      <div className="tm-horizon" />
    </div>
  );
}