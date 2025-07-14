import { useEffect, useRef } from "react";
import { useStore } from "../../contexts/Store";
import ContactForm from "./ContactForm";
import { HashRouter as Router, Routes, Navigate, Route, useLocation } from "react-router-dom";



const Messages = ({ content }) => {

    const { messagesContainer, copy, setGeneratedReply } = useStore();
    const link = useRef();
    const current = useLocation();
    let currentDate = '';

    useEffect(() => {

        Object.keys(content).map((item, index) => {

            if (index === 0) {
                currentDate = content[item][0];

            }
        });


    }, [content]);


    //Get current time by timestamp -function
    const getTimeStamp = (item, fullDAte = false) => {
        const time = new Date(parseInt(item));
        let formattedDate = '';
        const day = time.getDate().toString().padStart(2, '0');
        const month = (time.getMonth() + 1).toString().padStart(2, '0');
        const year = time.getFullYear();
        formattedDate = `${day}.${month}.${year}`;



        if (fullDAte) {
            const lastTime = new Date(currentDate);
            let differentDaysMonthsYears = time.getDate() !== lastTime.getDate() ||
            time.getMonth() !== lastTime.getMonth() ||
            time.getFullYear() !== lastTime.getFullYear();

        if (differentDaysMonthsYears) {
            const weekDay = time.getDay();
            const weekDays = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש',];
            currentDate = item;

            return <li className="full-date-stamp parag_14_main">{`יום  ${weekDays[weekDay]}’, ${formattedDate}`}</li>;
        } 



        } else {
            return `${time.getHours()}:${time.getMinutes()< 10?'0' + time.getMinutes():time.getMinutes()}`;
        }

    }

    //Copy link in auto replay message - function
    useEffect(()=>{

        const copy_buttons = document.querySelectorAll('.copy-button');


        copy_buttons.forEach((button)=> {

            button.addEventListener('click', ()=> {
            button.classList.add('copied');
            navigator.clipboard.writeText(button.innerHTML);
            button.innerHTML = 'הועתק';
            })

        });

    }, [content])







    //update users update choice input -function
    const updateMessageHandel = (e) => {
        setGeneratedReply(e.target.name);
    }

    //Print message according to users point in flow - function
    const autoReplayMessage = (messageType, timeStamp, firstValue, secondValue) => {


        switch (messageType.split('_')[0]) {
            case 'user':
                return <p className="parag_13 message__context">{content[messageType][1]}</p>;
                break;
            case 'admin':
                switch (content[messageType][1]) {
                    case "welcomeMessage":
                        return <div className="message__autoReply">
                            {Object.keys(copy[2].initialMessage[0]).map((item, index) => (
                                <p key={index} className="parag_13 message__context">{copy[2].initialMessage[0][`text${index + 1}`]}</p>
                            ))}
                        </div>;
                        break;
                    case "firstReplyMessage":
                        return <div className="message__autoReply">
                            <p className="parag_13 message__context">
                                {copy[2].firstReplyMessage[0]['text']}
                                <strong>{copy[2].firstReplyMessage[0]['cta']}</strong>
                                <button className="copy-button" ref={link} type="button">
                                   {`${window.location.origin}/login?openChat=true`}
                                </button>
                            </p>
                            <p className="parag_13 message__context">
                                {copy[2].firstReplyMessage[0]['question']}
                            </p>
                            {!firstValue ?
                                <>
                                    <div className="message__context-buttons">
                                        <button name={`approveUpdate_${timeStamp}`} onClick={(e) => updateMessageHandel(e)} className="basic-button button-small">כן, עדכנו אותי</button>
                                        <button name={`declineUpdate_${timeStamp}`} onClick={(e) => updateMessageHandel(e)} className="basic-button button-small secondary">לא, תודה</button>
                                    </div>
                                </>
                                :
                                null
                            }
                        </div>

                    case "sendFormMessage":
                        return <div className="message__context">
                            <ContactForm />
                        </div>
                        break;
                    case "formDetailsSaved":
                        return <p className="parag_13 message__context">
                            תודה שפנית אלינו!
                            <br></br>
                            נענה תוך 5 ימי עסקים.
                            <br></br>
                            כשתהיה לנו תשובה

                            {` ${firstValue ? "נשלח לך מייל לכתובת " + firstValue : ''}`}
                            <br></br>
                            {`${firstValue && secondValue ? 'ו' : ''}${secondValue ? "נסמס לך לנייד שמספרו " + secondValue : ''}`}
                        </p>
                        break;
                    case "noUpdatesSummaryMessage":
                        return <p className="parag_13 message__context">
                        
                            תודה שפנית אלינו!
                            <br></br>
                             נענה תוך 5 ימי עסקים.
                            <br></br>
                            התשובה לפנייתך תופיע בלינק בלבד.
                            <br></br>
                            רוצה ללמוד עוד על המיזם? <a href="https://www.rsa.org.il/" target="_blank">לאתר שומרי הדרך</a>
                        </p>
                    default:
                        return <p className="parag_13 message__context">{content[messageType][1]}</p>;

                }

        }

    }



    return (
        <ul className="messages" ref={messagesContainer}>
            {Object.keys(content).map((item, index) => {
                return content[item][1] === 'sendFormMessage' && content[item][2] ? null :
                <>
                {getTimeStamp(content[item][0], true)}

                    <li className={Object.keys(content).length>1?`message__single ${item.split('_')[0]}`:`message__single animate ${item.split('_')[0]}`
                } key={index}>
                        <p className="parag_10 message__time">{getTimeStamp(content[item][0])}</p>
                        {autoReplayMessage(item, content[item][0], content[item][2], content[item][3])}
                    </li>
                    </>
            })}
        </ul >
    )
}

export default Messages;