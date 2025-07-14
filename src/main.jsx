import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'
import { BrowserRouter } from "react-router-dom";
import { Store } from './contexts/Store.jsx';
import './styles/styles.sass'


ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Store>
            <App />
        </Store>
    </BrowserRouter>
)
