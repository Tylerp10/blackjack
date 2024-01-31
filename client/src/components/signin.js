import React, { useState } from "react";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Signin() {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()


    function handleSubmit(e) {
        e.preventDefault();
    
        console.log(email, password);
        fetch("https://tyler-blackjack.onrender.com/signin", {
          method: "POST",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data, "userRegister");
            if (data.status === "Success") {
              window.localStorage.setItem("token", data.data);
              window.localStorage.setItem("loggedIn", true);
    
            navigate('/game')
            }
          });
      }

    return (
        <div className="signin">
            <div className="signin-title">
                <h1>Welcome to Tyler's Blackjack</h1>
            </div>
        <div className="signin-form">
            <h3>Sign In</h3>
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <FloatingLabel label="Email" className="mb-3">
                    <Form.Control
                    onChange={(e) => {setEmail(e.target.value)}}
                    type="text" placeholder="Enter Email"></Form.Control>
                </FloatingLabel>
            </Form.Group>

            <Form.Group >
                <FloatingLabel label="Password" className="mb-3">
                    <Form.Control
                    onChange={(e) => {setPassword(e.target.value)}}
                    type="password" placeholder="Password"></Form.Control>
                </FloatingLabel>
            </Form.Group>

            <Button type="submit">
                Sign In
            </Button>
        </Form>
        <p className="signin-link">
            Don't Have an Account? <Link to="/">Register Now</Link>
        </p>
        </div>
        </div>
    )
}