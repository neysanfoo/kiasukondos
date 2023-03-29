import React from 'react';
import '../HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHandHoldingUsd, faSign, faComments, faChartBar, faMap, faChartLine, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { Link as ScrollLink } from 'react-scroll';


function HomePage() {
  return (
    <div className="HomePage">
      <HeroOne />
      <HeroTwo />
    </div>
  );
}

function HeroOne() {
  return (
    <div className="hero-one">
      <h1 className='animated fadeInDown'>Welcome to KiasuKondos</h1>
      <p className='animated fadeInDown homepage-text'>We're committed to helping you find not just a house, but a place to call home. </p>
      <div className="features animated fadeIn">
        <div className="feature">
          <FontAwesomeIcon icon={faHome} size="3x" />
          <h2 className='homepage-subtitle'>Buy Houses</h2>
          <p className='homepage-text'>Find your dream home in our extensive listing of properties for sale.</p>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faHandHoldingUsd} size="3x" />
          <h2 className='homepage-subtitle'>Sell Houses</h2>
          <p className='homepage-text'>Maximize your property's value with our efficient and effective platform.</p>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faSign} size="3x" />
          <h2 className='homepage-subtitle'>Rent Houses</h2>
          <p className='homepage-text'>Explore a wide range of rental options tailored to your needs and preferences.</p>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faComments} size="3x" />
          <h2 className='homepage-subtitle'>Chat with Owners</h2>
          <p className='homepage-text'>Connect directly with property owners to discuss and negotiate the best deals.</p>
        </div>
      </div>
      <div className="buttons">
        <a href="/homes">
          <button className="btn homes-button">See Homes</button>
        </a>
        <a href="/register">
          <button className="btn signup-button">Sign up</button>
        </a>
      </div>
      <div className="scroll-down">
        <ScrollLink to="hero-two" smooth={true} duration={1000}>
          <FontAwesomeIcon icon={faChevronDown} size="2x" />
        </ScrollLink>
      </div>
    </div>
  );
}

function HeroTwo() {
  return (
    <div className="hero-two" id="hero-two">
      <h1>Powered by Data-Driven Insights</h1>
      <p className='homepage-text'>Our advanced analytics and predictive algorithms help you make informed decisions.</p>
      <div className="insights animated fadeIn">
        <div className="insight">
          <FontAwesomeIcon icon={faChartBar} size="3x" />
          <h2 className='homepage-subtitle'>Market Analysis</h2>
          <p className='homepage-text'>Leverage comprehensive data from data.gov.sg to understand the property market trends.</p>
        </div>
        <div className="insight">
          <FontAwesomeIcon icon={faMap} size="3x" />
          <h2 className='homepage-subtitle'>Location Insights</h2>
          <p className='homepage-text'>Discover key insights about neighborhoods, amenities, and accessibility for each listing.</p>
        </div>
        <div className="insight">
          <FontAwesomeIcon icon={faChartLine} size="3x" />
          <h2 className='homepage-subtitle'>Price Prediction</h2>
          <p className='homepage-text'>Make smart investments with our regression analysis-based price predictions.</p>
        </div>
      </div>
    </div>
  );
}




export default HomePage;
