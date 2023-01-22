import {Link} from 'react-router-dom'

function Header() {
  let headerContent;
  if (localStorage.getItem('jwt')) {
    headerContent = (
      <>
        <Link className="nav-link" to="#">Buy</Link>
        <Link className="nav-link" to="#">Rent</Link>
        <Link className="nav-link" to="/create-listing">Sell</Link>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            User
          </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
              <li><Link className="dropdown-item" to="/logout">Logout</Link></li>
            </ul>
        </li>
      </>
    )
  } else {
    headerContent = (
      <>
        <Link className="nav-link" to="#">Buy</Link>
        <Link className="nav-link" to="#">Rent</Link>
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
        <Link className="navbar-brand" to="/">KiasuKondos</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/">Home</Link>
            {headerContent}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;

