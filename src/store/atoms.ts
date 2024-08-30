import { fabric } from "fabric";
import { atom } from "jotai";

/** canvas store */
export const canvasAtom = atom<fabric.Canvas | null>(null);

/** canvas popover */
export const popoverAtom = atom<{ x: number; y: number; type: "background" | "information" } | null>(null);

/** canvas target */
export const targetAtom = atom<fabric.Object | null>(null);

/** konva elements store */
export const elementAtom = atom<{ [key: string]: any[] } | null>(null);
