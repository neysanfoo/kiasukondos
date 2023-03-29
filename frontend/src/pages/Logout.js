import axios from 'axios'
import React, { useState, useEffect } from 'react'

const baseURL = process.env.REACT_APP_BACKEND_URL + "/api"

function Logout() {
  useEffect(() => {
    var config = {
      method: 'post',
      url: baseURL + '/logout/',
      headers: {},
      withCredentials: true
    };

    axios(config)
      .then(function(response) {
        console.log(JSON.stringify(response.data));
        window.location.href = "/login"
      })
      .catch(function(error) {
        console.log(error);
      });

  }, [])

  return (
    <div>
    </div>
  )
}

export default Logout

