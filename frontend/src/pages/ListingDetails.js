import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
const baseURL="http://127.0.0.1:8000/api"

function ListingDetails() {
    const [listingData, setListingData] = useState([])
    const { id } = useParams()

    useEffect(() => {
        axios.get(baseURL + "/listings/" + id + "/").then((response) => {
            setListingData(response.data)
        })
    }, [])
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

    return(
        <div className="container mt-4">
            <h1>{ listingData.title }</h1>
            <img src={ listingData.photo_main } alt="listing" />
            <p><b>Address: </b> { listingData.address }</p>
            <p><b>Zipcode: </b> { listingData.zipcode }</p>
            <p><b>Property Type: </b>{ getPropertyType(listingData.property_type) }</p>
            <p><b>Price: </b> { listingData.price }</p>
            <p><b>Bedrooms: </b> { listingData.bedrooms }</p>
            <p><b>Bathrooms: </b> { listingData.bathrooms }</p>
            <p><b>Size: </b>{ listingData.sqmeters } Square Meters</p>
            <p><b>Description: </b>{ listingData.description }</p>
        </div>
    )
}

export default ListingDetails;