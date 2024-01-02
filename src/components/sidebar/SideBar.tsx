import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useKey } from "../../hooks/useKey";

const SideBar: React.FC = () => {
  const redirect = useNavigate();
  // const { setKey } = useKey();
  return (
    <div className="drawer w-1/12">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col gap-10 p-4 items-center">
        <div className="tooltip tooltip-right" data-tip="Open Menu">
          <label htmlFor="my-drawer" className="drawer-button text-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="currentColor"
              className="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </label>
        </div>
        <div className="tooltip tooltip-right" data-tip="Change Theme">
          <label className="swap swap-rotate">
            <input
              type="checkbox"
              className="theme-controller"
              value="cupcake"
            />
            <svg
              className="swap-on fill-current w-10 h-10"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-off fill-current w-10 h-10"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>
      </div>
      <div className="drawer-side z-10">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu menu-lg bg-base-200 rounded-lg w-1/4 min-h-full">
          <span className="menu-title">Menu</span>
          <li>
            <Link to="/">
              <i className="bi bi-house"></i>
              Home
            </Link>
          </li>
          <li>
            <details open>
              <summary>
                <i className="bi bi-person"></i>
                Voters
              </summary>
              <ul>
                <li>
                  <Link to={"/voters/verify"}>
                    <i className="bi bi-patch-check"></i>
                    Verify Voter
                  </Link>
                </li>
                <li>
                  <Link to="/voters/list">
                    <i className="bi bi-card-checklist"></i>
                    List of voters
                  </Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details open>
              <summary>
                <i className="bi bi-person-circle"></i>
                Candidates
              </summary>
              <ul>
                <li>
                  <Link to="candidates/verify">
                    <i className="bi bi-patch-check"></i>
                    Verify Candidate
                  </Link>
                </li>
                <li>
                  <Link to="candidates/list">
                    <i className="bi bi-card-checklist"></i>
                    List of Candidates
                  </Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details open>
              <summary>
                <i className="bi bi-person-circle"></i>
                Admins
              </summary>
              <ul>
                <li>
                  <Link to="admins/add">
                    <i className="bi bi-patch-check"></i>
                    Add An Admin
                  </Link>
                </li>
                <li>
                  <Link to="admins/list">
                    <i className="bi bi-card-checklist"></i>
                    List of Admins
                  </Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details open>
              <summary>
                <i className="bi bi-box-seam"></i>
                Elections
              </summary>
              <ul>
                <li>
                  <Link to="elections/going">
                    <i className="bi bi-clock-history"></i>
                    Ongoing Elections
                  </Link>
                </li>
                <li>
                  <Link to="elections/statistics">
                    <i className="bi bi-graph-up"></i>
                    Election Statistics
                  </Link>
                </li>
                <li>
                  <Link to="elections/all">
                    <i className="bi bi-list-nested"></i>
                    All Elections
                  </Link>
                </li>
                <li>
                  <Link to="elections/manage">
                    <i className="bi bi-gear"></i>
                    Manage Elections
                  </Link>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <button
              className="text-warning"
              onClick={() => {
                localStorage.removeItem("private_key");
                // setKey(null);
                redirect("/login");
              }}
            >
              <i className="bi bi-box-arrow-in-left"></i>
              LogOut
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
