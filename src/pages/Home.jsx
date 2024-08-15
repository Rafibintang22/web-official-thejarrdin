import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { faHandHoldingHeart } from "@fortawesome/free-solid-svg-icons";

function Home() {
  const menu = [1, 2, 3, 4, 5, 6, 7];
  const menu2 = [1, 2, 3, 4, 5, 6];
  return (
    <div className="container d-flex justify-content-center align-items-center flex-column flex-wrap">
      <div className="hexagonArea d-flex first">
        {menu.map((img, i) => (
          <>
            <div key={i} className="hexagon">
              <FontAwesomeIcon icon={faHandHoldingHeart} size="2xl" />
              <p>TEST</p>
            </div>
          </>
        ))}
      </div>
      <div className="hexagonArea d-flex last">
        {menu2.map((img, i) => (
          <>
            <div key={i} className="hexagon">
              <FontAwesomeIcon icon={faFileLines} size="2xl" />
              <p>TEST</p>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

export default Home;
