import React, { useState } from "react";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Register() {

    const [email, setEmail] = useState()
    const [name, setName] = useState()
    const [password, setPassword] = useState()
    const [balance, setBalance] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('https://tyler-blackjack.vercel.app/', {email, name, password, balance})
        .then(result => {console.log(result)
            navigate('/signin')
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="register">
            <div className="register-title">
                <h1>Welcome to Tyler's Blackjack</h1>
            </div>
        <div className="form">
            <h3>Create an Account to Start Playing!</h3>
        <Form onSubmit={handleSubmit} >
            <Form.Group className="form-group">
                <FloatingLabel label="Email" className="mb-3">
                    <Form.Control 
                    onChange={(e) => {setEmail(e.target.value)}}
                    required type="text" placeholder="Enter Email"></Form.Control>
                </FloatingLabel>
            </Form.Group>

            <Form.Group>
                <FloatingLabel 
                onChange={(e) => {setName(e.target.value)}}
                label="Name" className="mb-3">
                    <Form.Control required type="text" placeholder="Enter Name"></Form.Control>
                </FloatingLabel>
            </Form.Group>

            <Form.Group >
                <FloatingLabel
                onChange={(e) => {setPassword(e.target.value)}}
                label="Password" className="mb-3">
                    <Form.Control required type="password" placeholder="Password"></Form.Control>
                </FloatingLabel>
            </Form.Group>

            <Form.Group >
                <FloatingLabel 
                onChange={(e) => {setBalance(e.target.value)}}
                label="Starting Balance" className="mb-3">
                    <Form.Control required type="number" placeholder="Balance"></Form.Control>
                </FloatingLabel>
            </Form.Group>

            <Form.Group>
                <Form.Check className="form-check" required type="checkbox" label="19+"></Form.Check>
            </Form.Group>

            <Button type="submit">
                Register Now
            </Button>
        </Form>
        <p className="signin-link">
            Already a member? <Link to="/signin">Log In</Link>
        </p>
        </div>
        </div>
    )
}
