import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser } from '@fortawesome/free-solid-svg-icons'
function UserInformation({ profilePic, name, email}) {
  return (
    <div>
      <img className='edit-profile__current-photo' src={profilePic} alt="user" />
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
