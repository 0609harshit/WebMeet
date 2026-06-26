import { useState, useContext } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import { Context } from "../context/manageContext.jsx";
import dotenv from 'dotenv';
dotenv.config();


export const Login = () => {

    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState('0');

    const navigate = useNavigate();
    const {manageContextOnLogin} = useContext(Context);

    const bakendURl = process.env.BAKEND_SERVER;

    const register = async (name, userName, password) => {
        if (status === '0') {
            try {
                let response = await axios.post(`${bakendURL}/user/register`, {
                    name: name,
                    userName: userName,
                    password: password
                    
                })
                console.log(response);
                setStatus('1');
            }
            catch (err) {
                console.log(err.response.data);
            }
        }
    }

    const login = async(userName, password)=>{
        try{
            let response = await axios.post('http://localhost:3000/user/login', {
                userName: userName,
                password: password
            })
            
            manageContextOnLogin(response.data.user);
            navigate('/choice');
        }
        catch(err){
            console.log(err);
        }
    }


    return (
        <>
            <div className="login-container">
                <div className="login-box">
                    <div className="auth-option">
                        <button onClick={()=>{setStatus('1')}} id="auth-signIn" >SignIn</button>
                        <button onClick={()=>{setStatus('0')}} >SignUp</button>

                    </div>
                    <div className="login">
                        {status==='0'&&(<><input type="text" placeholder="Enter name" class="login-form" id="name" onChange={(e)=>{setName(e.target.value)}} />
                        <br /></>)}
                        <input type="text" placeholder="Enter Username" className="login-form" id="username" onChange={(e)=>{setUserName(e.target.value)}}/>
                        <br />
                        <input type="password" placeholder="Enter password" className="login-form" id="password" onChange={(e)=>{setPassword(e.target.value)}}/>
                    </div>
                    <div className="submit">
                        <button onClick={()=>{
                            if(status==='0'){
                                register(name, userName, password);
                            }
                            else login(userName, password);
                        }}>Submit</button>
                    </div>
                </div>

            </div>
        </>
    )
}