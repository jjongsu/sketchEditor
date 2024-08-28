import { createBrowserRouter, Link, Navigate, RouterProvider } from "react-router-dom";
import { lazy } from "react";
const FabricPage = lazy(() => import("./pages/fabricEditor"));
const KonvaPage = lazy(() => import("./pages/konvaEditor"));

export default function Router() {
    const router = createBrowserRouter([
        {
            path: "/fabric",
            element: <FabricPage />,
            errorElement: <div>error</div>,
        },
        {
            path: "/konva",
            element: <KonvaPage />,
        },
        {
            path: "*",
            element: <Navigate to={"/fabric"} replace={true} />,
            errorElement: <div>error</div>,
        },
    ]);
    return <RouterProvider router={router} />;
}
