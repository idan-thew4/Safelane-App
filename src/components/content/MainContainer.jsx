import React from "react";

const mainContainer = ({ section, title, text, content, illustration, slider, chat,  mobileNavBar, spinner}) => {

    const videoOutput = text != null ? true : false;

    return (
        <>
            <div className={`basic-grid main-content ${section}`}>
                {slider}
                <div className={videoOutput ? 'main-container' : 'main-container video'}>
                {mobileNavBar}
                    {videoOutput &&
                        <div className={`main-container__content`}>
                            <h1 className="head_40">{title}</h1>
                            <p className="parag_16">{text}</p>
                        </div>
                    }
                    <div className={`main-container__content-box`}>{content}</div>
                </div>
            </div>
            <div className="bottom-strip">
                {chat}
                <div className="basic-grid">
                    <div className="bottom-strip__container">
                        <img src={illustration} />
                    </div>
                </div>
            </div>
        </>

    )
}

export default mainContainer; 
