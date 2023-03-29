import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';

const baseURL = process.env.REACT_APP_BACKEND_URL + "/api";

function ProtectedRoute({ component: Component, ...rest }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    var config = {
      method: 'get',
      url: baseURL + '/user/',
      withCredentials: true
    };

    axios(config)
      .then(function(response) {
        setIsAuth("true")
        setIsLoading(false)
      })
      .catch(function(error) {
        setIsLoading(false)
      });

  }, [])

  return (
    <div>
      {isLoading ? (<div>Loading...</div>) : (isAuth ? (<Outlet />) : (<Navigate to="/login" />))}
    </div>
  )
}

export default ProtectedRoute
