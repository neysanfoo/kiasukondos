import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faBath, faBed, faLocationDot } from '@fortawesome/free-solid-svg-icons'
const baseURL = 'http://127.0.0.1:8000/api'

function ListingCard({ id, photo_main, title, address, price, bedrooms, bathrooms, sqmeters}) {
  function truncate(str, n){
    return (str.length > n) ? str.substr(0, n-1) + '...' : str;
  }

  return(
    <Link to={"/listing/" + id} className="listing--card">
      <img className="listing--card--image" src={photo_main} alt="Card image cap" />
      <div className="card-body">
        <h5 className="card-title">{truncate(title,30)}</h5>
        <p className="card-text listing--card--address"><FontAwesomeIcon icon={ faLocationDot } /> {truncate(address,80)} </p>
        <div className='card--icons'>
          <p><FontAwesomeIcon icon={ faDollarSign } /> {price}</p>
          <p><FontAwesomeIcon icon={ faBed } /> {bedrooms}</p>
          <p><FontAwesomeIcon icon={ faBath } /> {bathrooms}</p>
        </div>
        {/* <p className="card-text">{sqmeters} Square Meters</p> */}
        {/* <Link to={"/listing/" + id} className="btn btn-primary">See Listing</Link> */}
      </div>
    </Link>
  )
}

export default ListingCard
