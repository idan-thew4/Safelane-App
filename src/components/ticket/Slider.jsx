import React from 'react';
import { useStore } from "../../contexts/Store";


//Data

const Slider = ({ setActiveOption }) => {

    //Data
    const {copy, activeIndex, setActiveIndex} = useStore();

    const handleButtonClick = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
        setActiveOption(index);
    };



    return (
        <>
        <div className={"slider"}>
            {copy[1].content.map((option, index) => (
                <button
                    className={index === activeIndex ? 'active' : null}
                    key={index}
                    onClick={() => handleButtonClick(index)}
                    disabled={index === activeIndex}
                >
                    {option.title}
                </button>
            ))}
        </div>
        </>
    );
};


export default Slider;