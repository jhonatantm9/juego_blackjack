import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MainView from '../views/MainView';
import GameView from '../views/GameView';

const MyRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="home" />} />
                <Route path="home" element={<MainView />} />
                <Route path="game" element={<GameView />} />
                <Route path="*" element={<Navigate to="home" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default MyRoutes;