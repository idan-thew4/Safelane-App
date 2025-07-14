import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import spinner from '../../assets/spinner.svg'

//Data
import { useStore } from "../../contexts/Store";

//Container
import MainContainer from "../content/MainContainer.jsx";

//Slider
import Slider from "../ticket/Slider.jsx";
import Video from "../ticket/Video.jsx";
import Details from "../ticket/Details.jsx";
import Improve from "../ticket/Improve.jsx";
import About from "../ticket/About.jsx";
import MobileNavBar from "../mobileNavBar";

//Chat
import Chat from "./Chat.jsx";

const Ticket = () => {

    //Data hooks - No ticket!
    const { copy, illustrations, ticket, setTicketId, activeOption, setActiveOption, getCookie, setTicket } = useStore();
    const { id } = useParams();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const openChat = queryParams.get('openChat') === 'true';


    //Check if url contains id to get saved data from cookies
    useEffect(() => {

        if (!ticket) {
            if (id) {
                setTicketId(id);
                let cookie = getCookie(`${id}`)
                if (cookie) {
                    setTicket(JSON.parse(getCookie(`${id}`)));
                } else if (!ticket && !openChat) {
                    navigate(`/login`);
                } else if (!ticket && openChat) {
                    navigate(`/login?openChat=true`);

                }
            }

        }


        //   })
    }, []);

    //Slider hooks
    const renderContent = () => {
        if (!ticket) {

            return <div className="spinner__container">
                <img src={spinner}></img>
            </div>

        }


        switch (activeOption) {
            case 0:
                return <Video
                    url={ticket.video_url}
                />;
            case 1:
                return <Details
                    headline={ticket.violation_details['name']}
                    dataPoints={ticket.violation_details['info']}
                    textMobile={ticket.violation_details['summary']}
                />;
            case 2:
                return <Improve
                    points={ticket.improvment_suggestions}
                    headlineMobile={copy[1].content[activeOption].title}
                    textMobile={copy[1].content[activeOption].text}
                />;
            case 3:
                const data = copy[1].content[3];
                return <About
                    {...data}
                    headlineMobile={copy[1].content[activeOption].titleBox}
                    textMobile={copy[1].content[activeOption].text}
                    appStoreLink={copy[1].content[activeOption].appStoreLink}
                    googleStoreLink={copy[1].content[activeOption].googleStoreLink}
                    ticketPostID={ticket['wp-ticket-id']}
                />;
        }
    };



    const renderChatMessage = () => {
        if (!ticket) {
            return false;
        } else {
            return ticket;
        }
    }




    const section = ['video', 'details', 'improve', 'about'];

    return (
        <MainContainer
            section={section[activeOption]}
            title={activeOption !== 3 ? copy[1].content[activeOption].title : copy[1].content[activeOption].titleBox}
            text={activeOption !== 1 ? copy[1].content[activeOption].text : activeOption !== 2 ? '' : ticket.violation_details['summary']}
            slider={<Slider setActiveOption={setActiveOption} />}
            content={renderContent()}
            illustration={illustrations[activeOption + 1]}
            chat={<Chat ticketRef={renderChatMessage()} openChat={openChat} />}
            mobileNavBar={activeOption !== 0 && <MobileNavBar></MobileNavBar>}
        />
    )

};
export default Ticket;

