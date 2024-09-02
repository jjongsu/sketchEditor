import { useAtomValue } from "jotai";
import { canvasAtom } from "../../../store/atoms.ts";
import { useCallback, useEffect, useState } from "react";
import { IEvent } from "fabric/fabric-impl";
import { fabric } from "fabric";

export default function useCanvasEvent() {
    const canvas = useAtomValue(canvasAtom);
    /** canvas mode */
    const [canvasMode, setCanvasMode] = useState<"draw" | "pointer">("pointer");

    /** change mode */
    const changeMode = useCallback(() => {
        if (!canvas) return;
        setCanvasMode((prev) => {
            if (prev === "pointer") {
                canvas.isDrawingMode = true;
                return "draw";
            } else {
                canvas.isDrawingMode = false;
                return "pointer";
            }
        });
    }, [canvas]);

    useEffect(() => {
        if (!canvas) return;

        let pointer: { x: number; y: number } | null = null;

        const handleMouseDown: (e: IEvent<MouseEvent>) => void = (e) => {
            if (!e.target || e.target.name !== "backgroundImage" || e.button !== 1 || !e.pointer) {
                pointer = null;
                return;
            }
            const { x, y } = e.pointer;
            pointer = { x, y };
        };

        const handleMouseUp: (e: IEvent<MouseEvent>) => void = (e) => {
            const drawingPath = canvas.getObjects("path")?.[0] as fabric.Path | undefined;
            if (!e.target || e.button !== 1 || !pointer || e.isClick || !drawingPath) {
                pointer = null;
                return;
            }

            console.log(drawingPath);

            const attr = drawingPath.getBoundingRect(true);
            // const rect = new fabric.Rect({ left, top });
            const rect = new fabric.Rect({ ...attr });
            canvas.remove(drawingPath);

            canvas.add(rect);
            canvas.renderAll();
            pointer = null;
        };

        canvas.on("mouse:down", handleMouseDown);
        canvas.on("mouse:up", handleMouseUp);

        return () => {
            canvas.off("mouse:down");
            canvas.off("mouse:up");
        };
    }, [canvas]);

    return { changeMode, canvasMode };
}
