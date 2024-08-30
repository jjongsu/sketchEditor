// import { useAtom } from "jotai";
// import { elementAtom } from "../../store/atoms";

// import { KonvaImage } from ".";
// import { Rect } from "react-konva";
import Konva from "konva";

export interface IType {
    image: Konva.ImageConfig & { src: string };
    shape: Konva.ShapeConfig;
    arc: Konva.ArcConfig;
    arrow: Konva.ArrowConfig;
    circle: Konva.CircleConfig;
    container: Konva.ContainerConfig;
    ellipse: Konva.EllipseConfig;
    line: Konva.LineConfig;
    rect: Konva.RectConfig;
    text: Konva.TextConfig;
    ring: Konva.RingConfig;
    regularPolygon: Konva.RegularPolygonConfig;
}

// export default function ParsingObject<T extends keyof IType>({ type, ...rest }: { type: keyof IType } & IType[T]) {
export default function ParsingObject() {
    // const [elements, setElements] = useAtom(elementAtom);
    // if (rest instanceof Konva.ImageConfig) {
    //     return <KonvaImage src={"https://konvajs.org/assets/lion.png"} {...rest} />;
    // }
    // switch (type) {
    //     case "rect": {
    //         return <Rect {...rest} />;
    //     }
    //     case "image": {
    //         return <KonvaImage src={"https://konvajs.org/assets/lion.png"} {...rest} />;
    //     }
    // }

    return <div>ShapeObject</div>;
}
