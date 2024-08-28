import { useAtom } from "jotai";
import { canvasAtom, popoverAtom, targetAtom } from "../store/atoms.ts";
import { ChangeEventHandler, MouseEventHandler, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { useAtomValue, useSetAtom } from "jotai/index";
import { fabric } from "fabric";

export default function ContextInfoMenu({ x, y }: { x: number; y: number }) {
    const [target, setTarget] = useAtom(targetAtom);
    const imageRef = useRef<HTMLImageElement>(null);
    const [targetData, setTargetData] = useState<{ text: string; id: string; file?: string } | null>();
    const setPopover = useSetAtom(popoverAtom);
    const canvas = useAtomValue(canvasAtom);

    const handleText: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setTargetData((prev) => {
            if (!prev) return null;
            return { ...prev, text: e.target.value };
        });
    };

    const handleFile: ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const _url = window.URL || window.webkitURL;
        const imageId = uuid();

        const imageElement = document.createElement("img");
        imageElement.src = _url.createObjectURL(file);
        imageElement.id = imageId;

        imageElement.onload = () => {
            document.body.appendChild(imageElement);
            window.sessionStorage.setItem(imageId, imageElement.src);
            setTargetData((prev) => {
                if (!prev) return null;
                return { ...prev, file: imageId };
            });
        };
    };

    const closePopover = () => {
        setTarget(null);
        setPopover(null);
    };

    const handleSave: MouseEventHandler<HTMLButtonElement> = () => {
        /** empty targetData */
        if (!targetData?.text && !targetData?.file) {
            closePopover();
            return;
        }

        /** target data 수정 */
        if (target instanceof fabric.Textbox) {
            target.set("text", targetData.text);
            target.set("data", targetData);
        }

        closePopover();
        canvas?.renderAll();
    };

    useEffect(() => {
        const imageSrc = window.sessionStorage.getItem(target?.data.file);
        if (!imageSrc || !imageRef.current) return;
        imageRef.current.src = imageSrc;
    }, [target?.data.file]);

    useEffect(() => {
        if (!target) return;
        setTargetData(target.get("data"));
    }, [target]);

    // target 없을 경우
    if (!target) return null;

    return (
        <>
            <div style={{ left: x, top: y }} className={`absolute flex flex-col gap-2 rounded-2xl bg-amber-50 p-2`}>
                <p>popup</p>
                <textarea
                    className={"w-full resize-none"}
                    value={targetData?.text}
                    onChange={handleText}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    inputMode={"text"}
                ></textarea>
                <input type={"file"} id={"file-input"} name="file-input" accept="image/png, image/jpeg" onChange={handleFile} />
                <button className={"rounded-2xl hover:bg-amber-100"} onClick={handleSave}>
                    save
                </button>
            </div>
            <div>
                <img ref={imageRef} alt={"info-image"} />
            </div>
        </>
    );
}
