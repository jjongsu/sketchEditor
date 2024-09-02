import { Stage, Layer, Star, Rect } from "react-konva";
import { useState } from "react";
import { KonvaNodeEvents } from "react-konva/ReactKonvaCore";
import KonvaImage from "./components/KonvaImage.tsx";

function generateShapes() {
    return [...Array(10)].map((_, i) => ({
        id: i.toString(),
        x: Math.random() * 800,
        y: Math.random() * 500,
        rotation: Math.random() * 180,
        isDragging: false,
    }));
}

const INITIAL_STATE = generateShapes();

export default function KonvaEditor() {
    const [stars, setStars] = useState(INITIAL_STATE);

    const handleDragStart: KonvaNodeEvents["onDragStart"] = (e) => {
        const id = e.target.id();
        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    isDragging: star.id === id,
                };
            }),
        );
    };
    const handleDragEnd: KonvaNodeEvents["onDragEnd"] = () => {
        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    isDragging: false,
                };
            }),
        );
    };

    return (
        <div>
            <p>konva editor</p>
            <Stage width={800} height={500}>
                <Layer>
                    {stars.map((star) => (
                        <Star
                            key={star.id}
                            id={star.id}
                            x={star.x}
                            y={star.y}
                            numPoints={5}
                            innerRadius={20}
                            outerRadius={40}
                            fill="#89b717"
                            opacity={0.8}
                            draggable
                            rotation={star.rotation}
                            shadowColor="black"
                            shadowBlur={10}
                            shadowOpacity={0.6}
                            shadowOffsetX={star.isDragging ? 10 : 5}
                            shadowOffsetY={star.isDragging ? 10 : 5}
                            scaleX={star.isDragging ? 1.2 : 1}
                            scaleY={star.isDragging ? 1.2 : 1}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        />
                    ))}
                </Layer>
                <Layer>
                    <Rect x={20} y={50} width={100} height={100} fill="red" shadowBlur={10} draggable={true} />
                    <KonvaImage url={"https://konvajs.org/assets/lion.png"} />
                </Layer>
            </Stage>
        </div>
    );
}
