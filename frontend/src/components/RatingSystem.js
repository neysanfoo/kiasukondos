import React from 'react'

function RatingSystem(props) {
  return (
    <div>
        <div class="stars">
            <input type="radio" onChange={props.handleChange} id="star1" name="rating" value="1" />
            <input type="radio" onChange={props.handleChange} id="star2" name="rating" value="2" />
            <input type="radio" onChange={props.handleChange} id="star3" name="rating" value="3" />
            <input type="radio" onChange={props.handleChange} id="star4" name="rating" value="4" />
            <input type="radio" onChange={props.handleChange} id="star5" name="rating" value="5" />
            <label for="star1" aria-label="Banana">1 star</label>
            <label for="star2">2 stars</label>
            <label for="star3">3 stars</label>
            <label for="star4">4 stars</label>
            <label for="star5">5 stars</label>
         </div>
    </div>
  )
}

export default RatingSystem