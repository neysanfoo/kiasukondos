import axios from 'axios'
import React, { useState, useEffect } from 'react'
import ListingCard from '../components/ListingCard'
import SearchBar from '../components/SearchBar'
import { Link } from 'react-router-dom'
const baseURL="http://127.0.0.1:8000/api"

function Home() {
  const [data, setData] = useState([])
  const [listing, setListing] = useState([])

  useEffect(() => {
    axios.get(baseURL + "/hello/").then((response) => {
      setData(response.data)
    })
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

