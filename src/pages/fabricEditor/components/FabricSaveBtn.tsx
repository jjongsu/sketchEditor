import { useAtomValue } from "jotai";
import { canvasAtom } from "../../../store/atoms.ts";
import { useCallback } from "react";

export default function FabricSaveBtn() {
    const editor = useAtomValue(canvasAtom);

    /**
     * save button click event
     */
    const onClick = useCallback(() => {
        console.log(editor?.toDatalessJSON(["data"]));
    }, [editor]);

    return (
        <button className="w-[200px] bg-amber-50 ml-2 rounded-2xl hover:bg-amber-400 hover:text-white" onClick={onClick}>
            fabric editor save!!
        </button>
    );
}
