"user client";

import { Link, useNavigate } from "react-router-dom";
import logo from "../public/img/logo.png";
import { useUser } from "../context/userContext";

function Navbar() {
  const { session, setSession, user, setUser } = useUser();

  const navigate = useNavigate();

  return (
    <nav className="h-[100px] bg-[#11131E] sticky top-0 z-50">
      <div className="w-full flex flex-row justify-between items-center h-full px-16 text-2xl font-bold">
        <Link className="flex flex-row  items-center font-thin" to="/">
          <img src={logo} alt="logo" className="mr-4" />
          OpenCity
        </Link>
        <Link to="/">Events</Link>
        <Link to="/community">Community</Link>
        {user && ["admin"].includes(user.role) && (
          <Link to="/adm/users">Users</Link>
        )}
        {user && user.role !== "user" && <Link to="/adm/reports">Reports</Link>}
        {session ? (
          <div className="flex flex-row text-xl [&>*]:mx-2">
            <Link to="/myInfo">{user ? user.email : "My Info"}</Link>
            <div
              onClick={() => {
                localStorage.removeItem("opencity-token");
                setSession("");
                navigate("/");
                setUser(null);
              }}
            >
              Sign out
            </div>
          </div>
        ) : (
          <div className="flex flex-row text-xl [&>*]:mx-2">
            <Link
              to="/register"
              className=" bg-black px-4 py-2 border border-solid border-white rounded-full hover:bg-white hover:text-black transition-colors duration-500 ease-in-out"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="bg-black px-4 py-2 border border-solid border-white rounded-full hover:bg-[#1A1C28] transition-colors duration-500 ease-in-out"
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
