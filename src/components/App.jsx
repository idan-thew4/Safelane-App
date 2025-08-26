import { Routes, Navigate, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header.jsx";

// content 'pages'
import Ticket from "./content/Ticket"
import Login from "./content/Login"
import QRlogin from "./content/QRlogin.jsx"
import { useEffect } from "react";




const App = () => {
    const location = useLocation();
    const navigate = useNavigate();




    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
        // We execute the same script as before
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });


    useEffect(() => {
        if (location.pathname === '/login') {
            document.querySelector('body').classList.add('login');
        } else {
            document.querySelector('body').classList.remove('login');
        }

    }, [location]);






    return (
        <>
            <Routes>
                <Route path="/" element={<Header />}>
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/ticket/qr/:id/:carnum" element={<Login />} />
                    <Route exact path="/ticket/dashboard/:id/:carnum" element={<Login />} />
                    <Route exact path="/ticket/:id/" element={<Ticket />} />
                    {/* Redirects */}
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/login" />} />

                </Route>
            </Routes>
        </>
    )
}

export default App

