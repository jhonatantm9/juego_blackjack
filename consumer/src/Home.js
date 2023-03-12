import { useNavigate } from "react-router-dom";
import "./Home.css";
const Home = () => {
    const navigate = useNavigate();

    const startGame = () => {
        navigate("/partida");
    };
    return (
        <div className="prueba">

            <div className="containerHome">
                <div className="text1">
                    <h3>Nombre</h3>
                    <input type="text" placeholder="Ingrese su nombre" />
                </div>

                <div className="text2">
                    <h3>Sala</h3>
                    <input type="text" placeholder="Ingrese el id de la sala" />

                </div>
                <button onClick={startGame}>
                    Ingresar
                </button>
            </div>

        </div>
    );

}

export default Home;