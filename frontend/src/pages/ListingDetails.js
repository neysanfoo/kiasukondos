import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Link, Navigate } from 'react-router-dom'
import LikeButton from '../components/LikeButton'
import PriceTable from '../components/PriceTable'
import LineGraph from '../components/LineGraph'

import {Swiper, SwiperSlide} from "swiper/react"
import {Autoplay, Pagination, Navigation} from 'swiper';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faBath, faBed, faLocationDot, faExpand } from '@fortawesome/free-solid-svg-icons'
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
  });

L.Marker.prototype.options.icon = DefaultIcon;



const baseURL="http://127.0.0.1:8000/api"

function ListingDetails() {
    const [listingData, setListingData] = useState([])
    const [isOwner, setIsOwner] = useState(false)
    const [user_id, setUserId] = useState(null)
    const { listing_id } = useParams()
    const [offer, setOffer] = useState(0)
    const [predictedRentPrice, setPredictedRentPrice] = useState([])
    const [timeframe, setTimeframe] = useState(1)
    const [predictedResalePrice, setPredicetedResalePrice] = useState([])

    useEffect(() => {
        axios.get(baseURL + "/listings/" + listing_id + "/").then((response) => {
            setListingData(response.data)
            // if it is a hdb, get analytics
            if (response.data.property_type === 1) {
                axios.get(baseURL + "/listing-analytics/" + listing_id + "?timeframe=12" ).then((response) => {
                    if (response.data.predicted_resale_price) {
                        setPredicetedResalePrice(response.data.predicted_resale_price.predicted_mean)
                    } 
                    if (response.data.predicted_rent_price) {
                        setPredictedRentPrice(response.data.predicted_rent_price.predicted_mean)
                    }
                }
                ).catch(function (error) {
                    console.log(error);
                }
                );
            }
        })

    }, [])

    console.log(listingData.sale_or_rent === 1 ? predictedResalePrice : predictedRentPrice)

    function changeTimeframe(e) {
        // get the new data
        const newTime = e.target.value
        axios.get(baseURL + "/listing-analytics/" + listing_id + "?timeframe=" + e.target.value * 12).then((response) => {
            if (response.data.predicted_resale_price) {
                setPredicetedResalePrice(response.data.predicted_resale_price.predicted_mean)
            }
            if (response.data.predicted_rent_price) {
                setPredictedRentPrice(response.data.predicted_rent_price.predicted_mean)
            }
            setTimeframe(newTime)
        }
        ).catch(function (error) {
            console.log(error);
        })
        // handle the select
    }

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
            url: 'http://localhost:8000/api/adcarousel-item-cardoffer/',
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
            window.location.href = "/homes"
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

    function AnalyticsTitle() {
        return (
            <div className="analytics--title">
                <h3>Analytics for <b>{listingData.bedrooms}-Room</b> HDBs for <b>{listingData.sale_or_rent === 1 ? "Sale" : "Rent"}</b> in <b>{listingData.town}</b></h3>
            </div>
        )

    }

    /**
     * This builds the photos modal using the SwiperJS library
     * @returns Photos Modal
     */

    function SwiperModal() {
        const [isOpen, setIsOpen] = useState(false);
        const [activeIndex, setActiveIndex] = useState(0);

        const handleCloseModal = () => {
            setIsOpen(false);
        };

        const handleOpenModal = (index) => {
            setActiveIndex(index);
            setIsOpen(true);
        };

        return (
            <>
            <Swiper
                centeredSlides={true}
                autoplay = {{
                    delay: 2500,
                    disableOnInteraction: true,
                }}
                navigation
                loop
                pagination={{
                    clickable: true,
                }}
                slidesPerView={3}
                spaceBetween={10}
                className="mySwiper"
                modules={[Autoplay, Pagination, Navigation]}
            >
                <SwiperSlide> 
                        <img src={listingData.photo_main} id = "photo_main" style = {{height: "100%", aspectRatio: "4/3",  borderRadius: "5px"}} alt="..." onClick={() => handleOpenModal(0)}/>
                </SwiperSlide>
                {photos.map((photo, index) =>(
                    <SwiperSlide class="swiper-slide img"  >
                        <img src={photo} onClick={() => handleOpenModal(index + 1)} style = {{height: "100%", aspectRatio: "4/3",  borderRadius: "5px"}} alt="..." />
                    </SwiperSlide>
                ))}
                
            </Swiper>
                {isOpen &&
                    <div className="modal">
                    <div className="modal-content" >
                        <span className="closeModal" >
                            <button type = "button" style={{position: "absolute", top: "2%", left: "97%", color:"#999", backgroundColor: "white", borderRadius: "50%", border:'none', zIndex: "2", fontWeight: "bold"}} onClick={handleCloseModal}> X </button>
                            <Swiper
                            id="modalSwiper"
                            style={{ width: '100%', height: '100%', zIndex: "1"}}
                            initialSlide={activeIndex}
                            loop={true}
                            navigation={true}
                            pagination={{
                                clickable: true,
                            }}
                            
                            modules = {[Navigation, Pagination]}
                            >
                            <SwiperSlide> 
                                <img src={listingData.photo_main} id = "photo_main"  alt="..." />
                            </SwiperSlide>
                            {photos.map((photo, index) =>(
                                <SwiperSlide key = {index} class="swiper-slide img" >
                                    <img src={photo} alt="..." />
                                </SwiperSlide>
                            ))}
                            
                            </Swiper>
                        </span>
                    </div>
                    </div>
                }
            </>
        );
    }

    /**
     * Stuff I added
     * This calls a map api to show the location of the given address
     */
    const mymap = useRef(null);
    
    useEffect(()=>{
        const map = L.map(mymap.current).setView([1.3521, 103.8198], 12);
        // Add a tile layer to the map
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Map data &copy; OpenStreetMap contributors",
        maxZoom: 18,
        }).addTo(map);
        const address = listingData.address;
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1`;
        console.log(url)
        if (url !== undefined){
            fetch(url)
            .then(response => response.json())
            .then(data => {
                //check if address is valid
                if (data.length !== 0){
                    const lat = data[0].lat;
                    const lon = data[0].lon;
                    //change view
                    map.setView([lat,lon],14);
                    // Add a marker to the map at the latitude and longitude coordinates
                    L.marker([lat, lon]).addTo(map).bindPopup(listingData.address);
                }
                else{
                    L.marker([1.3521,  103.8198]).addTo(map).bindPopup("Address Not Found");
                }            
            });
        }
        
        
        return () => {
            // Clean up the map when the component unmounts
            map.remove();
        };
    },[listingData])
    
    return(
        <div className='container mt-4'>
            <h1 className='listing--details--title'>{ listingData.title }</h1>
            <div className="listing--details">
            
                <div>{SwiperModal()}</div>
            
                {/*
                {/* Carousel Start }
                
                <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">

                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                    {
                        photos.map((photo, index) => (
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index + 1} aria-label={`Slide ${index + 2}`}></button>
                        ))
                    }
                </div>

                <div class="carousel-inner">
                    <div class="carousel-item active"> 
                        <img src={listingData.photo_main} class="d-block rounded 10 w-100"  alt="..." />
                    </div>
                    {photoCards.map((photo, index) => (
                        <div class="carousel-item">
                            <img src={photo[0]} class="carousel-item-left" alt="..." />
                            <img src={photo[1]} class="carousel-item-mid" alt="..." />
                            <img src={photo[2]} class="carousel-item-right" alt="..." />
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

                    </div> */}
                
            <div className="listing--details--info">
                <h1>{listingData.property_type === 1 ? "HDB" : listingData.property_type === 2 ? "Condo" : "Landed"} for {listingData.sale_or_rent === 1 ? "Sale" : "Rent"}
                
                { user_id && listing_id && 
                <b style={{marginLeft: "20px"}}>
                <LikeButton
                    user_id={user_id}
                    listing_id={listing_id}
                    />
                    </b>
                } 
                
                </h1>
                
                <h2><b>Price: </b> <FontAwesomeIcon icon={ faDollarSign } />{ listingData.price }</h2>
                
                <div style={{position: "absolute", top: "65%", left: "70%"}}>
                        <b>Owner Name: </b> <Link to={/user-profile/ + listingData.owner}>{ listingData.owner_name }</Link>
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
                </div> 
                <div style={{ fontSize: "16px"}}>
                    <b>Number of Bedrooms: </b>{listingData.bedrooms}<b> </b><FontAwesomeIcon icon={ faBed } style={{paddingRight: "30px"}}/>
                    <b>Number of Bathrooms: </b>{listingData.bathrooms}<b> </b><FontAwesomeIcon icon={ faBath } />
                    
                </div>
                <hr></hr>
                <div style={{height: '400px' , fontSize: "20px"}}>
                    <div style={{ float: 'right', aspectRatio: '1/1', height: '100%' }}>
                        <div ref={mymap} style={{ height: '100%', width: '100%' , zIndex: "0" }} />
                    </div>
                    <p> <FontAwesomeIcon icon={faLocationDot} style={{fontSize: "1.5em"}}/> <b style={{fontSize: "32px"}}> Address: </b> </p>
                    <p><strong>Street: </strong>{ listingData.address }</p>
                    <p><strong>Postal Code:</strong> { listingData.zipcode }</p>
                    <p><strong>Property Type: </strong>{ getPropertyType(listingData.property_type) }</p>
                    <p><strong>Sale or Rent: </strong>{ getSaleOrRent(listingData.sale_or_rent) }</p>
                    <p><strong>Size: </strong>{ listingData.sqmeters } Square Meters <FontAwesomeIcon icon={faExpand}  /></p>
                </div>
                
               
                <hr></hr>
                <b style={{fontSize: "32px"}} >Description: </b>
                <p>{ listingData.description }</p>
                <hr></hr>
                </div>
            </div>
            {   listingData.property_type === 1 ?
                <div className="listing--details--analytics">
                    <h3>{AnalyticsTitle()}</h3>
                    <select className="listing--details--analytics--dropdown" name="timeframe" value={timeframe} onChange={changeTimeframe}>
                        <option value="1">1 Year</option>
                        <option value="4">4 Years</option>
                        <option value="10">10 Years</option>
                    </select>
                    <PriceTable
                        analytics={listingData.sale_or_rent === 1 ? predictedResalePrice : predictedRentPrice}
                        timeframe={timeframe}
                    />
                    <LineGraph
                        analytics={listingData.sale_or_rent === 1 ? predictedResalePrice : predictedRentPrice}
                        timeframe={timeframe}
                    />
                </div> 
                : null
            }

            
            
            { isOwner &&
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