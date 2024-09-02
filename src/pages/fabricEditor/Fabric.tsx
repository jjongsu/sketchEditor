import { fabric } from "fabric";
import { useEffect, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { backgroundImage } from "../../assets/images";
import { canvasAtom, popoverAtom, targetAtom } from "../../store/atoms";
import { ContextBackgroundMenu, ContextInfoMenu } from "./components";
import FabricSaveBtn from "./components/FabricSaveBtn.tsx";
import { useCanvasEvent } from "./hooks";

export default function Fabric() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const [canvas, setCanvas] = useAtom(canvasAtom);
    const [popover, setPopover] = useAtom(popoverAtom);
    const setTarget = useSetAtom(targetAtom);
    const { changeMode, canvasMode } = useCanvasEvent();

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
            image.on("mousedblclick", (e) => {
                setPopover({ x: e.pointer?.x ?? 0, y: e.pointer?.y ?? 0, type: "background" });
            });
            image.setCoords();
            _canvas.add(image);
            setCanvas(_canvas);
        });
    }, [setCanvas, canvas, setPopover]);

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
            <div className={"flex gap-2"}>
                <p>fabric editor</p>
                <FabricSaveBtn />
                <p>current mode : {canvasMode}</p>
                <button className="w-[200px] rounded-2xl bg-amber-50 hover:bg-amber-400 hover:text-white" onClick={changeMode}>
                    change editor mode!!
                </button>
            </div>

            <canvas ref={canvasRef} width={`${1080}px`} height={`${800}px`} />
            {popover && <div ref={backgroundRef} className={`absolute left-0 top-0 h-full w-full bg-transparent`} />}
            {popover?.type === "background" && <ContextBackgroundMenu x={popover.x} y={popover.y} />}
            {popover?.type === "information" && <ContextInfoMenu x={popover.x} y={popover.y} />}
        </div>
    );
}
