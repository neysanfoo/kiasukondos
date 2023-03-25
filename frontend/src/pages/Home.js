import axios from 'axios'
import React, { useState, useEffect } from 'react'
import ListingCard from '../components/ListingCard'
import SearchBar from '../components/SearchBar'
import { Link } from 'react-router-dom'
const baseURL = process.env.REACT_APP_BACKEND_URL + "/api";



function Home() {
  const [listing, setListing] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    // Get the current user's data
    var config = {
      method: 'get',
      url: baseURL + '/user/',
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
    <div className='container mt-4'>
      <SearchBar
        setListing={setListing}
       />
      <div className="listing--container">
        {listing.map((item) => (
            <div className='listing--in--container'>
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
              sale_or_rent={item.sale_or_rent}
              is_sold={item.is_sold}
            />
            </div>
        ))}
      </div>
    </div>
  )
}

export default Home

