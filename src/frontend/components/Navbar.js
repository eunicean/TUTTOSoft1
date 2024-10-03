const React = require('react');
// import { IoIosArrowBack, IoIosChatbubbles } from "react-icons/io";
const {IoIosArrowBack, IoIosChatbubbles} = require("react-icons/io");

const Navbar = () => {
  return (
    <div className="navbar">
      <IoIosArrowBack />
      <h1>Sesiones próximas</h1>
      <IoIosChatbubbles />
    </div>
  );
};

export default Navbar;
