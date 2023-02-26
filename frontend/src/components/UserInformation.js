import { Link } from 'react-router-dom'

function UserInformation({ profilePic }) {

    return(
        <div>
            <img className='edit-profile__current-photo' src={profilePic} alt="user" />
            <h1>Name</h1>
            <p>Rating</p>
            <Link to="/edit-profile">
                <button>Edit Profile</button>
            </Link>
        </div>
    )
}

export default UserInformation