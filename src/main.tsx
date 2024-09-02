import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./Router.tsx";
import { version } from "../package.json";

console.log(`version : v${version}`);
createRoot(document.getElementById("root")!).render(<Router />);
