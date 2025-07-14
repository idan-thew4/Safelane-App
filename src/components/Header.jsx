import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useStore } from "../contexts/Store";
import safelaneLogo from '../assets/safeLane_logo.svg';
import ralbadLogo from '../assets/ralbad_logo.png';
import NativBatoachLogo from '../assets/nativ-batoach_logo.svg';
import { useState, useEffect } from "react";


const Header = () => {
    const { id } = useParams();
    const params = useParams();
    const { ticket } = useStore();
    const [ticketDetails, setTicketDetails] = useState({ "id": id });
    const navigate = useNavigate();



    const hasQR = params.hasOwnProperty('qr');

    useEffect(() => {
        if (ticket) {
            const updatedTicketDetails = {
                ...ticketDetails,
                id: id,
                violation: ticket.violation_details['name'],
                carNumber: ticket.carNumber
            }
            setTicketDetails(updatedTicketDetails);
        }



    }, [ticket]);



    
    const logout = () => {
        navigate('/login');
         document.cookie = `${ticketDetails.id}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    }



    return (
        <>
            <header className={id && !hasQR ? 'header__mobile' : null}>
                    <img className="header__logo_2" src={ralbadLogo} alt="Ralbad logo" />
                    <img className="header__logo_1" src={safelaneLogo} alt="SafeLane logo" />
                    <img className="header__logo_3" src={NativBatoachLogo} alt="Nativ Batoach logo" />

                    {id &&
                        <p className="header__ticket-info parag_20 light">
                            <strong>עבירת {ticketDetails.violation}</strong> | רכב מס' {ticketDetails.carNumber} | מס' אירוע {ticketDetails.id}
                        </p>}
                        <button className="header__logout parag_14 "  onClick={logout}>התנתקות</button>
            </header>
            {id && !hasQR ? <button className="header__logout floating-button parag_14 "  onClick={logout}></button> : null }
        
            <Outlet />
        </>
    )
};

export default Header;