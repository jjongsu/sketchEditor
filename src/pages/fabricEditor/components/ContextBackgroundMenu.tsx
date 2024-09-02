import { ChangeEventHandler, MouseEventHandler, useEffect, useRef, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { canvasAtom, popoverAtom, targetAtom } from "../../../store/atoms.ts";
import { fabric } from "fabric";
import { v4 as uuid } from "uuid";
import { useSpeechRecognition } from "../../../hooks";

/**
 * [TODO] : image 여러 개 가능하도록 수정(png/jpg/jpeg 형식만 가능)
 */
export default function ContextBackgroundMenu({ x, y }: { x: number; y: number }) {
    const canvas = useAtomValue(canvasAtom);
    const [targetData, setTargetData] = useState<{ id: string; text: string; file?: string }>({ id: uuid(), text: "" });
    const setPopover = useSetAtom(popoverAtom);
    const setTarget = useSetAtom(targetAtom);
    const contextRef = useRef<HTMLDivElement>(null);
    const onSpeechText = (text: string) => {
        console.log("result text : ", text);
        setTargetData((prev) => ({ ...prev, text: prev.text + text }));
    };
    const { handleStart, handleStop } = useSpeechRecognition({ onSpeechText });

    const closePopover = () => {
        setTarget(null);
        setPopover(null);
    };

    const handleSave: MouseEventHandler<HTMLButtonElement> = () => {
        /** empty targetData */
        if (!targetData.text && !targetData.file) {
            closePopover();
            return;
        }

        /** infoText 안에 기본적인 name 및 data 존재 */
        const infoText = new fabric.Textbox(targetData.text ? targetData.text : "file exist!!", {
            left: x,
            top: y,
            name: "info-" + targetData.id,
            data: targetData,
        });

        infoText.on("mousedown", (e) => {
            if (e.button === 3) {
                setTarget(infoText);
                setPopover({ x: e.target?.left ?? 0, y: e.target?.top ?? 0, type: "information" });
            }
        });

        closePopover();
        canvas?.add(infoText);
        canvas?.renderAll();
    };

    const handleText: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setTargetData((prev) => ({ ...prev, text: e.target.value }));
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
            setTargetData((prev) => ({ ...prev, file: imageId }));
        };
    };

    // document 위에 그린 image 제거
    useEffect(() => {
        return () => {
            handleStop();
            if (!targetData?.file) return;
            const imageElement = document.getElementById(targetData.file);
            imageElement?.remove();
        };
    }, [handleStop, targetData.file]);

    // popup 영역에 이미지를 드래그해서 넣는 방식 적용
    useEffect(() => {
        if (!contextRef.current) return;

        const dragenter: (this: HTMLDivElement, ev: DragEvent) => void = (e) => {
            e.stopPropagation();
            e.preventDefault();
        };

        const dragover: (this: HTMLDivElement, ev: DragEvent) => void = (e) => {
            e.stopPropagation();
            e.preventDefault();
        };

        const drag: (this: HTMLDivElement, ev: DragEvent) => void = (e) => {
            e.stopPropagation();
            e.preventDefault();

            const dt = e.dataTransfer;
            const file = dt?.files?.[0];
            if (!file) return;

            const _url = window.URL || window.webkitURL;
            const imageId = uuid();

            const imageElement = document.createElement("img");
            imageElement.src = _url.createObjectURL(file);
            imageElement.id = imageId;

            imageElement.onload = () => {
                document.body.appendChild(imageElement);
                window.sessionStorage.setItem(imageId, imageElement.src);
                setTargetData((prev) => ({ ...prev, file: imageId }));
            };
        };

        const dropbox = contextRef.current;

        dropbox.addEventListener("dragenter", dragenter, false);
        dropbox.addEventListener("dragover", dragover, false);
        dropbox.addEventListener("drop", drag, false);

        return () => {
            dropbox.removeEventListener("dragenter", dragenter, false);
            dropbox.removeEventListener("dragover", dragover, false);
            dropbox.removeEventListener("drop", drag, false);
        };
    }, []);

    return (
        <div ref={contextRef} style={{ left: x, top: y }} className={`absolute flex flex-col gap-2 rounded-2xl bg-amber-50 p-2`}>
            <p>popup</p>
            <textarea
                className={"w-full resize-none"}
                value={targetData.text}
                onChange={handleText}
                onClick={(e) => {
                    e.stopPropagation();
                }}
                inputMode={"text"}
            ></textarea>
            <input type={"file"} id={"file-input"} name="file-input" accept="image/png, image/jpeg" onChange={handleFile} />
            <button className={"rounded-2xl hover:bg-blue-400"} onClick={handleStart}>
                STT start!
            </button>
            <button className={"rounded-2xl hover:bg-amber-100"} onClick={handleSave}>
                save
            </button>
        </div>
    );
}
