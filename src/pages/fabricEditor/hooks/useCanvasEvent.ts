import { useAtomValue } from "jotai";
import { canvasAtom } from "../../../store/atoms.ts";
import { useCallback, useEffect, useState } from "react";
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

        const handleMouseDown = (e: fabric.IEvent<MouseEvent>) => {
            if (!e.target || e.target.name !== "backgroundImage" || e.button !== 1 || !e.pointer) {
                pointer = null;
                return;
            }
            const { x, y } = e.pointer;
            pointer = { x, y };
        };

        const handleMouseUp = (e: fabric.IEvent<MouseEvent>) => {
            const drawingPath = canvas.getObjects("path")?.[0] as fabric.Path | undefined;
            if (!e.target || e.button !== 1 || !pointer || e.isClick || !drawingPath) {
                pointer = null;
                return;
            }

            console.log(drawingPath);

            const attr = drawingPath.getBoundingRect(true);
            canvas.remove(drawingPath);

            // click 판단
            if (attr.width < 10 && attr.height < 10) {
                canvas.renderAll();
                return;
            }
            const rect = new fabric.Rect({ ...attr });

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
