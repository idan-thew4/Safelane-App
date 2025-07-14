import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useStore } from "../../contexts/Store";




const ContactForm = () => {
  const { messages, setGeneratedReply, setUserDetails, ticket, url } = useStore();




  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();


  //Send form
  const sendDetails = async () => {

    setUserDetails([watch('email'), watch('tel')]);


    try {

      const response = await fetch(`${url}/wp-json/safelane-api/save-email-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            "email_address": watch('email'),
            "phone_number": watch('tel'),
            "ticket_id": ticket['ticket_id']
          }
        )
      });
      // const data = await response.json();
      setGeneratedReply('formDetailsSaved');


    } catch (error) {
      console.error('Error fetching data:', error);


    }



  }

  //Clear input if x button is pressed
  const handleClearInput = (fieldName) => {
    reset({
      [fieldName]: ''
    })
  }


  return (
    <>
      <p className="parag_14 form__title">איך לעדכן אותך? (אפשר גם בנייד וגם במייל)</p>
      <form className="form__contact form" onSubmit={handleSubmit(sendDetails)}>
        <div className={errors.email ? "form__input__wrapper with-errors" : "form__input__wrapper"}>
          <input
            className="form__input parag_16"
            type="text"
            placeholder=" "
            name="email"
            {...register("email", {
              required: !watch('tel'),
              pattern: { value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, message: "נא להזין כתובת אי-מייל נכונה" },
            })}
          />
          <label className="placeholder-text parag_16">אימייל</label>
          <button type="button" className={watch('email') ? "clearInput show" : "clearInput"} onClick={() => handleClearInput("email")}></button>
          {errors.email && (<p className="form__input__errors caption_15">{errors.email.message}</p>)}
        </div>
        <div className={errors.tel ? "form__input__wrapper with-errors" : "form__input__wrapper"} >
          <input
            className="form__input parag_16"
            type="tel"
            placeholder=" "
            name="tel"
            {...register("tel", {
              required: !watch('email'),
              minLength: { value: 5, message: "נא להזין לפחות 9 ספרות" },
              pattern: { value: /([\-0-9])/, message: "ניתן רק להזין מספרים ומקפים" },
            })}
          />
          <label className="placeholder-text parag_16">טלפון</label>
          <button type="button" className={watch('tel') ? "clearInput show" : "clearInput"} onClick={() => handleClearInput("tel")}></button>
          {errors.tel && (<p className="form__input__errors caption_15">{errors.tel.message}</p>)}
        </div>
        <div className="form__button__wrapper">
          <button
            className="basic-button"
            type="submit"
          // disabled={errors.email || errors.tel}
          >עדכן אותי</button>
        </div>
      </form>
    </>

  )





}

export default ContactForm;
