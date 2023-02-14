import axios from 'axios'
import React, { useState, useEffect } from 'react'

function Logout() {
    useEffect(() => {
        var config = {
          method: 'post',
          url: 'http://localhost:8000/api/logout/',
          headers: { },
          withCredentials: true
        };
        
        axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          window.location.href = "/login"
        })
        .catch(function (error) {
          console.log(error);
        });

    }, [])

    return(
      <div>
      </div>
    )
  }
  
  export default Logout
  