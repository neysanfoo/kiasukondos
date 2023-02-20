import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link, Navigate } from 'react-router-dom'
import LikeButton from '../components/LikeButton'
const baseURL="http://127.0.0.1:8000/api"

function ListingDetails() {
    const [listingData, setListingData] = useState([])
    const [isOwner, setIsOwner] = useState(false)
    const [user_id, setUserId] = useState(null)
    const { listing_id } = useParams()
    const [offer, setOffer] = useState(0)

    useEffect(() => {
        axios.get(baseURL + "/listings/" + listing_id + "/").then((response) => {
            setListingData(response.data)
        })

    }, [])


    useEffect (() => {
        // Check if the current user logged in is the owner of the listing
        // If he is then add a button that routes to "edit-listing/" + listing_id
        var config = {
            method: 'get',
            url: 'http://localhost:8000/api/user/',
            withCredentials: true
        };
        axios(config)
        .then(function (response) {
            if (response.data.id === listingData.owner) {
                setIsOwner(true)
            }
            setUserId(response.data.id)
        }
        ).catch(function (error) {
            console.log(error);
        }
        );
    }, [listingData])

    function getPropertyType() {
        if (listingData.property_type === 1) {
            return "HDB"
        } else if (listingData.property_type === 2) {
            return "Condominium"
        } else if (listingData.property_type === 3) {
            return "Landed"
        } else {
            return "Other"
        }
    }

    function makeOffer() {
        var data = JSON.stringify({
            "listing": listing_id,
            "price": offer
        });
        var config = {
            method: 'post',
            url: 'http://localhost:8000/api/add-offer/',
            headers: {
                'Content-Type': 'application/json'
            },
            data : data,
            withCredentials: true
        };
        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            window.location.href = "/chat"
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    function handleChange(e) {
        setOffer(e.target.value)
    }
    

    function getSaleOrRent() {
        if (listingData.sale_or_rent === 1) {
            return "Sale"
        } else if (listingData.sale_or_rent === 2) {
            return "Rent"
        }
    }
    console.log(user_id, listing_id)

    function deleteListing() {
        var config = {
            method: 'delete',
            url: 'http://localhost:8000/api/listings/' + listing_id + '/',
            headers: { },
            withCredentials: true
        };
        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            window.location.href = "/"
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    function createChatId() {
        // return the string of sorted ids with a -
        // sort the ids
        var ids = [user_id, listingData.owner]
        ids.sort()
        // create the string
        var chatId = ids[0] + "-" + ids[1]
        return chatId
    }

    function createChat() {
        var chatId = createChatId()
        var data = JSON.stringify({
            "chatId": chatId,
            "user1": user_id,
            "user2": listingData.owner
        });
        var config = {
            method: 'post',
            url: 'http://localhost:8000/api/chat/',
            headers: {
                'Content-Type': 'application/json'
            },
            data : data,
            withCredentials: true
        };
        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            window.location.href = "/chat"
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    const photos = [
      listingData.photo_1,
      listingData.photo_2,
      listingData.photo_3,
      listingData.photo_4,
      listingData.photo_5,
      listingData.photo_6,
    ].filter((photo) => photo !== null);

    return(
        <div className='container mt-4'>
            <h1 className='listing--details--title'>{ listingData.title }</h1>
            <div className="listing--details">
                {/* Carousel Start */}
                <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">
                    <div class="carousel-item active"> 
                        <img src={listingData.photo_main} class="d-block w-100" alt="..." />
                    </div>
                    {photos.map((photo, index) => (
                        <div class="carousel-item">
                            <img src={photo} class="d-block w-100" alt="..." />
                        </div>
                    ))}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
                </div>
                {/* Carousel End */}
            <div className="listing--details--info">
                <h2>{listingData.property_type === 1 ? "HDB" : listingData.property_type === 2 ? "Condo" : "Landed"} for {listingData.sale_or_rent === 1 ? "Sale" : "Rent"}</h2>
                <p><b>Owner Name: </b> { listingData.owner_name } </p>
                <p><b>Address: </b> { listingData.address }</p>
                <p><b>Zipcode: </b> { listingData.zipcode }</p>
                <p><b>Property Type: </b>{ getPropertyType(listingData.property_type) }</p>
                <p><b>Sale or Rent: </b>{ getSaleOrRent(listingData.sale_or_rent) }</p>
                <p><b>Price: </b> { listingData.price }</p>
                <p><b>Bedrooms: </b> { listingData.bedrooms }</p>
                <p><b>Bathrooms: </b> { listingData.bathrooms }</p>
                <p><b>Size: </b>{ listingData.sqmeters } Square Meters</p>
                <p><b>Description: </b>{ listingData.description }</p>
                </div>
            </div>
            { user_id && listing_id && 
            <LikeButton
                user_id={user_id}
                listing_id={listing_id}
             />
            } 
            { user_id && listing_id && listingData.owner && listingData.owner !== user_id && 
            <div>
                <input name="offer" value={offer} onChange={handleChange} type="number" />
                <button type="button" onClick={makeOffer}>Make Offer</button>
            </div>
            }
            {
                user_id && listing_id && listingData.owner && listingData.owner !== user_id &&
                <button type="button" onClick={createChat}>Chat with Owner</button>
            }
            {isOwner &&
                <div>
                <Link to={'/edit-listing/' + listing_id}>
                <button type="button">Edit Listing</button>
                </Link>
                </div>
            }
            {isOwner &&
                <div>
                <button type="button" onClick={deleteListing}>Delete Listing</button>
                </div>
            }
        </div>
    )
}

export default ListingDetails