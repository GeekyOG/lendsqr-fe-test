import React, { useState } from "react";

import { Avatar } from "@mui/material";
import logo from "../../images/Group.png";
import "./header.css";
import { NotificationAddOutlined, SearchOutlined } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SidebarContainer from "../../container/Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
function Header() {
  const [open, setopen] = useState(false);
  return (
    <div className="flex items-center nav ">
      <button
        className="  outline-none toggle-btn mr-2 "
        onClick={() => setopen(!open)}
      >
        <MenuIcon style={{ color: "#213f7d" }} />

        <span className="sr-only">open menu</span>
      </button>
      <div className="w-1/2 ">
        <div className="flex items-center justify-between">
          <img src={logo} style={{ height: 20 }} />
          <div className="smMax:hidden">
            <form>
              <div className=" flex justify-between search-wrapper mdMax:ml-10">
                <input placeholder="Search for anything" />
                <div className="icon-button">
                  <SearchOutlined style={{ color: "#fff" }} />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="w-1/2">
        <div className="flex justify-end items-center">
          <div className="left-content">
            <p className="underline underline-offset-1 smMax:hidden">Docs</p>
          </div>
          <div className="ml-10 mr-5 xsMax:hidden">
            <NotificationAddOutlined />
          </div>
          <div className="mr-1">
            <Avatar src="/static/image.png" />
          </div>
          <div className="left-content">
            <h1 className="xsMax:hidden">Adedeji</h1>
          </div>
          <ArrowDropDownIcon />
        </div>
      </div>
      <SwipeableDrawer
        anchor={"left"}
        open={open}
        onClose={() => setopen(false)}
      >
        <SidebarContainer />
      </SwipeableDrawer>
    </div>
  );
}

export default Header;
