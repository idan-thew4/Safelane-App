import React from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../contexts/Store";



const MobileNavBar = () => {

    const { id } = useParams();
    const {setActiveOption} = useStore();

    const backToVideo = () => {
        setActiveOption(0)
        }

    return (
        <nav className="mobile-nav-bar">
            <button onClick={backToVideo} className="back-button"></button>
            <p className="parag_16">מס' אירוע {id}</p>
        </nav>
    )

}

export default MobileNavBar;