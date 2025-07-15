
import React, { useState, useContext, createContext, useEffect, useRef } from 'react'



const ApiContext = createContext([])


function useStore() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useStore should be used within ApiContext only');
  }
  return context;
}



//Illustrations
import loginIllustration from '../assets/illustrations/login.svg';
import videoIllustration from '../assets/illustrations/video.svg';
import detailsIllustration from '../assets/illustrations/details.svg';
import improveIllustration from '../assets/illustrations/improve.svg';
import aboutIllustration from '../assets/illustrations/about.svg';

const illustrationsArray = [loginIllustration, videoIllustration, detailsIllustration, improveIllustration, aboutIllustration]


//Temp copy array
const tempCopy = [
  {
    page: 'login',
    content: [{
      title: <>נעים מאוד<br></br> <span className='light'>אנחנו שומרי הדרך</span></>,
      text: 'אנחנו קבוצה של מתנדבים שמתעדים עבירות תנועה כדי לצמצם את מספר תאונות הדרכים',
      boxTitle: 'התחברות לצפייה בסרטון',
      boxText: 'מופיע במכתב שנשלח אליך',
      qrText: 'אחד מהמתנדבים שלנו תיעד את רכבך מבצע עבירת תנועה'
    }]
  },
  {
    page: 'ticket',
    content: [{
      title: 'סרטון התיעוד',
    },
    {
      title: 'פרטי העבירה',
    },
    {
      title: 'איך להשתפר',
      text: 'אספנו בשבילכם כמה טיפים קלים ונוחים כיצד למנוע את העבירה הבאה שלכם ולורם איפסום דולורס אמט'
    },
    {
      title: 'עוד עלינו',
      titleBox: 'רוצים לשמוע עוד?',
      headline: 'רוצים לקחת חלק בשינוי?',
      text: 'מורידים את אפליקציית המתנדבים שלנו, מתעדים עבירות ומצילים חיים.',
      qr: ['להורדת האפליקציה', 'https://www.techopedia.com/wp-content/uploads/2023/03/aee977ce-f946-4451-8b9e-bba278ba5f13.png'],
      more: 'רוצים לשמוע עוד עלינו?',
      cta: ['לאתר שלנו', 'https://www.shomriderech.org.il/'],
      appStoreLink: 'https://apps.apple.com/us/app/%D7%A9%D7%95%D7%9E%D7%A8%D7%99-%D7%94%D7%93%D7%A8%D7%9A/id6477154038',
      googleStoreLink: 'https://play.google.com/store/apps/details?id=com.safelane&hl=he&gl=US'
    }]
  },
  {
    initialMessage: [{
      text1: 'היי! ההתכתבות היא אנונימית לחלוטין',
      text2: 'כדי לשמור על פרטיותך אנחנו מעבירים את מס׳ הרכב שביצע את העבירה למשרד התחבורה, הם אלה ששלחו לך את המכתב',
      text3: 'נשמח לשמוע כל הערה או שאלה שיש לך',
    }],
    firstReplyMessage: [{
      text: 'תודה שפנית אלינו! הפניה שלך נשלחה לנציגים ונענה תוך 5 ימי עסקים. את התשובה ניתן יהיה לראות כאן, בקישור הצפייה בסרטון',
      cta: 'להעתקת הקישור',
      link: 'http://link.com/q232sdw',
      question: 'רוצה שנעדכן אותך כשתשובה תגיע?',
    }]
  },
]

const Store = ({ children }) => {

  //Apps hooks
  const [ticket, setTicket] = useState();
  const [copy, setCopy] = useState(tempCopy);
  const [chat, setChat] = useState({});
  const [illustrations] = useState(illustrationsArray);
  const [ticketId, setTicketId] = useState(null);
  const [messages, setMessages] = useState({});
  const messagesContainer = useRef();
  const [generatedReply, setGeneratedReply] = useState('');
  const [usersDetails, setUserDetails] = useState([]);
  let [formFilled, setFormFilled] = useState(false);
  const [redirectsQR, setRedirectsQR] = useState(false);
  const url = 'https://cms.lettersontheway.com/';



  //Set new cookies
  const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/ticket";
  }


  //Mobile
  const [activeOption, setActiveOption] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  //Get data from existing cookies
  const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


  // useEffect(() => {

  //   let updatedTicket = '';

  //   console.log('update')

  //   if (ticket && generatedReply === '') {
  //     console.log('setCookie-no Replay')
  //     updatedTicket = {
  //       ...ticket,
  //       chat: messages,
  //     };
  //   } 

  //   else if(ticket && generatedReply === 'replaySent') {
  //     console.log('setCookie-with Replay')
  //     updatedTicket = {
  //       ...ticket,
  //       chat: messages,
  //       replay: {
  //         ...ticket.replay, 
  //         sent: true,       
  //       },      
  //     };

  //   }

  //   const jsonCookie = encodeURIComponent(JSON.stringify(updatedTicket));
  //   // console.log(decodeURIComponent(jsonCookie))
  //   setCookie(`${ticketId}`, jsonCookie, 0.15);
  //   setTicket(updatedTicket);



  // }, [messages])



  //Fetch ticket data from endpoint GET
  const getTicketData = async (ticketId, carNum, qr = false) => {
    try {
      const response = await fetch(`${url}/wp-json/safelane-api/check-if-ticket-exists?ticket_id=${ticketId}&car_num=${carNum}`);
      const data = await response.json();
      //todo: check of ticket exists
      if (data.ticketExists) {
        const updatedTicket = {
          ...data,
          carNumber: getDashedNum(carNum),
        };

        if (Object.keys(data.chat).length === 0) {
          setGeneratedReply('sendWelcomeMessage');
        } else {
          setGeneratedReply('');
        }

        for (const key in data.chat) {
          if (data.chat[key][1] === "sendFormMessage") {
            setFormFilled(data.chat[key][2])
          }
          if (data.chat[key][1] === "formDetailsSaved") {
            setUserDetails([data.chat[key][2], data.chat[key][3]])
          }
        }

        setTicket(updatedTicket);

        const jsonCookie = JSON.stringify(updatedTicket);
        const encodedData = encodeURI(jsonCookie);
        setCookie(`${ticketId}`, jsonCookie, 0.15);
        // setCookie(`${ticketId}`, jsonCookie, 0.15);;



        if (!qr) {
          return data.ticketExists
        } else {
          return updatedTicket
        }

      }


    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  //Send updated chat data to endpoint POST
  const sendChatMessage = async (messages) => {
    try {
      const response = await fetch(`${url}/wp-json/safelane-api/save-chat-to-server`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messages)
      })
      const data = await response.json();
      // console.log(data)
      // setChat({ ...data.chat })
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  //Push dashes in carNum
  const getDashedNum = (input) => {
    const string = String(input)
    if (string.length === 7) {
      return string.replace(/(\d{2})(\d{3})(\d{2})/, '$1-$2-$3');
    } else if (string.length === 8) {
      return string.replace(/(\d{3})(\d{2})(\d{3})/, '$1-$2-$3');
    }
  }



  return (
    <ApiContext.Provider value={{
      ticket, setTicket,
      chat,
      copy,
      illustrations,
      getTicketData,
      sendChatMessage,
      setTicketId,
      messages,
      setMessages,
      messagesContainer,
      activeOption,
      setActiveOption,
      activeIndex,
      setActiveIndex,
      setGeneratedReply,
      generatedReply,
      setCookie,
      getCookie,
      getDashedNum,
      usersDetails,
      setUserDetails,
      formFilled,
      setFormFilled,
      redirectsQR,
      setRedirectsQR,
      url
    }}>
      {children}
    </ApiContext.Provider>
  )
}
export { Store, useStore }