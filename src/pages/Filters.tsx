import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import "./styles/dashboard.css";
import InfoBox from "../components/InfoBox";
import Table from "../components/TableData/Table";
import Pagination from "../utils/Pangination";
import SidebarContainer from "../container/Sidebar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function Filter({ data, setData }: { data: any; setData: any }) {
  const usersInfo = typeof data === "string" ? JSON.parse(data) : data;
  let PageSize = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const currentTableData = useMemo(() => {
    if (data) {
      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;
      return usersInfo.slice(firstPageIndex, lastPageIndex);
    }
  }, [currentPage, data]);

  return (
    <div className="dashboard-wrapper">
      <Header />
      <div className="flex">
        <div className="mdMax:hidden">
          <SidebarContainer />
        </div>

        <div className="main">
          <h1 className="mt-10 mb-5"> Users</h1>

          <div className="flex  flex-wrap justify-between ">
            <InfoBox
              icon={<img src="/static/icon.png" />}
              text="USERS"
              number={"2,453"}
            />
            <InfoBox
              icon={<img src="/static/icon(1).png" />}
              text="ACTIVE USERS"
              number={"2,453"}
            />
            <InfoBox
              icon={<img src="/static/icon(2).png" />}
              text="USERS WITH LOANS"
              number={"12,453"}
            />
            <InfoBox
              icon={<img src="/static/icon(3).png" />}
              text="USERS WITH SAVINGS"
              number={"102,543"}
            />
          </div>

          <div className="table-wrapper overflow-x-scroll ">
            <table className="">
              <tr>
                <th>
                  <div className="flex items-center">
                    ORGANIZATION
                    <img
                      className="ml-2"
                      src="/static/vector.png"
                      style={{ height: 10 }}
                      alt=""
                    />
                  </div>
                </th>
                <th className="flex">
                  <div className="flex items-center">
                    USERNAME
                    <img
                      className="ml-2"
                      src="/static/vector.png"
                      style={{ height: 10 }}
                      alt=""
                    />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    EMAIL
                    <img
                      className="ml-2"
                      src="/static/vector.png"
                      style={{ height: 10 }}
                      alt=""
                    />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    PHONE NUMBER
                    <img
                      className="ml-2"
                      src="/static/vector.png"
                      style={{ height: 10 }}
                      alt=""
                    />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    DATE JOINED
                    <img
                      className="ml-2"
                      src="/static/vector.png"
                      style={{ height: 10 }}
                      alt=""
                    />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    STATUS
                    <img
                      className="ml-2"
                      src="/static/vector.png"
                      style={{ height: 10 }}
                      alt=""
                    />
                  </div>
                </th>
                <th></th>
              </tr>
              {data
                ? currentTableData.map((item: any) => {
                    return <Table item={item} />;
                  })
                : "Loading..."}
              <div className="filter-container">
                <h4>Organization</h4>

                <div className="select">
                  <select>
                    <option>select</option>
                  </select>
                </div>

                <h4>Username</h4>
                <input placeholder="User" />
                <h4>Email</h4>
                <input placeholder="Email" />
                <h4>Date</h4>
                <input type="date" placeholder="Date" value={"Date"} />
                <h4>Phone number</h4>
                <input placeholder="Phone Number" />
                <h4>Status</h4>
                <div className="select">
                  <select>
                    <option>select</option>
                  </select>
                </div>

                <div className="filter-buttons flex">
                  <button className="reset-btn mr-5">Reset</button>
                  <button className="filter-btn ">Filter</button>
                </div>
              </div>
            </table>
          </div>

          <div className="flex justify-between mt-5">
            <div className=" bottom-button flex items-center smMax:hidden ">
              <p>Showing</p>
              <button className="mx-3 p-3 flex justify-between items-center">
                <p>100</p>
                <KeyboardArrowDownIcon style={{ color: "#545f7d" }} />
              </button>
              <p>out of 100</p>
            </div>
            <div>
              {data ? (
                <Pagination
                  className="pagination-bar"
                  currentPage={currentPage}
                  totalCount={usersInfo.length}
                  pageSize={PageSize}
                  onPageChange={setCurrentPage}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filter;
