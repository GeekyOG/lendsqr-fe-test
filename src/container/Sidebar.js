import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Sidebar from "../components/Sidebar";

function SidebarContainer() {
  return (
    <div className="sidebar  ">
      <div className="section-wrapper">
        <div className="sidebar-content flex items-center">
          <Sidebar
            icon={<img src="/static/briefcase.png" />}
            text={"Switch Organization"}
          />
          <KeyboardArrowDownIcon />
        </div>
        <div className="sidebar-content">
          <Sidebar icon={<img src="/static/home.png" />} text={"dashboard"} />
        </div>
      </div>

      <div className="section-wrapper">
        <h1 className="pl-6">CUSTOMERS</h1>
        <div className="sidebar-content">
          <Sidebar icon={<img src="/static/users.png" />} text={"Users"} />
        </div>
        <div className="sidebar-content">
          <Sidebar
            icon={<img src="/static/guarantors.png" />}
            text={"Garantors"}
          />
        </div>
        <div className="sidebar-content">
          <Sidebar icon={<img src="/static/loans.png" />} text={"Loans"} />
        </div>

        <Sidebar
          icon={<img src="/static/decision.png" />}
          text={"Decision Models"}
        />
        <Sidebar icon={<img src="/static/savings.png" />} text={"Savings"} />
        <Sidebar icon={<img src="/static/loans.png" />} text={"Loan Request"} />
        <Sidebar
          icon={<img src="/static/whitelist.png" />}
          text={"WhiteList"}
        />
        <Sidebar icon={<img src="/static/karma.png" />} text={"Karma"} />
      </div>

      <div className="section-wrapper">
        <h1 className="pl-6">BUSINESSES</h1>
        <Sidebar
          icon={<img src="/static/briefcase.png" />}
          text={"Organization"}
        />
        <Sidebar
          icon={<img src="/static/loan-request.png" />}
          text={"Loan Products"}
        />
        <Sidebar
          icon={<img src="/static/bank.png" />}
          text={"Savings Product"}
        />
        <Sidebar
          icon={<img src="/static/fees.png" />}
          text={"Fees and Charges"}
        />
        <Sidebar
          icon={<img src="/static/transcations.png" />}
          text={"Transcations"}
        />
        <Sidebar icon={<img src="/static/services.png" />} text={"Services"} />
        <Sidebar
          icon={<img src="/static/service-account.png" />}
          text={"Service Account"}
        />
        <Sidebar
          icon={<img src="/static/settlements.png" />}
          text={"Settlement"}
        />
        <Sidebar icon={<img src="/static/report.png" />} text={"Report"} />
      </div>

      <div>
        <h1 className="pl-6">SETTINGS</h1>
        <Sidebar
          icon={<img src="/static/prefrences.png" />}
          text={"Prefrences"}
        />
        <Sidebar
          icon={<img src="/static/badge-percent.png" />}
          text={"Fees and Pricing"}
        />
        <Sidebar icon={<img src="/static/logs.png" />} text={"Audit logs"} />
      </div>
    </div>
  );
}

export default SidebarContainer;
