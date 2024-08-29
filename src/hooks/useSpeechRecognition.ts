import { useState, useEffect, useCallback } from "react";

export default function useSpeechRecognition({ lan = "ko-KR", onSpeechText }: { lan?: string; onSpeechText?: (text: string) => void }) {
    const [result, setResult] = useState<{ text: string; error: string | null }>({
        text: "",
        error: null,
    });
    const [recognition, setRecognition] = useState<any | null>(null);

    const initRecognition = useCallback(() => {
        //@ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error("SpeechRecognition 지원 되지 않습니다.");
            return;
        }

        const newRecognition = new SpeechRecognition();
        newRecognition.lang = lan;
        newRecognition.interimResults = false;
        newRecognition.maxAlternatives = 1;

        return newRecognition;
    }, [lan]);

    const handleResult = useCallback(
        (event: any) => {
            const text = event.results[0][0].transcript;
            setResult({ text, error: null });
            console.log("result : ", text);
            onSpeechText?.(text);
        },
        [onSpeechText],
    );

    const handleError = (event: any) => {
        console.log("error : ", event);
        setResult({
            text: "",
            error: `SpeechRecognition error: ${event.error}`,
        });
    };

    useEffect(() => {
        // 이미 인식이 있다면 언어만 변경
        if (recognition) {
            recognition.lang = lan;
            recognition?.stop();
            return;
        }

        const speechRecognition = initRecognition();
        setRecognition(speechRecognition);

        if (!speechRecognition) return;
        speechRecognition.addEventListener("result", handleResult);
        speechRecognition.addEventListener("error", handleError);

        return () => {
            recognition?.removeEventListener("result", handleResult);
            recognition?.removeEventListener("error", handleError);
            recognition?.stop();
        };
    }, [handleResult, initRecognition, recognition, lan]);

    const handleStart = useCallback(() => {
        if (!recognition) {
            setResult({ text: "", error: "SpeechRecognition 지원되지 않습니다." });
            console.log("recognition 없음");
            return;
        }

        console.log("speech record start!!");

        recognition?.start();
    }, [recognition]);

    const handleStop = useCallback(() => {
        console.log("speech record stop!!");

        recognition?.stop();
    }, [recognition]);

    return { result, handleStart, handleStop };
}
