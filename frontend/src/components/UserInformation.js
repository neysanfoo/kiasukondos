import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser } from '@fortawesome/free-solid-svg-icons'
function UserInformation({ profilePic, name, email}) {

  return (
    <div>
      <FontAwesomeIcon className="listing--details--owner-card-profile" icon={faUser} />
      <h1>{name}</h1>
      <p>{email}</p>
      <p>Rating</p>
      <Link to="/edit-profile">
        <button>Edit Profile</button>
      </Link>
    </div>
  )
}

export default UserInformation
