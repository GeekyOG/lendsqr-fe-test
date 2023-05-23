import React from "react";
import "./style.css";

function InfoBox({
  icon,
  text,
  number,
}: {
  icon: any;
  text: String;
  number: string;
}) {
  return (
    <div className="container smMAX: mt-5">
      {icon}
      <h4>{text}</h4>
      <h1>{number}</h1>
    </div>
  );
}

export default InfoBox;
