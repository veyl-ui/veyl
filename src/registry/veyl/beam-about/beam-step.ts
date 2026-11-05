"use client";

import { createContext, useContext } from "react";

export type BeamStepState = {
  /** True from the moment the beam reaches this card until everything fades out. */
  reached: boolean;
  /** True when the visitor prefers reduced motion. Show the finished state, no animation. */
  reduced: boolean;
};

export const BeamStepContext = createContext<BeamStepState>({ reached: false, reduced: false });

/** Use this inside your own visual to know when the beam has arrived. */
export function useBeamStep() {
  return useContext(BeamStepContext);
}