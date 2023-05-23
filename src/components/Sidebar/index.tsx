import React from "react";
import "./sidebar.css";

function Sidebar({ icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex py-3  pl-[30px] sidebar-items items-center">
      <div className="mr-2">{icon}</div>
      <p>{text}</p>
    </div>
  );
}

export default Sidebar;
