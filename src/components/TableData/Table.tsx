import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Options from "../options/Options";

function Table({ item }: { item: any }) {
  const [showOpt, setShowOpt] = useState<boolean>(true);
  const [time, setTime] = useState<string>("AM");

  const date = new Date(item.createdAt);

  let dateText = `${date}`;
  let result = dateText.slice(0, dateText.indexOf("G"));

  let hour: number;
  hour = date.getHours();

  useEffect(() => {
    if (hour > 12) {
      setTime("PM");
    }
  }, [item]);

  return (
    <tr>
      <td>{item.orgName}</td>
      <td>{item.userName}</td>
      <td>{item.email}</td>
      <td>{item.phoneNumber}</td>
      <td>
        {result}
        {time}
      </td>
      <td className="flex justify-between">
        <button>
          <p>Active</p>
        </button>
        <MoreVertIcon
          className="vert-icon"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setShowOpt(!showOpt);
          }}
        />
      </td>

      <Options showOpt={showOpt} id={item.id} />
    </tr>
  );
}

export default Table;
