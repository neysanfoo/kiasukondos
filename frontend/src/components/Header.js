import {Link} from 'react-router-dom'

function Header() {
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
            <a className="nav-link" href="#">Temp</a>
            <a className="nav-link" href="#">Temp</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;

