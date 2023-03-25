import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faBath, faBed, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import LikeButton from '../components/LikeButton'

function ListingCard({ id, current_user_id, photo_main, title, address, price, bedrooms, bathrooms, sqmeters, sale_or_rent, is_sold}) {
  function truncate(str, n){
    return (str.length > n) ? str.substr(0, n-1) + '...' : str;
  }
  return(
    <div className='listing--card'>
  <Link to={"/listing/" + id} className="listing--card--link">
    <div className={is_sold && "listing--card--image-container"}>
      <img className="listing--card--image" src={photo_main} alt="listing card" />
    </div>
    <div className="card-body">
      <div>
        <h5 className="card-title">{title}</h5>
        <p className="card-text listing--card--address"><FontAwesomeIcon icon={ faLocationDot } /> {truncate(address,80)} </p>
      </div>
    </div>
  </Link>
  <div className='card--footer '>
    <div className='card--icons'>
      {
        // if for rent?
        sale_or_rent === 1 ? 
        <p><FontAwesomeIcon icon={ faDollarSign } /> {price}</p>
        :
        <p><FontAwesomeIcon icon={ faDollarSign } /> {price} / mth</p>
      }
      <p><FontAwesomeIcon icon={ faBed } /> {bedrooms}</p>
      <p><FontAwesomeIcon icon={ faBath } /> {bathrooms}</p>
    </div>
    <div className='listing--card--like--button'>
      { current_user_id ? <LikeButton user_id={current_user_id} listing_id={id} /> : null }
    </div>
  </div>
</div>
  )
}

export default ListingCard
