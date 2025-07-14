import React, { useEffect, useState } from "react";
import QR from '../../assets/qr_safelane.png';
import { useStore } from "../../contexts/Store";



const About = ({ headline, text, qr, more, cta, headlineMobile, textMobile, appStoreLink, googleStoreLink, ticketPostID }) => {
    const [appStore, setAppStore] = useState(['app-store', appStoreLink]);
    const { url } = useStore();




    useEffect(() => {

        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/android/i.test(userAgent)) {
            setAppStore(['google-store', googleStoreLink]);
        }


    }, []);

    const sendChatMessage = async (type, id) => {
        try {
            const response = await fetch(`${url}/wp-json/safelane-api/update-conversion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "wp_post_id": id,
                    "conversion_type": type
                })
            })
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }





    return (
        <>
            <h2 className="about__title-mobile head_30">{headlineMobile}</h2>
            <p className="about__content-mobile parag_18">{textMobile}</p>
            <div className="about__head">
                <h2 className="head_30">{headline}</h2>
                <p className="parag_18">{text}</p>
            </div>
            <a href={appStore[1]} className={`about__store-button-mobile ${appStore[0]}`} target="_blank" onClick={() => sendChatMessage('app', ticketPostID)}></a>
            <div className="about__content">
                <p className="parag_24">{qr[0]}</p>
                <div className="about__buttons-desktop">
                    <a href={appStoreLink} className="about__store-button-desktop app-store" target="_blank" onClick={() => sendChatMessage('app', ticketPostID)}></a>
                    <a href={googleStoreLink} className="about__store-button-desktop google-store" target="_blank" onClick={() => sendChatMessage('app', ticketPostID)} ></a>
                </div>
            </div >
            <div className="about__cta">
                <p className="parag_20">{more}</p>
                <a className="basic-button" href={cta[1]} target="_blank" onClick={() => sendChatMessage('website', ticketPostID)}>{cta[0]}</a>
            </div>
        </>

    )
}



export default About;