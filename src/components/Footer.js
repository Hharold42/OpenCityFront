import React from "react";
import { Link } from "react-router-dom";
import logo from "../public/img/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#11131E] h-[100px] mt-auto z-20">
      <div className="w-full flex flex-row justify-between items-center h-full px-16 text-lg font-bold py-4">
        <Link className="flex flex-row items-center font-thin" to="/">
          <img src={logo} alt="logo" className="mr-2" />
          OpenCity
        </Link>
        <a href="https://github.com/ITsyuryupa">Made by ITsurupa</a>
      </div>
    </footer>
  );
};

export default Footer;
