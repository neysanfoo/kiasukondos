import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faBath, faBed, faLocationDot } from '@fortawesome/free-solid-svg-icons'
const baseURL = 'http://127.0.0.1:8000/api'

function ListingCard({ id, photo_main, title, address, price, bedrooms, bathrooms, sqmeters}) {


  return(
    <div className="card listing--card">
      <img className="card-img-top" src={photo_main} alt="Card image cap" />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text"><FontAwesomeIcon icon={ faLocationDot } /> {address} </p>
        <p className="card-text"><FontAwesomeIcon icon={ faDollarSign } /> {price}</p>
        <p className="card-text"><FontAwesomeIcon icon={ faBed } /> {bedrooms}</p>
        <p className="card-text"><FontAwesomeIcon icon={ faBath } /> {bathrooms}</p>
        <p className="card-text">{sqmeters} Square Meters</p>
        <Link to={"/listing/" + id} className="btn btn-primary">See Listing</Link>
      </div>
    </div>
  )
}

export default ListingCard
