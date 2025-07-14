import React from "react";

//Data
import { useStore } from "../../contexts/Store";

//Content
import MainContainer from "../content/MainContainer.jsx";
import LoginForm from "../content/LoginForm.jsx";

const Login = () => {
    const { copy, illustrations } = useStore();



    return (
            <MainContainer
            section={copy[0].page}
            title = {copy[0].content[0].title}
            text = {copy[0].content[0].text}
            content = {<LoginForm/>}
            illustration={illustrations[0]}
            />
    )
}

export default Login;