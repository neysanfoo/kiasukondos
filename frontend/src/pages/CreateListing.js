import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {Swiper, SwiperSlide} from "swiper/react"
import {Zoom, Autoplay, Pagination, Navigation} from 'swiper';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const baseURL="http://127.0.0.1:8000/api"


function CreateListing() {
    useEffect(() => {
        var config = {
            method: 'get',
            url: 'http://localhost:8000/api/user/',
            withCredentials: true
        };
        
        axios(config)
        .then(function (response) {
            setFormData({ ...formData, owner: response.data.id });
        })
        .catch(function (error) {
            console.log(error);
        });
        
    }, []);

    const [photoUrls, setPhotoUrls] = useState([])
    const [formData, setFormData] = useState({
        title: '',
        address: '',
        zipcode: '',
        property_type: 1,
        sale_or_rent: 1,
        description: '',
        price: '',
        bedrooms: '',
        bathrooms: '',
        garage: '',
        sqmeters: '',
        is_published: true,
        list_date: '',
        photo_main: null,
        photo_1: null,
        photo_2: null,
        photo_3: null,
        photo_4: null,
        photo_5: null,
        photo_6: null,
        town: ''
    });

    const towns = ['PUNGGOL', 'JURONG WEST', 'BEDOK', 'BUKIT MERAH', 'CHOA CHU KANG', 'TAMPINES',
    'SENGKANG', 'ANG MO KIO', 'HOUGANG', 'TOA PAYOH', 'JURONG EAST', 'WOODLANDS',
    'BUKIT BATOK', 'SEMBAWANG', 'CENTRAL', 'QUEENSTOWN', 'BISHAN', 'CLEMENTI',
    'MARINE PARADE', 'PASIR RIS', 'YISHUN', 'GEYLANG', 'SERANGOON',
    'BUKIT PANJANG', 'KALLANG/WHAMPOA', 'BUKIT TIMAH']

    console.log(formData)
    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        console.log(e.target.files)
        
        const file = e.target.files[0];
        if (file){
            const imageUrl = URL.createObjectURL(file);
            const img = new Image();
            img.src = imageUrl;
            img.onload = () =>{
                URL.revokeObjectURL(img.src);
            };
            setPhotoUrls({...photoUrls, [e.target.name]:imageUrl})
        }
        console.log(photoUrls)
    };

    const handleSubmit = e => {
        e.preventDefault();
        axios.post(baseURL + "/listings/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            console.log(response.data)
            window.location.href = "/"

        }
        )
    };

  return (
    <div className='container'>
        <form className='create--listing--form' onSubmit={handleSubmit}>
            <div className='listing-details' style={{float: "right", fontSize: "20px", width: "50%", marginTop: "10px"}}>
                <h2>Location</h2>
                <label htmlFor="title" >Listing Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    onChange={handleChange}
                    value={formData.title}
                    className="edit-listing-field"
                    required
                />

                <label htmlFor="town" >Town</label>
                <select
                    className="edit-listing-dropdown"
                    //style={{borderRadius: "10px", width: "100%", height: "34px", boxShadow: "5px 5px lightgray" }}
                    id="town"
                    name="town"
                    onChange={handleChange}
                    value={formData.town}
                    required
                >
                    {towns.map((town) => (
                        <option value={town}>{town}</option>
                    ))}
                </select>

                {/*<label htmlFor="address">Address:</label>*/}
                <input
                    className="edit-listing-field"
                    type="text"
                    id="address"
                    name="address"
                    onChange={handleChange}
                    value={formData.address}
                    placeholder="Address"
                    
                    required
                />

                {/*<label htmlFor="zipcode">Zipcode:</label>*/}
                <input
                    className="edit-listing-field"
                    type="text"
                    id="zipcode"
                    name="zipcode"
                    onChange={handleChange}
                    value={formData.zipcode}
                    required
                    placeholder='Postal Code'
                />
                <hr></hr>
                <h2>Unit Details</h2>
                <label htmlFor="property_type">Property Type:</label>
                <select
                    className="edit-listing-dropdown"
                    id="property_type"
                    name="property_type"
                    onChange={handleChange}
                    value={formData.property_type}
                    required
                >
                    <option value="1">HDB</option>
                    <option value="2">Condo</option>
                    <option value="3">Landed</option>
                </select>
                
                <label htmlFor="sale_or_rent">Sale or Rent:</label>
                <select
                    className="edit-listing-dropdown"
                    id="sale_or_rent"
                    name="sale_or_rent"
                    onChange={handleChange}
                    value={formData.sale_or_rent}
                    required
                >
                    <option value="1">For Sale</option>
                    <option value="2">For Rent</option>
                </select>
                
                
                
                {/*<label htmlFor="price">Price:</label>*/}
                <div style={{position: "relative"}} >
                    <span style={{position: "absolute", left: "10px", top: "8%", zIndex: "1", paddingLeft: "10px", fontSize: "20px"}}>S$</span>
                    <input
                    className="edit-listing-field"
                    type="number"
                    id="price"
                    name="price"
                    onChange={handleChange}
                    value={formData.price}
                    required
                    placeholder="Price"
                    style={{paddingLeft: "50px"}}
                    />
                
                </div>
                
                {/*<label htmlFor="bedrooms">Bedrooms:</label>*/}
                <input
                    className="edit-listing-field"
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    onChange={handleChange}
                    value={formData.bedrooms}
                    required
                    placeholder='Bedrooms'
                />
                
                {/*<label htmlFor="bathrooms">Bathrooms:</label>*/}
                <input
                    className="edit-listing-field"
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    onChange={handleChange}
                    value={formData.bathrooms}
                    required
                    placeholder='Bathrooms'
                />
                
                {/*<label htmlFor="garage">Garage:</label>*/}
                <input
                    className="edit-listing-field"
                    type="number"
                    id="garage"
                    name="garage"
                    onChange={handleChange}
                    value={formData.garage}
                    placeholder='Garage'
                />
                
                {/*<label htmlFor="sqmeters">Sq Meters:</label>*/}
                <div style={{position: "relative"}} >
                    <span style={{position: "absolute", left: "580px", top: "8%", zIndex: "1"}}>sqm</span>
                    <input
                        className="edit-listing-field"
                        type="number"
                        id="sqmeters"
                        name="sqmeters"
                        onChange={handleChange}
                        value={formData.sqmeters}
                        required
                        placeholder='Area'
                    />
                </div>
                
                
                
                <label htmlFor="list_date">List Date:</label>
                <input
                    type="date"
                    id="list_date"
                    name="list_date"
                    onChange={handleChange}
                    value={formData.list_date}
                />  

                <label htmlFor="description" style={{marginTop: "20px", fontSize: "20px"}}>Description:</label>
                <textarea
                    className="edit-listing-field"
                    id="description"
                    name="description"
                    onChange={handleChange}
                    value={formData.description}
                    style={{fontSize: "16px", height: "400px", paddingTop: "10px"}}
                    placeholder="Share details about this property to help buyers decide if this will be their future home"
                    required
                ></textarea>


                <button class = "edit-listing-submit" type="submit">Submit</button>
            </div>
            
            <hr></hr>
            
             
            <div className="edit-listing-photo-container">
                <label htmlFor="photo_main">Main Photo:</label>
                <input
                    type="file"
                    id="photo_main"
                    name="photo_main"
                    onChange={handleFileChange}
                />
                <label htmlFor="photo_1">Additional Photo 1:</label>
                <input
                    type="file"
                    id="photo_1"
                    name="photo_1"
                    onChange={handleFileChange}
                    />
                 <label htmlFor="photo_2">Additional Photo 2:</label>
                <input
                    type="file"
                    id="photo_2"
                    name="photo_2"
                    onChange={handleFileChange}
                />
                <label htmlFor="photo_3">Additional Photo 3:</label>
                <input
                    type="file"
                    id="photo_3"
                    name="photo_3"
                    onChange={handleFileChange}
                />
                 <label htmlFor="photo_4">Additional Photo 4:</label>
                <input
                    type="file"
                    id="photo_4"
                    name="photo_4"
                    onChange={handleFileChange}
                />
                 <label htmlFor="photo_5">Additional Photo 5:</label>
                <input
                    type="file"
                    id="photo_5"
                    name="photo_5"
                    onChange={handleFileChange}
                />
                <label htmlFor="photo_6">Additional Photo 6:</label>
                <input
                    type="file"
                    id="photo_6"
                    name="photo_6"
                    onChange={handleFileChange}
                />
                <div className="edit-listing-image-container" >
                    {photoUrls["photo_main"] && <b>Main Photo</b> && <img src={photoUrls["photo_main"]} class = "edit-listing-mainImage" alt="..." style={{marginTop: "20px", width: "100%", aspectRatio:"16/9", borderRadius: "5px", gridColumnStart:"1", gridColumnEnd:"4"}}/>}
                    {photoUrls["photo_1"] && <img src={photoUrls["photo_1"]} class = "edit-listing-image" alt="..." />}
                    {photoUrls["photo_2"] && <img src={photoUrls["photo_2"]} class = "edit-listing-image" alt="..." />}
                    {photoUrls["photo_3"] && <img src={photoUrls["photo_3"]} class = "edit-listing-image" alt="..." />}
                    {photoUrls["photo_4"] && <img src={photoUrls["photo_4"]} class = "edit-listing-image" alt="..."/>}
                    {photoUrls["photo_5"] && <img src={photoUrls["photo_5"]} class = "edit-listing-image" alt="..." />}
                    {photoUrls["photo_6"] && <img src={photoUrls["photo_6"]} class = "edit-listing-image" alt="..."/>}
                </div>
            </div>

           
        </form>
    </div>
  );
}

export default CreateListing;