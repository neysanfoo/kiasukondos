import Tabs from "../components/Tabs"
import UserInformation from "../components/UserInformation";
import axios from "axios"
import { useState, useEffect } from "react";

const baseURL = process.env.REACT_APP_BACKEND_URL

function Dashboard() {

  const [myPurchases, setMyPurchases] = useState([])
  const [myListings, setMyListings] = useState([])
  const [myLikes, setMyLikes] = useState([])
  const [user, setUser] = useState(null)
  const [name, setName] = useState(null)
  const [rating, setRating] = useState(null)
  const [email, setEmail] = useState(null)
  const [profilePic, setProfilePic] = useState(null)

  useEffect(() => {
    var config = {
      method: 'get',
      url: baseURL + '/api/purchases/',
      withCredentials: true,
    };
    axios(config)
      .then(function(response) {
        // set myPurchases to the listings in response.data

        setMyPurchases(response.data.map((purchase) => purchase.listing))

        console.log(response.data)
      }).catch(function(error) {
        console.log(error);
      });

    config = {
      method: 'get',
      url: baseURL + '/api/listings-by-user/',
      withCredentials: true,
    };
    axios(config)
      .then(function(response) {
        setMyListings(response.data)
        console.log(response.data)
      }).catch(function(error) {
        console.log(error);
      });

    config = {
      method: 'get',
      url: baseURL + '/api/likes/',
      withCredentials: true,
    };
    axios(config)
      .then(function(response) {
        setMyLikes(response.data.map((like) => like.listing))
      }).catch(function(error) {
        console.log(error);
      });

    config = {
      method: 'get',
      url: baseURL + '/api/user-profile/',
      withCredentials: true,
    };
    axios(config)
      .then(function(response) {
        console.log(response);
        setUser(response.data.user.id)
        setName(response.data.user.username)
        setEmail(response.data.user.email)
        setProfilePic(response.data.profile.profile_picture)
      }).catch(function(error) {
        console.log(error);
      });

  }, [user])



console.log(user)

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-3">
          
          <UserInformation
            profilePic={profilePic}
            name = {name}
            email = {email}
          />
        
        </div>
        <div className="col-9">
          <Tabs
            current_user_id={user}
            myListings={myListings}
            myLikes={myLikes}
            myPurchases={myPurchases}
          />
        </div>
      </div>
    </div>

  )
}

export default Dashboard
