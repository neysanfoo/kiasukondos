import axios from "axios"
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import ListingCard from "../components/ListingCard";


function UserProfile() {
    const [profilePic, setProfilePic] = useState(null)
    const [myListings, setMyListings] = useState([])
    const [myReviews, setMyReviews] = useState([])
    const [userDetails, setUserDetails] = useState({
        username: '',
        phoneNumber: '',
        email: '',
    })
    const [currentUser, setCurrentUser] = useState(null)

    const user_id = useParams().user_id;

    useEffect(() => {
        var config = {
            method: 'get',
            url: 'http://localhost:8000/api/user/',
            withCredentials: true
        }

        axios(config)
        .then(function (response) {
            setCurrentUser(response.data.id)
        })
        .catch(function (error) {
            console.log(error);
        });
    })

    useEffect(() => {
        var config = {
            method: 'get',
            url: 'http://127.0.0.1:8000/api/public-user-profile/' + user_id,
            withCredentials: true,
        };
        axios(config)
        .then(function (response) { 
            setMyListings(response.data.listings)
            setMyReviews(response.data.reviews)
            setUserDetails({
                username: response.data.user.username,
                email: response.data.user.email,
                phoneNumber: response.data.profile.phone_number
            })
            console.log(response.data)
            setProfilePic("http://127.0.0.1:8000/" + response.data.profile.profile_picture)
        })
        .catch(function (error) {
            console.log(error);
        });

    }, [user_id]);

    console.log(myReviews)




    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-3 hide--when--small">
                    <h1>User Profile</h1>
                    <div>
                        <img className='edit-profile__current-photo' src={profilePic} alt="user" />
                        <h5 className="card-title">{userDetails.username}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{userDetails.email}</h6>
                        <p className="card-text">{userDetails.phoneNumber}</p>
                    </div>
                </div>
                <div className="col-9">
                        <div className="card-body">
                            <h5>Listings</h5>
                            <div className="row">
                            {myListings.length === 0 ? <h1>User does not have any listings yet</h1> : 
                                <div className="scrolling--listing--container">
                                {myListings.map((item) => (
                                    <div className='listing--in--scrolling--container'>
                                    <ListingCard
                                        id = {item.id}
                                        current_user_id = {currentUser}
                                        photo_main={"http://127.0.0.1:8000/" + item.photo_main}
                                        title={item.title}
                                        address={item.address}
                                        price={item.price}
                                        bedrooms={item.bedrooms}
                                        bathrooms={item.bathrooms}
                                        sqmeters={item.sqmeters}
                                        sale_or_rent={item.sale_or_rent}
                                        is_sold={item.is_sold}
                                    />
                                    </div>
                                ))}
                                </div>}
                            </div>
                            <h5 className="mt-4">Reviews</h5>
                            <div className="review-container">
                                {myReviews.length === 0 ? <h1>User does not have any reviews yet</h1> : 
                                myReviews.map((item) => (
                                    <div className="card" key={item.id}>
                                    <div className="card-body">
                                        <h5 className="card-title">{item.title}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">{item.reviewer_username}</h6>
                                        <div className="card-rating">
                                        <p className="card-text me-4">{item.rating}</p>
                                        <div className="stars">
                                            {[...Array(Math.floor(item.rating))].map((star, i) => (
                                            <i class="bi bi-star-fill" key={i}></i>
                                            ))}
                                            {item.rating % 1 !== 0 && <i class="bi bi-star-half"></i>}
                                        </div>
                                        </div>
                                        <p className="card-text">{item.review}</p>
                                    </div>
                                    </div>
                                ))
                                }
                                                        

                        </div>
                    </div>
                </div>
                </div>



        </div>
    )
}

export default UserProfile