import React from "react";
import { Link } from "react-router-dom";

function Options({ showOpt, id }: { showOpt: boolean; id: number }) {
  return (
    <div className={`options   ${showOpt ? "hidden" : ""}`}>
      <ul>
        <li>
          <img src="/static/eye.png" />
          <Link to={`/user/${id}`}>
            <p className="ml-3 cursor-pointer">View Details</p>
          </Link>
        </li>
        <li className="cursor-pointer">
          <img src="/static/blacklist.png" />
          <p className="ml-3 "> Blcaklist</p>
        </li>
        <li className="cursor-pointer">
          <img src="/static/activate.png" />
          <p className="ml-3">Deactivate</p>
        </li>
      </ul>
    </div>
  );
}

export default Options;
