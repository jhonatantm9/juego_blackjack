import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate,
} from "react-router-dom";
import App from "./App";
import Home from "./Home";



const MyRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="about" element={<div>Estoy en about</div>} />
                <Route path="dashboard" element={<div>Estoy en dashboard </div>} />
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="partida" element={<App />} />
            </Routes>
        </BrowserRouter>
    );
}

export default MyRoutes;