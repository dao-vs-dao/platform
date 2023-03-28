import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { HomePage } from "./pages/home";

const container = document.getElementById('app-root');
const root = createRoot(container!);

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App><HomePage /></App>} />
        </Routes>
    </BrowserRouter>

);
