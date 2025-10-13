import React, { useState, useContext } from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
import { getMenuStyles } from "../../utils/common";
import useHeaderColor from "../../hooks/useHeaderColor";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import AddPropertyModal from "../AddPropertyModal/AddPropertyModal";
import LoginModal from "../LoginModal/LoginModal";
import useAuthCheck from "../../hooks/useAuthCheck.jsx";
import UserDetailContext from "../../context/UserDetailContext";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const headerColor = useHeaderColor();
  const [modalOpened, setModalOpened] = useState(false);
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();
  const { validateLogin } = useAuthCheck();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const [bypassMode, setBypassMode] = useState(false);


  const handleAddPropertyClick = () => {
    if (validateLogin() || bypassMode) {
      setModalOpened(true);
    }
  };

  const handleBypassLogin = () => {
    setBypassMode(true);
    setUserDetails({
      ...userDetails,
      token: "bypass-token",
      user: {
        name: "Demo User",
        email: "demo@propertypro.com",
        picture: "https://via.placeholder.com/40"
      }
    });
    setLoginModalOpened(false);
  };

  const handleLoginClick = () => {
    setLoginModalOpened(true);
  };

  const handleAuth0Login = () => {
    setLoginModalOpened(false);
    loginWithRedirect();
  };
  return (
    <section className="h-wrapper" style={{ background: headerColor }}>
      <div className="flexCenter innerWidth paddings h-container">
        {/* logo */}
        <Link to="/">
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '24px', fontWeight: 'bold', color: '#1f3e72' }}>
            🏠 PropertyPro
          </div>
        </Link>

        {/* menu */}
        <OutsideClickHandler
          onOutsideClick={() => {
            setMenuOpened(false);
          }}
        >
          <div
            // ref={menuRef}
            className="flexCenter h-menu"
            style={getMenuStyles(menuOpened)}
          >
            <NavLink to="/properties">Properties</NavLink>

            <a href="mailto:contact@propertypro.com">Contact</a>

            {/* add property */}
            <div onClick={handleAddPropertyClick}>Add Property</div>
            <AddPropertyModal opened={modalOpened} setOpened={setModalOpened} />
            {/* login button */}
            {!isAuthenticated && !bypassMode ? (
              <button className="button" onClick={handleLoginClick}>
                Login
              </button>
            ) : (
              <ProfileMenu 
                user={bypassMode ? { name: "Demo User", email: "demo@propertypro.com", picture: "https://via.placeholder.com/40" } : user} 
                logout={bypassMode ? () => setBypassMode(false) : logout} 
              />
            )}
          </div>
        </OutsideClickHandler>

        {/* for medium and small screens */}
        <div
          className="menu-icon"
          onClick={() => setMenuOpened((prev) => !prev)}
        >
          <BiMenuAltRight size={30} />
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        opened={loginModalOpened}
        setOpened={setLoginModalOpened}
        onLogin={handleAuth0Login}
        onDemoAccess={handleBypassLogin}
      />
    </section>
  );
};

export default Header;
