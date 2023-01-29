import { useState } from "react";
import ListingCard from "./ListingCard";

function Tabs({ myListings, myPurchases }) {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div>
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "tabs active-tabs tab-button" : "tabs tab-button"}
          onClick={() => toggleTab(1)}
        >
          My Listings
        </button>
        <button
          className={toggleState === 2 ? "tabs active-tabs tab-button" : "tabs tab-button"}
          onClick={() => toggleTab(2)}
        >
          Favourites
        </button>
        <button
          className={toggleState === 3 ? "tabs active-tabs tab-button" : "tabs tab-button"}
          onClick={() => toggleTab(3)}
        >
          My Purchases
        </button>
      </div>

      <div className="content-tabs">
        <div
          className={toggleState === 1 ? "content  active-content" : "content"}
        >
          {myListings.map((item) => (
              <ListingCard
                id={item.id}
                photo_main={item.photo_main}
                title={item.title}
                address={item.address}
                price={item.price}
                bedrooms={item.bedrooms}
                bathrooms={item.bathrooms}
                sqmeters={item.sqmeters}
              />
          ))}
        </div>

        <div
          className={toggleState === 2 ? "content  active-content" : "content"}
        >
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
            voluptatum qui adipisci.
          </p>
        </div>

        <div
          className={toggleState === 3 ? "content  active-content" : "content"}
        >
          {myPurchases.map((item) => (
            <div className="row">
              <div className="col-3">
                <ListingCard
                  id={item.listing.id}
                  photo_main={item.listing.photo_main}
                  title={item.listing.title}
                  address={item.listing.address}
                  price={item.listing.price}
                  bedrooms={item.listing.bedrooms}
                  bathrooms={item.listing.bathrooms}
                  sqmeters={item.listing.sqmeters}
                />
              </div>
            </div>
          ))
                }
        </div>
      </div>
    </div>
  );
}

export default Tabs;