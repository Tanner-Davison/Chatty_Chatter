import { useState } from "react";
import './Login.css';


const Login = () =>{

const submitHandler =() =>{
    
}
    return (
      <>
        <form onSubmit={submitHandler}>
            
          <h1>New to Chatty-Chatter? </h1>
          <h2>Create a Free Account!</h2>

          <div className={"CreateUser"}>
            <label htmlFor="username-id">
              {" "}
              Username:
            </label>
              <input type="text" id="username-id" />
          </div>
        </form>
      </>
    );

}
export default Login;