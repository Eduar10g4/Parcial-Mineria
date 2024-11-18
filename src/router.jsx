import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadFiles from "./pages/uploadFiles";
import DataAnalyst from "./pages/DataAnalyst";
import App from "./App";
import LayoutDashobard from "./components/layouthDashboard/layouthDashboard";
import Graphics from "./pages/graficos";


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LayoutDashobard> <App /> </LayoutDashobard>} />
                <Route path="/upload_files" element={<LayoutDashobard> <UploadFiles /> </LayoutDashobard>} />
                <Route path="/data_analysis" element={<LayoutDashobard> <DataAnalyst /> </LayoutDashobard>} />
                <Route path="/graphics" element={<LayoutDashobard> <Graphics /> </LayoutDashobard>} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;