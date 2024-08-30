import { Image } from "react-konva";
import useImage from "use-image";
import Konva from "konva";

/**
 konva Image upload
 * @param url {string} 이미지 위치 (url 형식)
 * @param rest {Konva.ImageConfig} 이미지 관련 속성들
 */
export default function KonvaImage({ url, ...rest }: { url: string } & Omit<Konva.ImageConfig, "image">) {
    const [image, status] = useImage(url, "anonymous", "origin");

    if (status === "loading") return null;

    return <Image {...rest} image={image} />;
}
