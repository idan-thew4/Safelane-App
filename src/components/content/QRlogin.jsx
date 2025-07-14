import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import spinner from '../../assets/spinner.svg'
import spinnerBlue from '../../assets/spinner_blue.svg'


//Data
import { useStore } from "../../contexts/Store";

//Container
import MainContainer from "../content/MainContainer.jsx";

//Slider
import Video from "../ticket/Video.jsx";

//Chat
import Chat from "./Chat";


const QRlogin = () => {

    const { copy, ticket, getTicketData, redirectsQR, setRedirectsQR, setTicket } = useStore();
    const [videoURL, setVideoURL] = useState();
    const { id, carnum, dashboard } = useParams();
    const navigate = useNavigate();

    //Fetch data
    async function getTicket(dashboard = false) {
        try {
            const response = await getTicketData(id, carnum, true);
            if (dashboard) {
                navigate(`/ticket/${id}`);
            }
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        getTicket();
        setRedirectsQR(true);
        if (location.pathname.includes('dashboard')) {
            getTicket(true);
        } else {
            getTicket();
            setRedirectsQR(true);
        }
    }, [setRedirectsQR]);




    // Get Content
    const renderContent = () => {
        if (!ticket) {
            return <div className="spinner-wrapper">
                <picture>
                    <source srcset={spinnerBlue} media="(min-width: 1023px)" />
                    <img className="spinner" src={spinner}></img>
                </picture>
            </div>;
        }
        else {
            if (window.innerWidth < 1023) {
                return <Video url={ticket.video_url} section={'qr__login'} />
            } else {
                navigate('/login');
            }
        }
    }

    // Get Chat messages
    const renderChatMessage = () => {
        if (!ticket) {
            return false;
        } else {
            return ticket;
        }
    }


    return (
        <MainContainer
            section={'qr__login'}
            title={copy[0].content[0].title}
            text={copy[0].content[0].text}
            content={renderContent()}
            chat={<Chat ticketRef={renderChatMessage()} />}


        />

    )


}
export default QRlogin;