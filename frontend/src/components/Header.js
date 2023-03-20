import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios'

function Header() {
  let headerContent;
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    var config = {
        method: 'get',
        url: 'http://localhost:8000/api/user/',
        withCredentials: true
    };
    
    axios(config)
    .then(function (response) {
        setAuth(response.data)
    })
    .catch(function (error) {
        console.log(error);
    });

  }, [])

  if (auth) {
    headerContent = (
      <>
        <Link className="nav-link" to="/create-listing">Sell</Link>
        <Link className="nav-link" to="/chat">Messages</Link>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            User
          </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
              <li><Link className="dropdown-item" to="/logout">Logout</Link></li>
            </ul>
        </li>
      </>
    )
  } else {
    headerContent = (
      <>
        <Link className="nav-link" to="#"></Link>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            User
          </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><Link className="dropdown-item" to="/login">Login</Link></li>
              <li><Link className="dropdown-item" to="/register">Register</Link></li>
            </ul>
        </li>
      </>
    )
  }
    
  return (
    <nav className="navbar navbar-expand-lg navbar-light ">
      <div className="container">
        <a className="navbar-brand" href="/">KiasuKondos</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/homes">Buy</Link>
            {headerContent}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;

