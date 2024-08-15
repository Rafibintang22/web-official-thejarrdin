import { multiRoleAkses, bagiArrayAkses } from "../models/menuRoleAkses";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Home() {
  const rolesUser = ["Pengurus", "Pengelola"];
  const arr = multiRoleAkses(rolesUser);
  const arr2 = bagiArrayAkses(arr);

  return (
    <div className="container d-flex justify-content-center align-items-center flex-column flex-wrap">
      {arr2.map((arrAkses, i) => (
        <div
          key={i}
          className={`hexagonArea d-flex ${i === 0 ? "first" : "last"} ${
            arrAkses.length % 2 === 0 && i !== 0 ? "genap" : ""
          }`}
        >
          {arrAkses.map((akses, j) => (
            <div key={j} className="hexagon p-2">
              <FontAwesomeIcon icon={akses.icon} size="2xl" />
              <p className="text-center">{akses.label}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Home;
