import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useStore } from "../../contexts/Store";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import safelaneLogo from '../../assets/safeLane_logo.svg';
import ralbadLogo from '../../assets/ralbad_logo.png';
import nativBatoach from '../../assets/nativ-batoach_logo.svg';
import loaderSVG from "../../assets/spinner_blue.svg";





const LoginForm = () => {
  const navigate = useNavigate();
  const { getTicketData, copy } = useStore();
  const [submitError, setSubmitError] = useState('');
  const [inputValues, setInputValues] = useState([])
  const [reCaptchaError, setReCaptchaError] = useState();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const openChat = queryParams.get('openChat') === 'true';
  const { id, carnum, qr } = useParams();

  const [timeLeft, setTimeLeft] = useState(60);
  // const [attempts, setAttempts] = useState(0);
  const attemptsRef = useRef(0);
  const [timeoutId, setTimeoutId] = useState(null);
  const [waitForResponse, setWaitForResponse] = useState(false);
  const recaptchaRef = useRef();
  const [loader, setLoader] = useState(false);


  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };


  useEffect(() => {
    if (id && carnum) {
      setValue('carNumber', carnum);
      setValue('ticketNumber', id);

    }
  }, [id, carnum]);

  //reCaptcha

  const onChange = () => {

    if (grecaptcha.getResponse() !== '') {
      setReCaptchaError()
    }

  }


  //Set up form hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    watch,
    setFocus,
    setValue
  } = useForm();

  const values = getValues();

  //Handel request 
  const handleLogin = async (e) => {
    attemptsRef.current += 1;


    if (grecaptcha.getResponse() !== '') {
      setLoader(true);


      const ok = await getTicketData(values.ticketNumber, values.carNumber.replace(/-/g, ''), false, grecaptcha.getResponse());

      if (ok) {
        setLoader(false);


        if (openChat) {
          // navigate(`/ticket/${values.ticketNumber}?openChat=true`);
          navigate(`/ticket/${values.ticketNumber}?openChat=true`);
        } else {
          navigate(`/ticket/${values.ticketNumber}`);

        }
        //to turn reCaptcha off//
        // navigate(`/ticket/${values.ticketNumber}`);




        // (async () => {
        //   try {
        //     const response = await fetch(`${window.location.protocol}//${window.location.hostname}/reCaptcha.php?token=${grecaptcha.getResponse()}`, {
        //       method: 'POST',
        //       headers: {
        //         'Content-Type': 'application/json'
        //       },
        //     })
        //     const data = await response.json();
        //     if (data.success) {


        //     } else {
        //       setReCaptchaError('נא לנסות שוב')
        //     }
        //   } catch (error) {
        //     console.error('Error fetching data:', error);
        //   }
        // })();



      } else if (attemptsRef.current >= 3) {
        setLoader(false);

        setTimeLeft(60)
        timer();
        setSubmitError(`עברת את מכסת השליחות. נסה שוב בעוד ${formatTime(timeLeft)}`);
        clearTimeout(timeoutId);
      } else {
        setLoader(false);

        setSubmitError("הפרטים שהזנתם אינם תואמים");
        setInputValues([values.ticketNumber, values.carNumber])
        setWaitForResponse(false);
        recaptchaRef.current.reset();

      }
    } else {
      setLoader(false);
      setReCaptchaError('אנא מלא');


    }


  };

  // Handel focus

  const handleBlur = (e) => {

    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      document.querySelector('.main-container').classList.remove('focus')
    }

  }

  const handleFocus = (e) => {

    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      document.querySelector('.main-container').classList.add('focus')
    }


  }

  useEffect(() => {

    if (
      inputValues[0] !== values.ticketNumber && submitError !== '' && !errors.ticketNumber
      ||
      inputValues[1] !== values.carNumber && submitError !== '' && !errors.carNumber
    ) {
      setSubmitError('');
    }





  }, [watch('ticketNumber'), watch('carNumber')])


  const handleClearInput = (fieldName) => {
    setFocus(fieldName)
    reset({
      [fieldName]: ''
    })

  }

  const disableDash = (event) => {
    if (event.code === "Minus") {
      event.preventDefault();
    }
  }

  const handelKeyDown = (event) => {

    const formatInput = (input) => {

      let formInput = input.replace(/-/g, '');

      if (formInput.length <= 2) {
        return formInput
      } else if (formInput.length >= 2 && formInput.length <= 5) {
        return formInput.replace(/(\d{2})/, '$1-');
      } else if (formInput.length >= 5 && formInput.length < 8) {
        return formInput.replace(/(\d{2})(\d{3})(\d{1})/, '$1-$2-$3');
      } else if (formInput.length >= 6 && formInput.length < 8) {
        return formInput.replace(/(\d{2})(\d{3})(\d{2})/, '$1-$2-$3');
      } else if (formInput.length === 8) {
        return formInput.replace(/(\d{3})(\d{2})(\d{3})/, '$1-$2-$3');
      }

      return formInput

    }

    event.target.value = formatInput(event.target.value);

  }

  //submission counter//

  const startTimeout = () => {
    const id = setTimeout(() => {

      attemptsRef.current = 0;
      startTimeout();

    }, 5000);

    setTimeoutId(id);
  };

  function timer() {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    if (timeLeft > 0) {
      setSubmitError(`עברת את מכסת השליחות. נסה שוב בעוד ${formatTime(timeLeft)}`);
    } else {
      setSubmitError();
      setWaitForResponse(false);
      recaptchaRef.current.reset();

      attemptsRef.current = 0;
    }
  }, [timeLeft]);

  return (
    <>
      <h2 className="head_20">{copy[0].content[0].boxTitle}</h2>

      {loader &&

        <img className="inner-loader" src={loaderSVG} />}
      <>
        <p className="parag_16">{copy[0].content[0].boxText}</p>

        <form className="form__login form" onSubmit={handleSubmit(handleLogin)}>

          {/* carNumber */}
          <div className={errors.carNumber || submitError ? "form__input__wrapper with-errors" : "form__input__wrapper"}>
            <input
              onFocus={handleFocus}
              onInput={(event) => handelKeyDown(event)}
              onKeyDown={(event) => disableDash(event)}
              className="form__input parag_16"
              type="tel"
              placeholder=" "
              // value={}
              maxLength="10"
              name="carNumber"
              {...register("carNumber", {
                required: "נא להזין מספר רכב",
                minLength: { value: 7, message: "נא להזין לפחות 7 ספרות" },
                pattern: { value: /^[0-9-]+$/, message: "נא להזין מספרים בלבד" },
              })}
              onBlur={handleBlur}

            />
            <label className="placeholder-text parag_16">מספר רכב</label>
            <button type="button" className={watch('carNumber') ? "clearInput show" : "clearInput"} onClick={() => handleClearInput("carNumber")}></button>
            {errors.carNumber && (<p className="form__input__errors caption_15">{errors.carNumber.message}</p>)}
          </div>

          {/* ticketNumber */}
          <div className={errors.ticketNumber || submitError ? "form__input__wrapper with-errors" : "form__input__wrapper"} >
            <input
              onFocus={handleFocus}
              className="form__input parag_16"
              type="tel"
              placeholder=" "
              maxLength="8"
              name="ticketNumber"
              {...register("ticketNumber", {
                required: "נא להזין מספר דיווח  ",
                // minLength: { value: 5, message: "נא להזין 5 ספרות" },
                pattern: { value: /^\d+$/, message: "נא להזין מספרים בלבד" },
              })}
              onBlur={handleBlur}
            />
            <label className="placeholder-text parag_16">מספר דיווח</label>
            <button type="button" className={watch('ticketNumber') ? "clearInput show" : "clearInput"} onClick={() => handleClearInput("ticketNumber")}></button>
            {errors.ticketNumber && (<p className="form__input__errors caption_15">{errors.ticketNumber.message}</p>)}
          </div>
          <div className="reCaptcha">
            <ReCAPTCHA
              sitekey="6LcngCkpAAAAAHfNhRLiViKue4MOhYsFzf4AzmNz"
              onChange={onChange}
              ref={recaptchaRef}
            />
            {reCaptchaError && <p className="form__input__errors caption_15">{reCaptchaError}</p>}
          </div>
          <div className="form__button__wrapper">
            {submitError && (<p className="form__input__errors caption_15">{submitError}</p>)}
            <button
              className="basic-button"
              disabled={errors.carNumber || errors.ticketNumber || submitError !== '' || reCaptchaError || waitForResponse || timeLeft > 0 && timeLeft <= 60}
              onClick={() => {

                if (!errors.carNumber && !errors.ticketNumber && submitError === '' && !reCaptchaError) {
                  handleSubmit();
                  if (timeoutId !== null) {
                    startTimeout()
                  }
                }
              }}
            >לצפייה בסרטון</button>
          </div>
        </form >
      </>




      <div className="login__logos">
        <img src={safelaneLogo} alt="SafeLane logo" />
        <img src={ralbadLogo} alt="ralbad logo" />
        <img src={nativBatoach} alt="nativ Batoach logo" />
      </div>


    </>
  );
};

export default LoginForm;

