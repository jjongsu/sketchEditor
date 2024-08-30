import { fabric } from "fabric";
import { useEffect, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { backgroundImage } from "../../assets/images";
import { canvasAtom, popoverAtom, targetAtom } from "../../store/atoms";
import { ContextBackgroundMenu, ContextInfoMenu } from "../../components/fabric";

export default function Fabric() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const [canvas, setCanvas] = useAtom(canvasAtom);
    const [popover, setPopover] = useAtom(popoverAtom);
    const setTarget = useSetAtom(targetAtom);

    useEffect(() => {
        if (!canvasRef.current || canvas) return;

        console.log("canvas load");

        const _canvas = new fabric.Canvas(canvasRef.current, {
            enablePointerEvents: true,
            fireRightClick: true,
            stopContextMenu: true,
        });

        fabric.Image.fromURL(backgroundImage, (image) => {
            image.set({ name: "backgroundImage", selectable: false });
            image.on("mousedown", (e) => {
                if (e.button === 3) {
                    setPopover({ x: e.pointer?.x ?? 0, y: e.pointer?.y ?? 0, type: "background" });
                }
            });
            image.setCoords();
            _canvas.add(image);
            // _canvas.add(new fabric.Rect({ width: 100, height: 100, fill: "blue" }));
            setCanvas(_canvas);
        });
    }, [setCanvas, canvas, setPopover]);

    // useEffect(() => {
    //     const clickHandler = () => setPopover(null);
    //     window.addEventListener("click", clickHandler);
    //     return () => window.removeEventListener("click", clickHandler);
    // }, []);

    useEffect(() => {
        const backgroundDiv = backgroundRef.current;
        const clickHandler = () => {
            setTarget(null);
            setPopover(null);
        };
        backgroundDiv?.addEventListener("click", clickHandler);
        return () => backgroundDiv?.removeEventListener("click", clickHandler);
    }, [popover, setPopover, setTarget]);

    return (
        <div id="canvas-container" className={"relative"} onContextMenu={(e) => e.preventDefault()}>
            fabric editor
            <canvas ref={canvasRef} width={`${1080}px`} height={`${800}px`}></canvas>
            {popover && <div ref={backgroundRef} className={`absolute left-0 top-0 h-full w-full bg-transparent`} />}
            {popover?.type === "background" && <ContextBackgroundMenu x={popover.x} y={popover.y} />}
            {popover?.type === "information" && <ContextInfoMenu x={popover.x} y={popover.y} />}
        </div>
    );
}
