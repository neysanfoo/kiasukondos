import { useState } from "react";

function Tabs() {
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
          <h2>My Listings</h2>
          <hr />
        </div>

        <div
          className={toggleState === 2 ? "content  active-content" : "content"}
        >
          <h2>Favourites</h2>
          <hr />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
            voluptatum qui adipisci.
          </p>
        </div>

        <div
          className={toggleState === 3 ? "content  active-content" : "content"}
        >
          <h2>My Purchases</h2>
          <hr />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos sed
            nostrum rerum laudantium totam unde adipisci incidunt modi alias!
            Accusamus in quia odit aspernatur provident et ad vel distinctio
            recusandae totam quidem repudiandae omnis veritatis nostrum
            laboriosam architecto optio rem, dignissimos voluptatum beatae
            aperiam voluptatem atque. Beatae rerum dolores sunt.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Tabs;