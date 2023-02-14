import axios from 'axios'
import React, { useState, useEffect } from 'react'
import ListingCard from '../components/ListingCard'
import SearchBar from '../components/SearchBar'
import { Link } from 'react-router-dom'
const baseURL="http://127.0.0.1:8000/api"

function Home() {
  const [listing, setListing] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    // Get the current user's data
    var config = {
      method: 'get',
      url: 'http://localhost:8000/api/user/',
      withCredentials: true
    };
    axios(config)
    .then(function (response) {
        setUserId(response.data.id)
        console.log("HI")
        console.log(response.data.id)
    }
    ).catch(function (error) {
        console.log(error);
    }
    );
    axios.get(baseURL + "/listings/").then((response) => {
      setListing(response.data)
    })
  }, [])

  console.log(listing)


  return (
    <div className='container mt-2'>
      <SearchBar />
      <div className="row">
        {listing.map((item) => (
            <div className='col-md-auto'>
            <ListingCard 
              id = {item.id}
              current_user_id = {userId}
              photo_main={item.photo_main}
              title={item.title}
              address={item.address}
              price={item.price}
              bedrooms={item.bedrooms}
              bathrooms={item.bathrooms}
              sqmeters={item.sqmeters}
            />
            </div>
        ))}
      </div>
    </div>
  )
}

export default Home

