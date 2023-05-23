import React, { useState } from "react";
import Header from "../components/Header";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Alert, Avatar } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import "./styles/user.css";
import SidebarContainer from "../container/Sidebar";
function User() {
  const { id } = useParams();
  const [data, setData] = useState(() =>
    localStorage.getItem("data") ? localStorage.getItem("data") : null
  );
  const parsedData = JSON.parse(data);

  const userInfo = parsedData.filter((el) => {
    return el.id == id;
  });

  const user = userInfo ? userInfo[0] : null;

  return (
    <div className="dashboard-wrapper">
      <Header />

      <div className="flex">
        <div className="mdMax:hidden">
          <SidebarContainer />
        </div>

        {user ? (
          <div className="main">
            <Link to={"/users"} className="back-button flex ">
              <KeyboardBackspaceIcon /> <p>Back to Users</p>
            </Link>

            <div className="flex  flex-wrap justify-between items-center my-10">
              <h1 className="details-heading xsMax:w-[100%]">User Details</h1>

              <div className="action-buttons ">
                <button className="blacklist-btn mr-5">BLACKLIST USER</button>
                <button className="active-btn">ACTIVATE USER</button>
              </div>
            </div>

            <div className="pre-info-wrapper  overflow-x-scroll">
              <div className="flex  items-center smMax:w-[900px]">
                <div className="w-1/2 smMax:w-[60%] flex justify-between items-center">
                  <div className="flex items-center info-item">
                    <Avatar
                      src={user.profile.avatar}
                      style={{ fontSize: 100, width: 100, height: 100 }}
                      className="mr-3"
                    />

                    <div>
                      <h1>
                        {user.profile.firstName} {user.profile.lastName}
                      </h1>
                      <p>{user.userName}</p>
                    </div>
                  </div>

                  <div className="info-item flex items-center justify-center  ">
                    <div>
                      <p>User’s Tier</p>
                      <div>
                        <StarIcon style={{ color: "#E9B200" }} />
                        <StarOutlineIcon style={{ color: "#E9B200" }} />
                        <StarOutlineIcon style={{ color: "#E9B200" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-1/2 smMax:w-[40%]  info-item-right">
                  <h2>₦{user.accountBalance}</h2>
                  <p>{user.accountNumber}/Providus Bank</p>
                </div>
              </div>

              <div className="bottom-section flex justify-evenly smMax:w-[900px]">
                <p className="active">General Details</p>
                <p>Documents</p>
                <p>Bank Details</p>
                <p>Loans</p>
                <p>Savings</p>
                <p>App and System</p>
              </div>
            </div>

            <div className="full-info overflow-x-scroll scroll">
              <h1>Personal Information</h1>

              <table className="">
                <tr>
                  <th>FULL NAME</th>
                  <th>PHONE NUMBER</th>
                  <th>EMAIL ADDRESS</th>
                  <th>BVN</th>
                  <th>GENDER</th>
                </tr>
                <tr>
                  <td>
                    {user.profile.firstName} {user.profile.lastName}
                  </td>
                  <td>{user.profile.phoneNumber}</td>
                  <td>{user.email}</td>
                  <td>{user.profile.bvn}</td>
                  <td>{user.profile.gender}</td>
                </tr>
                <tr>
                  <th>MARITAL STATUS</th>
                  <th>CHILDREN</th>
                  <th>TYPE OF RESIDENCE</th>
                </tr>
                <tr>
                  <td>Single</td>
                  <td>None</td>
                  <td>Parent’s Apartment</td>
                </tr>
              </table>
              <h1>Education and Employment</h1>
              <table className="">
                <tr>
                  <th>LEVEL OF EDUCATION</th>
                  <th>EMPLOYMENT STATUS</th>
                  <th>SECTOR OF EMPLYMENT</th>
                  <th>DURATION OF EMPLOYMENT</th>
                </tr>
                <tr>
                  <td>{user.education.level}</td>
                  <td>{user.education.employmentStatus}</td>
                  <td>{user.education.sector}</td>
                  <td>{user.education.duration}</td>
                </tr>
                <tr>
                  <th>OFFICE EMAIL</th>
                  <th>MONTHLY INCOME</th>
                  <th>LOAN REPAYMENT</th>
                </tr>
                <tr>
                  <td>{user.education.officeEmail}</td>
                  <td>
                    {user.education.monthlyIncome[0]} -{" "}
                    {user.education.monthlyIncome[1]}{" "}
                  </td>
                  <td>{user.education.loanRepayment}</td>
                </tr>
              </table>
              <h1>Socials</h1>
              <table className="">
                <tr>
                  <th>TWITTER</th>
                  <th>FACEBOOK</th>
                  <th>INSTAGRAM</th>
                </tr>
                <tr>
                  <td>{user.socials.twitter}</td>
                  <td>{user.socials.facebook}</td>
                  <td>{user.socials.instagram}</td>
                </tr>
              </table>
              <h1>Guarantor</h1>
              <table className="">
                <tr>
                  <th>FULL NAME</th>
                  <th>PHONE NUMBER</th>
                  <th>EMAIL ADDRESS</th>

                  <th>RELATIONSHIP</th>
                </tr>
                <tr>
                  <td>
                    {user.guarantor.firstName} {user.guarantor.lastName}
                  </td>
                  <td>{user.guarantor.phoneNumber}</td>
                  <td>{user.guarantor.firstName}@gmail.com</td>
                  <td>Sister</td>
                </tr>
              </table>
              <table className="">
                <tr>
                  <th>FULL NAME</th>
                  <th>PHONE NUMBER</th>
                  <th>EMAIL ADDRESS</th>

                  <th>RELATIONSHIP</th>
                </tr>
                <tr>
                  <td>
                    {user.guarantor.firstName} {user.guarantor.lastName}
                  </td>
                  <td>{user.guarantor.phoneNumber}</td>
                  <td>{user.guarantor.firstName}@gmail.com</td>
                  <td>Sister</td>
                </tr>
              </table>
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-10">
            <Alert severity="error"> INVALID ID PROVIDED!!! </Alert>
          </div>
        )}
      </div>
    </div>
  );
}

export default User;
