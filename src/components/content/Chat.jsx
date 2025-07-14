import React, { useEffect, useRef, useState } from "react";
import Modal from 'react-modal';
import Messages from '../content/Messages'
import { useStore } from "../../contexts/Store";

const Chat = ({ ticketRef, openChat }) => {

    //Chat hooks
    const [chatIsOpen, setChatIsOpen] = useState(openChat);
    const [chatCopy, setChatCopy] = useState()
    const { messages, setMessages, usersDetails, sendChatMessage, formFilled, setFormFilled, setCookie, setUserDetails } = useStore();
    const [inputValue, setInputValue] = useState('');
    const { messagesContainer, generatedReply, setGeneratedReply } = useStore();
    const [disabledForm, setDisabledForm] = useState(
    );


    useEffect(() => {

        for (const key in messages) {
            if (messages[key][1] === "firstReplyMessage") {
                if (messages[key].length === 2) {
                    setDisabledForm(true)
                } else {
                    setDisabledForm(false)
                }
            }
        }

    }, [messages]);


    useEffect(() => {

        if (openChat) {
            scrollToBottom(1000);
        }


    }, [openChat])




    //input ref
    const messageReplay = useRef();

    //Chat copy function
    const chatMobileCopy = <>יש לך שאלות? <strong>ליצירת קשר אנונימית </strong> </>;

    const chatToggleHandel = () => {
        setChatIsOpen((prevState) => !prevState); // Toggle the value
        if (!chatIsOpen) {
            scrollToBottom(1000);
        }
        if (generatedReply === 'sendWelcomeMessage') {
            setGeneratedReply('welcomeMessage')
        }

    }




    //scroll to Bottom
    const scrollToBottom = (time) => {
        if (messagesContainer) {
            setTimeout(() => {
                const getScrollHeight = messagesContainer.current.scrollHeight;
                messagesContainer.current.scrollTo({ top: getScrollHeight, behavior: "smooth" });
            }, time)
        }
    }



    //update messages
    useEffect(() => {
        if (ticketRef) {
            setMessages(ticketRef.chat);

            for (const key in ticketRef.chat) {
                if (ticketRef.chat[key][1] === "sendFormMessage") {
                    setFormFilled(ticketRef.chat[key][2])
                }
                if (ticketRef.chat[key][1] === "formDetailsSaved") {
                    setUserDetails([ticketRef.chat[key][2], ticketRef.chat[key][3]])
                }




            }

            if (Object.keys(ticketRef.chat).length === 0) {
                setGeneratedReply('sendWelcomeMessage');
            } else {
                setGeneratedReply('');
            }
        }

    }, [ticketRef])

    //change chat copy according to breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth < 1023) {
            setChatCopy(chatMobileCopy)
        }
    })

    //change chat copy according to breakpoint
    useEffect(() => {

        handleResize()

        function handleResize() {
            if (window.innerWidth < 1023) {
                setChatCopy(chatMobileCopy)
            } else {
                setChatCopy(<>דברו איתנו</>)
            }
        };

        window.addEventListener('resize', handleResize);



    }, [])



    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handelChatReplay(e); // Call your form submission function
        }
    }




    //Send user message
    const handelChatReplay = (e) => {
        e.preventDefault();
        const replay = messageReplay.current.value;



        if (replay !== '') {

            if (replay === 'clear') {

                //Save in cookies
                let updatedTicket = {
                    ...ticketRef,
                    chat: {},
                };

                const jsonCookie = JSON.stringify(updatedTicket);
                const encodedData = encodeURI(jsonCookie);
                setCookie(`${ticketRef['ticket_id']}`, jsonCookie, 0.15);
                location.reload();


            } else {
                updateChat(replay, 'user')
                messageReplay.current.value = '';
                setInputValue('');
                setGeneratedReply('')

                if (!formFilled) {
                    setGeneratedReply('firstReplyMessage');

                } else {
                    setGeneratedReply('formDetailsSaved');
                }
            }



        } else {
            console.log('Please type some text')
        }
    }


    //Update chat function
    const updateChat = (replay, key, state, updateValue) => {

        let replayData = [Date.now(), replay];
        let replayKey = `${key}_${Date.now()}`;

        if (updateValue && replay !== 'formDetailsSaved') {
            replayData = [parseInt(replay.split('_')[1]), updateValue, state];
            replayKey = `${key}_${replay.split('_')[1]}`;
        } else if (replay === 'formDetailsSaved') {
            replayData = [Date.now(), replay, state, updateValue];
            replayKey = `${key}_${Date.now()}`;
        }


        //Update Messages setter 
        const updatedMessages = { ...messages, [replayKey]: replayData };

        scrollToBottom(500);
        setMessages(updatedMessages);

        //Send updated messages 

        if (replay !== 'welcomeMessage') {

            sendChatMessage({
                ticket_id: ticketRef['ticket_id'],
                time_stamp: Date.now(),
                data: updatedMessages,
                waiting_for_response: true
            });

            //Save in cookies
            let updatedTicket = {
                ...ticketRef,
                chat: updatedMessages,
            };

            const jsonCookie = JSON.stringify(updatedTicket);
            const encodedData = encodeURI(jsonCookie);
            setCookie(`${ticketRef['ticket_id']}`, jsonCookie, 0.15);




        }











    }


    //Print message according to user flow state
    useEffect(() => {

        if (generatedReply !== '') {

            switch (generatedReply.split('_')[0]) {
                case 'welcomeMessage':
                    setGeneratedReply('');
                    updateChat('welcomeMessage', 'admin', true);
                    break
                case 'firstReplyMessage':
                    setGeneratedReply('');
                    setTimeout(() => {
                        updateChat('firstReplyMessage', 'admin', false);
                    }, 2000);
                    document.querySelector('.chat__form').classList.add('disabled')


                    break;
                case 'declineUpdate':
                    updateChat(generatedReply, 'admin', true, 'firstReplyMessage');
                    setGeneratedReply('firstReplyMessage-no');

                    break;
                case 'approveUpdate':
                    updateChat(generatedReply, 'admin', true, 'firstReplyMessage');
                    setGeneratedReply('firstReplyMessage-yes');
                    break;
                case 'formDetailsSaved':
                    setTimeout(() => {
                        updateChat(generatedReply, 'admin', usersDetails[0], usersDetails[1]);
                        setGeneratedReply('saveFormStatus');
                    }, 2000);

            }

        }

    }, [generatedReply])

    //Print message according to user's update choice
    useEffect(() => {
        if (generatedReply === 'firstReplyMessage-yes') {
            updateChat('כן, עדכנו אותי', 'user');
            setGeneratedReply('sendFormMessage')
        }

        if (generatedReply === 'firstReplyMessage-no') {
            updateChat('לא, תודה', 'user');
            setGeneratedReply('noUpdatesSummaryMessage')
        }

    }, [generatedReply])

    useEffect(() => {

        if (generatedReply === 'noUpdatesSummaryMessage') {
            updateChat(generatedReply, 'admin', true);
        }


    }, [generatedReply])

    //Print form if user choose to be updated
    useEffect(() => {

        if (generatedReply === 'sendFormMessage') {
            setTimeout(() => {
                updateChat(generatedReply, 'admin');
            }, 2000);
            setFormFilled(true);


        }

    }, [generatedReply])

    //Update form was sent and saved
    useEffect(() => {
        if (generatedReply === 'saveFormStatus') {
            for (const key in messages) {
                if (messages[key][1] === "sendFormMessage") {
                    messages[key][2] = true;
                    updateChat(key, 'admin', true, 'sendFormMessage');
                }
            }
            setGeneratedReply('')
        }


    }, [generatedReply])



    const chatTypeHandel = async () => {

        const replay = await messageReplay.current.value;
        setInputValue(replay);
    }




    return (
        <div className="chat">
            <button onClick={chatToggleHandel}>{chatCopy}</button>
            <Modal
                closeTimeoutMS={2000}
                isOpen={chatIsOpen}
                contentLabel="Selected Option"
                ariaHideApp={false}
                portalClassName="chat-modal"
                style={{
                    content: {
                        position: 'absolute',
                        top: 'unset',
                        left: '5.1rem',
                        right: 'unset',
                        bottom: '7.1rem',
                        borderRadius: '1.7rem',
                        outline: 'none',
                        padding: '0',
                        border: 'none',
                        overflow: 'hidden'
                    }
                }}
            >
                <div className="chat__header">
                    <button className="chat__close" onClick={chatToggleHandel}></button>
                    <p className="parag_13">יצירת קשר</p>
                </div>
                {/* {!Object.keys(messages).length ? <div>Loading</div> : <Messages content={messages}></Messages>} */}
                {<Messages content={messages}></Messages>}
                <form className={disabledForm ? 'chat__form disabled' : 'chat__form'} onSubmit={handelChatReplay} >
                    <textarea
                        onInput={chatTypeHandel}
                        className="chat__input parag_16"
                        ref={messageReplay}
                        placeholder="מה רצית להגיד לנו?"
                        name="messageReplay"
                        onKeyDown={handleKeyDown}
                    />

                    <button className="chat_submit_button"
                        disabled={!inputValue}>
                    </button>
                </form>
            </Modal>
        </div>
    )
}
export default Chat;