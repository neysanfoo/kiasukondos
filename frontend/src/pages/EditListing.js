import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { FileUploader } from 'react-drag-drop-files';


const baseURL = process.env.REACT_APP_BACKEND_URL + "/api";

function EditListing() {
  const listing_id = useParams().listing_id;
  const [owner, setOwner] = useState(null)
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
    photo_main: null,
    photo_1: null,
    photo_2: null,
    photo_3: null,
    photo_4: null,
    photo_5: null,
    photo_6: null,
    is_published: true,
  });

  useEffect(() => {
    var config = {
      method: 'get',
      url: baseURL + '/listings/' + listing_id + '/',
      withCredentials: true
    };

    axios(config)
      .then(function(response) {
        const res = response.data
        console.log(response.data)
        setFormData({
          title: res.title,
          address: res.address,
          zipcode: res.zipcode,
          property_type: res.property_type,
          sale_or_rent: res.sale_or_rent,
          description: res.description,
          price: res.price,
          bedrooms: res.bedrooms,
          bathrooms: res.bathrooms,
          garage: res.garage,
          sqmeters: res.sqmeters,
          is_published: res.is_published,
        })
        setOwner(res.owner)
        setPhotoUrls({
          photo_main: res.photo_main,
          photo_1: res.photo_1,
          photo_2: res.photo_2,
          photo_3: res.photo_3,
          photo_4: res.photo_4,
          photo_5: res.photo_5,
          photo_6: res.photo_6,
        })
      })
      .catch(function(error) {
        console.log(error);
      });

  }, []);

  console.log(formData);
  useEffect(() => {
    var config = {
      method: 'get',
      url: baseURL + '/user/',
      withCredentials: true
    };

    axios(config)
      .then(function(response) {
        // Check if the current user is the owner of this listing
        if (owner && response.data.id !== owner) {
          window.location.href = "/homes"
        }
      })
      .catch(function(error) {
        console.log(error);
      });

  }, [formData]);


  const towns = ['PUNGGOL', 'JURONG WEST', 'BEDOK', 'BUKIT MERAH', 'CHOA CHU KANG', 'TAMPINES',
    'SENGKANG', 'ANG MO KIO', 'HOUGANG', 'TOA PAYOH', 'JURONG EAST', 'WOODLANDS',
    'BUKIT BATOK', 'SEMBAWANG', 'CENTRAL', 'QUEENSTOWN', 'BISHAN', 'CLEMENTI',
    'MARINE PARADE', 'PASIR RIS', 'YISHUN', 'GEYLANG', 'SERANGOON',
    'BUKIT PANJANG', 'KALLANG/WHAMPOA', 'BUKIT TIMAH']

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    //setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    const base = "photo_"
    const newFormData = { ...formData };
    const newPhotoUrls = { ...photoUrls };
    for (let i = 0; i < e.length; i++) {
      const file = e[i];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          URL.revokeObjectURL(img.src);
        };
        if (i === 0) {
          newFormData["photo_main"] = file;
          newPhotoUrls["photo_main"] = imageUrl;
        }
        else {
          newFormData[base + i.toString()] = file;
          newPhotoUrls[base + i.toString()] = imageUrl;
        }
      }
    }
    setFormData(newFormData);
    setPhotoUrls(newPhotoUrls);
  };


  const handleSubmit = e => {
    e.preventDefault();
    axios.patch(baseURL + "/listings/" + listing_id + "/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      console.log(response.data)
      window.location.href = "/homes"

    }
    )
  };

  const handleFileRemove = e => {
    const updatedUrls = { ...photoUrls };
    const newFormData = { ...formData };
    delete updatedUrls[e];
    newFormData[e] = null;
    setPhotoUrls(updatedUrls);
    setFormData(newFormData);
    console.log(formData);
  }

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

  return (
    <div className='container'>
      <form className='create--listing--form' onSubmit={handleSubmit}>
        <div className='edit--listing-details'>
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

            id="town"
            name="town"
            onChange={handleChange}
            value={formData.town}
            placeholder=""
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
            placeholder=""
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
          <div style={{ position: "relative" }} >

            {formData.bedrooms && <span className="edit-listing-field-units" >Bedrooms</span>}
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

          {formData.bedrooms !== null && formData.bedrooms <= 0 && <p className="edit-listing-field-warning">Error: Please enter a valid number of bedrooms</p>}
          {formData.bedrooms !== null && formData.bedrooms >= 7 && <p className="edit-listing-field-warning">{formData.bedrooms} bedrooms seem abit high. Please double-check your value</p>}
          {/*<label htmlFor="bathrooms">Bathrooms:</label>*/}

          <div style={{ position: "relative" }} >
            {formData.bathrooms && <span className="edit-listing-field-units">Bathrooms</span>}
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
          {formData.bathrooms !== null && formData.bathrooms <= 0 && <p className="edit-listing-field-warning">Error: Please enter a valid number of bathrooms</p>}
          {formData.bathrooms !== null && formData.bathrooms >= 4 && <p className="edit-listing-field-warning">{formData.bathrooms} bathrooms seem abit high. Please double-check your value</p>}

          {/*<label htmlFor="garage">Garage:</label>*/}
          <div style={{ position: "relative" }} >
            {formData.garage !== null && <span className="edit-listing-field-units">Garage</span>}
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

          {formData.garage !== null && formData.garage < 0 && <p className="edit-listing-field-warning">Error: Please enter a valid number of garage</p>}

          {/*<label htmlFor="sqmeters">Sq Meters:</label>*/}
          <div style={{ position: "relative" }} >
            <span className="edit-listing-field-units">sqm</span>
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

          {formData.sqmeters !== null && formData.sqmeters < 0 && <p className="edit-listing-field-warning">Error: Please enter a valid area</p>}

          {/*<label htmlFor="price">Price:</label>*/}
          <div style={{ position: "relative" }} >
            <span style={{ position: "absolute", left: "10px", top: "8%", zIndex: "1", paddingLeft: "10px", fontSize: "20px" }}>S$</span>
            <input
              className="edit-listing-field"
              type="number"
              id="price"
              name="price"
              onChange={handleChange}
              value={formData.price}
              required
              placeholder="Price"
              style={{ paddingLeft: "50px" }}
            />
          </div>
          {formData.price !== null && formData.price <= 0 && <p className="edit-listing-field-warning">Error: Please enter a valid price</p>}

          {predictedPrice && predictedPrice === -1 &&
            <p className="edit-listing-field-warning">Insufficient data to find average for {formData.bedrooms} Bedrooms in {formData.town}</p>
          }

          {predictedPrice && predictedPrice !== -1 &&
            <p style={{ fontSize: "12px" }}>The average price from 2022 for {formData.bedrooms} Bedrooms in {formData.town} is ${Math.round(predictedPrice)}</p>
          }

          {predictedPrice && formData.price && (formData.price >= 1.2 * predictedPrice || formData.price <= 0.8 * predictedPrice) &&
            <p className="edit-listing-field-warning">You have inputted ${formData.price} and it appears to be either too high or too low consider putting closer to the average price of ${Math.round(predictedPrice)}</p>
          }

          <label htmlFor="list_date">List Date:</label>
          <input
            type="date"
            id="list_date"
            name="list_date"
            className="edit-listing-list-date"
            onChange={handleChange}
            value={formData.list_date}
          />

          <label htmlFor="description" style={{ marginTop: "20px", fontSize: "20px" }}>Description:</label>
          <textarea
            className="edit-listing-field"
            id="description"
            name="description"
            onChange={handleChange}
            value={formData.description}
            style={{ height: "400px", paddingTop: "10px" }} //Increase height and have some padding but keep rest of the styling
            placeholder="Share details about this property to help buyers decide if this will be their future home"
            required
          ></textarea>


          <button class="edit-listing-submit" type="submit">Submit</button>
        </div>

        <hr></hr>

        <div className="edit-listing-photo-container">

          <FileUploader

            handleChange={handleFileChange}
            multiple={true} />
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
          {console.log(formData)}
          {console.log(photoUrls)}
          <div className="edit-listing-image-container" >
            {photoUrls["photo_main"] &&
              <div class="edit-listing-main-image-container">
                <h4> Main Photo </h4>
                <button class="edit-listing-image-remove" style={{ top: "13%" }} onClick={() => handleFileRemove("photo_main")}> &times; </button>
                <img src={photoUrls["photo_main"]} class="edit-listing-main-image" alt="..." />
              </div>
            }

            {photoUrls["photo_1"] &&
              <div style={{ position: "relative" }}>
                <button class="edit-listing-image-remove" onClick={() => handleFileRemove("photo_1")}> &times; </button>
                <img src={photoUrls["photo_1"]} class="edit-listing-image" alt="..." />
              </div>
            }

            {photoUrls["photo_2"] &&
              <div style={{ position: "relative" }}>
                <button class="edit-listing-image-remove" onClick={() => handleFileRemove("photo_2")}> &times; </button>
                <img src={photoUrls["photo_2"]} class="edit-listing-image" alt="..." />
              </div>
            }

            {photoUrls["photo_3"] &&
              <div style={{ position: "relative" }}>
                <button class="edit-listing-image-remove" onClick={() => handleFileRemove("photo_3")}> &times; </button>
                <img src={photoUrls["photo_3"]} class="edit-listing-image" alt="..." />
              </div>
            }

            {photoUrls["photo_4"] &&
              <div style={{ position: "relative" }}>
                <button class="edit-listing-image-remove" onClick={() => handleFileRemove("photo_4")}> &times; </button>
                <img src={photoUrls["photo_4"]} class="edit-listing-image" alt="..." />
              </div>}
            {photoUrls["photo_5"] &&
              <div style={{ position: "relative" }}>
                <button class="edit-listing-image-remove" onClick={() => handleFileRemove("photo_5")}> &times; </button>
                <img src={photoUrls["photo_5"]} class="edit-listing-image" alt="..." />
              </div>
            }
            {photoUrls["photo_6"] &&
              <div style={{ position: "relative" }}>
                <button class="edit-listing-image-remove" onClick={() => handleFileRemove("photo_6")}> &times; </button>
                <img src={photoUrls["photo_6"]} class="edit-listing-image" alt="..." />
              </div>
            }
          </div>
        </div>


      </form>
    </div>
  );

}

export default EditListing;
