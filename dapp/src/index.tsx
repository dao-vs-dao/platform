import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from "react-redux";
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { Dashboard } from "./pages/dashboard";
import { store } from "./state/store";

const container = document.getElementById('app-root');
const root = createRoot(container!);
root.render(
    <Provider store={store}>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App><Dashboard /></App>} />
        </Routes>
    </BrowserRouter>
    </Provider>
);
