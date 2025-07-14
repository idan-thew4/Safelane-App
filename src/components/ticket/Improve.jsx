import React from "react";

const Improve = ({ points, headlineMobile, textMobile}) => (
    <>
        <h2 className="improve__title-mobile head_30">{headlineMobile}</h2>
        <p className="improve__content-mobile parag_18">{textMobile}</p>
        <ul className="improve__points">
            {points.map((point, index) => (
                <li key={index}>
                    <div className="improve__image-container">
                        <img src={point.icon} />
                    </div>
                    <div className="improve__points__content">
                        <h2 className="head_20">{point.title}</h2>
                        <p className="parag_18">{point.content}</p>
                    </div>
                </li>
            ))}
        </ul>
    </>
)

export default Improve;