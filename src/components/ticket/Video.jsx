import { useEffect, useState } from "react";
import { useStore } from "../../contexts/Store";
import { useParams, Link } from 'react-router-dom';
import Slider from "./Slider";
import videoPrev from "../../assets/mobile/video_prev.jpg"

const Video = ({ url, section }) => {

    const { ticket, activeOption, setActiveOption, setActiveIndex, copy, redirectsQR } = useStore();
    const [ticketDetails, setTicketDetails] = useState({});
    const { id } = useParams();


    useEffect(() => {

        if (ticket) {
            const updatedTicketDetails = {
                ...ticketDetails,
                violation: ticket.violation_details['name'],
                carNumber: ticket.carNumber
            }
            setTicketDetails(updatedTicketDetails);
        }

    }, [ticket])


    useEffect(() => {

        setActiveIndex(activeOption);

    }, [activeOption])



    return (
        <>
            {section !== 'qr__login' &&
                <div className="video__ticket-details-mobile">
                    <p className="parag_16">רכב {ticket.carNumber}</p>
                    <h1 className="head_40">עבירת {ticketDetails.violation}</h1>
                </div>
            }
            {section === 'qr__login' && <p className="parag_17">{copy[0].content[0].qrText}</p>}


            {section === 'qr__login' ?
                <div className="video__wrapper">
                    <Link to={`/ticket/${id}`} className="basic-button with-icon play-icon">לצפייה</Link>                    
                    <video>
                    <source src={`${url}#t=0.001`} type="video/mp4" />
                    </video>
                </div>
                :
                <video playsInline controls  autoPlay={redirectsQR} muted={{redirectsQR}} >
                    <source src={`${url}#t=0.001`} type="video/mp4" />
                </video>
            }


            {section !== 'qr__login' &&
                <div className="video__bottom-section-mobile">
                    <p className="parag_16">מספר אירוע {id}</p>
                    <Slider setActiveOption={setActiveOption} />
                </div>

            }

        </>
    )

}

export default Video;