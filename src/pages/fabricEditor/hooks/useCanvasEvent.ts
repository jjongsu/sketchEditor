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

        const handleMouseUp = (e: fabric.IEvent<MouseEvent>) => {
            const drawingPath = canvas.getObjects("path")?.[0] as fabric.Path | undefined;

            if (!e.target || e.button !== 1 || e.isClick || !drawingPath) {
                return;
            }

            const pathList = drawingPath.path ?? [];
            const _position1 = (pathList?.[0] ?? [0, 0]).toString().split(",");
            const position1 = _position1.slice(_position1.length - 2).map(Number);
            const _position2 = (pathList?.[pathList.length - 1] ?? [0, 0]).toString().split(",");
            const position2 = _position2.slice(_position2.length - 2).map(Number);

            const attr = {
                left: Math.min(position1[0], position2[0]),
                top: Math.min(position1[1], position2[1]),
                width: Math.abs(position1[0] - position2[0]),
                height: Math.abs(position1[1] - position2[1]),
            };

            canvas.remove(drawingPath);

            // 너무 작은 영역인지 확인
            if (attr.width < 10 && attr.height < 10) {
                canvas.renderAll();
                return;
            }
            const rect = new fabric.Rect({ ...attr, fill: "transparent", stroke: "#D0EE17", strokeWidth: 5, strokeUniform: true });

            canvas.add(rect);
            canvas.renderAll();
        };

        canvas.on("mouse:up", handleMouseUp);

        return () => {
            canvas.off("mouse:up");
        };
    }, [canvas]);

    return { changeMode, canvasMode };
}
