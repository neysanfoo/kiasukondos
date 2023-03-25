import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const baseURL = process.env.REACT_APP_BACKEND_URL + "/api";

function Login() {
    const [loginData, setLoginData] = useState({
        "email": "",
        "password": ""
    })
    const [auth, setAuth] = useState({})

    const [error, setError] = useState('')

    useEffect(() => {
        var config = {
            method: 'get',
            url: baseURL + '/user/',
            withCredentials: true
        };
        
        axios(config)
        .then(function (response) {
          window.location.href = "/homes"
        })
        .catch(function (error) {
            console.log(error);
        });
  

    }, [])

    function handleChange(event) {
        setLoginData({
        ...loginData,
        [event.target.name]: event.target.value
        })
    }

    const submitForm = async (e) =>{
      e.preventDefault()

      let data = JSON.stringify({
        "email": loginData.email,
        "password": loginData.password
      });


      let config = {
        method: 'post',
        url: baseURL + '/login/',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data,
        withCredentials: true
      };

      axios(config)
      .then(function (response) {
        window.location.href = "/homes"
      })
      .catch(function (error) {
        setError(error.response.data.error)
        console.log(error);
      });


    }
      

    // function submitForm(e) {
    //     e.preventDefault()



    //     axios.post(baseURL + '/login/', {
    //         email: loginData.email,
    //         password: loginData.password
    //     }, {
    //       withCredentials: true
    //     }
    //     ).then((response) => {
    //         console.log(response.data)
    //         if (response.data.jwt) {
    //           Cookies.save('jwt', response.data.jwt)
    //         }
    //         localStorage.setItem('jwt', response.data.jwt)
    //         setRedirect(true)
    //     }).catch((error) => {
    //         console.log(error.response.data.error)
    //         setError(error.response.data.error)
    //     }
    //     )
    // }


  return (
    <div className="Login ">
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={submitForm}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            value={loginData.email}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            value={loginData.password}
            required
          />
        </div>
        <button type="submit" className='btn btn-primary mt-4'>Login</button>
        <p className="mt-4">
            Don't have an account? <Link to="/register" className="link">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
