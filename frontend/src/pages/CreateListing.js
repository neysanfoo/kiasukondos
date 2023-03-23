import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { FileUploader } from 'react-drag-drop-files';


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

    const [predictedPrice, setPredicetedPrice] = useState(null)
    useEffect(() => {
        if (formData.town && formData.property_type && formData.sale_or_rent && formData.bedrooms) {
          axios.get(`${baseURL}/predicted-price/${formData.town}/${formData.property_type}/${formData.sale_or_rent}/${formData.bedrooms}/`)
            .then(response => {
              console.log(response.data);
              setPredicetedPrice(response.data.predictedPrice);
            })
            .catch(error => {
              console.log(error);
            });
        }
        console.log("predicted price " + predictedPrice);
      }, [formData]);

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
        //setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        const base = "photo_"
        const newFormData = { ...formData };
        const newPhotoUrls = { ...photoUrls };
        for(let i = 0; i<e.length; i++){
            const file = e[i];
            if (file){
                const imageUrl = URL.createObjectURL(file);
                const img = new Image();
                img.src = imageUrl;
                img.onload = () =>{
                    URL.revokeObjectURL(img.src);
                };
                if(i === 0){
                    newFormData["photo_main"] = file;
                    newPhotoUrls["photo_main"] = imageUrl;
                }
                else{
                    newFormData[base + i.toString()] = file;
                    newPhotoUrls[base + i.toString()] = imageUrl;
                }
            }   
        }
        setFormData(newFormData);
        setPhotoUrls(newPhotoUrls);
    };

    /**
     * 
     * @param {*} e 
     */

    const handleFileRemove = e => {
        const updatedUrls = {...photoUrls};
        const newFormData = {...formData};
        delete updatedUrls[e];
        newFormData[e] = null;
        setPhotoUrls(updatedUrls);
        setFormData(newFormData);
        console.log(formData);
    }

    const handleSubmit = e => {
        e.preventDefault();
        axios.post(baseURL + "/listings/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            console.log(response.data)
            window.location.href = "/homes"

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
                    placeholder = ""
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
                    placeholder = ""
                    required
                >
                    <option value="1">HDB</option>
                    <option value="2">Condo</option>
                    <option value="3">Landed</option>
                </select>
                
                {/*<label htmlFor="sale_or_rent">Sale or Rent:</label>*/}
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
                
                {/*<label htmlFor="bedrooms">Bedrooms:</label>*/}
                <div style={{position: "relative"}} >

                    {formData.bedrooms && <span style={{fontSize: "16px", position: "absolute", right: "30px", top: "12%", zIndex: "1"}}>Bedrooms</span>}
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
                </div>

                {formData.bedrooms && formData.bedrooms <= 0 && <p style={{fontSize: "12px", color: "red"}}>Error: Please enter a valid number of bedrooms</p>}
                {formData.bedrooms && formData.bedrooms >= 7 && <p style={{fontSize: "12px", color: "red"}}>{formData.bedrooms} bedrooms seem abit high. Please double-check your value</p>}
                {/*<label htmlFor="bathrooms">Bathrooms:</label>*/}
                
                <div style={{position: "relative"}} >
                    {formData.bathrooms && <span style={{fontSize: "16px", position: "absolute", right: "30px", top: "12%", zIndex: "1"}}>Bathrooms</span>}
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
                </div>
                {formData.bathrooms && formData.bathrooms <= 0 && <p style={{fontSize: "12px", color: "red"}}>Error: Please enter a valid number of bathrooms</p>}
                {formData.bathrooms && formData.bathrooms >= 4 && <p style={{fontSize: "12px", color: "red"}}>{formData.bathrooms} bathrooms seem abit high. Please double-check your value</p>}
                
                {/*<label htmlFor="garage">Garage:</label>*/}
                <div style={{position: "relative"}} >
                    {formData.garage && <span style={{fontSize: "16px", position: "absolute", right: "30px", top: "12%", zIndex: "1"}}>Garage</span>}
                    <input
                        className="edit-listing-field"
                        type="number"
                        id="garage"
                        name="garage"
                        onChange={handleChange}
                        value={formData.garage}
                        placeholder='Garage'
                    />
                </div>
                
                {formData.garage && formData.garage <= 0 && <p style={{fontSize: "12px", color: "red"}}>Error: Please enter a valid number of garage</p>}

                {/*<label htmlFor="sqmeters">Sq Meters:</label>*/}
                <div style={{position: "relative"}} >
                    <span style={{ fontSize: "16px", position: "absolute", right: "30px", top: "12%", zIndex: "1"}}>sqm</span>
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

                {formData.sqmeters && formData.sqmeters <= 0 && <p style={{fontSize: "12px", color: "red"}}>Error: Please enter a valid area</p>}
                
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
                {formData.price && formData.price <= 0 && <p style={{fontSize: "12px", color: "red"}}>Error: Please enter a valid price</p>}
                {predictedPrice && predictedPrice === -1 && <div>
                    <p style={{fontSize: "12px", color: "red"}}>Insufficient data to find average for {formData.bedrooms} Bedrooms in {formData.town}</p>
                    </div>}
                {predictedPrice && predictedPrice !== -1 && <div>
                    <p style={{fontSize: "12px"}}>The average price from 2022 for {formData.bedrooms} Bedrooms in {formData.town} is ${Math.round(predictedPrice)}</p>
                    </div>}
                {predictedPrice && formData.price && (formData.price >= 1.2 * predictedPrice || formData.price <= 0.8 * predictedPrice)
                &&<div>
                    <p style={{fontSize: "12px", color: "red"}}>You have inputted ${formData.price} and it appears to be either too high or too low consider putting closer to the average price of ${Math.round(predictedPrice)}</p>
                </div>}
                
                <label htmlFor="list_date">List Date:</label>
                <input
                    type="date"
                    id="list_date"
                    name="list_date"
                    style={{fontSize: "16px", border: "1px solid", cursor: "pointer", height: "40px", borderRadius: "5px"}}
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
                
                <FileUploader 
                    //label={"Drag or Drop Files"} 
                    dropMessageStyle = {{backgroundColor: 'red !important' }}
                    handleChange={handleFileChange}
                    classes = "drop_area drop_zone"
                    multiple = {true}/>
                {/**
                 * 
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
                 */}
                <div className="edit-listing-image-container" >
                    {photoUrls["photo_main"] &&
                    <div style={{position:"relative", gridColumnStart:"1", gridColumnEnd:"4"}}>
                        <h4> Main Photo </h4>
                        <button class = "edit-listing-image-remove" style={{top: "13%"}} onClick={()=>handleFileRemove("photo_main")}> &times; </button> 
                        <img src={photoUrls["photo_main"]} class = "edit-listing-mainImage" alt="..." style={{width: "100%", aspectRatio:"16/9", borderRadius: "5px"}} />
                    </div>
                    }
                    
                    {photoUrls["photo_1"] && 
                        <div style={{position:"relative"}}>
                            <button class = "edit-listing-image-remove" onClick={()=>handleFileRemove("photo_1")}> &times; </button> 
                            <img src={photoUrls["photo_1"]} class = "edit-listing-image" alt="..." />
                        </div>
                    }

                    {photoUrls["photo_2"] && 
                        <div style={{position:"relative"}}>
                            <button class = "edit-listing-image-remove" onClick={()=>handleFileRemove("photo_2")}> &times; </button> 
                            <img src={photoUrls["photo_2"]} class = "edit-listing-image" alt="..." />
                        </div>
                    }

                    {photoUrls["photo_3"] && 
                        <div style={{position:"relative"}}>
                            <button class = "edit-listing-image-remove" onClick={()=>handleFileRemove("photo_3")}> &times; </button> 
                            <img src={photoUrls["photo_3"]} class = "edit-listing-image" alt="..." />
                        </div>
                    }

                    {photoUrls["photo_4"] && 
                        <div style={{position:"relative"}}>
                            <button class = "edit-listing-image-remove" onClick={()=>handleFileRemove("photo_4")}> &times; </button> 
                            <img src={photoUrls["photo_4"]} class = "edit-listing-image" alt="..." />
                        </div>                    }
                    {photoUrls["photo_5"] && 
                        <div  style={{position:"relative"}}>
                            <button class = "edit-listing-image-remove" onClick={()=>handleFileRemove("photo_5")}> &times; </button> 
                            <img src={photoUrls["photo_5"]} class = "edit-listing-image" alt="..." />
                        </div>
                    }
                    {photoUrls["photo_6"] && 
                        <div  style={{position:"relative"}}>
                            <button class = "edit-listing-image-remove" onClick={()=>handleFileRemove("photo_6")}> &times; </button> 
                            <img src={photoUrls["photo_6"]} class = "edit-listing-image" alt="..." />
                        </div>
                    }
                </div>
            </div>

           
        </form>
    </div>
  );
}

export default CreateListing;