import { useNavigate } from "react-router-dom";
import "./Home.css";
const Home = () => {
    const navigate = useNavigate();

    const startGame = () => {
        navigate("/partida");
    };
    return (
        <div className="prueba">
            <h1>Home</h1>
            <button
                onClick={() => {
                    navigate("/about");
                }}
            >
                Go to about
            </button>
            <button
                onClick={() => {
                    navigate("/dashboard");
                }}
            >
                Go to dashboard
            </button>
            <button
                onClick={startGame}
            >
                Start Game
            </button>
        </div>
    );
}

export default Home;