import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../img/logowide.png";
import { SignIn } from "../component/signIn";
import { Register } from "./register";
import { Context } from "../store/appContext";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
	const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
	if (userLoggedIn !== store.isLoggedIn) {
	  actions.setIsLoggedIn(userLoggedIn);
	}
  }, [actions, store.isLoggedIn]);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary bg-transparent">
      <SignIn />
      <Register />
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img 
            src={logo} 
            alt="Logo" 
            className="navbar-logo" 
            style={{ width: '200px', height: 'auto' }} 
          />
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNavDropdown" 
          aria-controls="navbarNavDropdown" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="d-flex" id="navbarNavDropdown">
          <ul className="navbar-nav">
            {store.isLoggedIn && (
              <>
                <li className="nav-item mx-2">
                  <a className="nav-link" href="/gallery">Gallery</a>
                </li>
                <li className="nav-item mx-2">
                  <a className="nav-link" href="/tags">Tags</a>
                </li>
                <li>
                  <div className="dropdown">
                    <button 
                      className="btn dropdown-toggle nav-item mx-2 btn btn-success" 
                      type="button" 
                      data-bs-toggle="dropdown" 
                      aria-expanded="false"
                    >
                      Create A Card
                    </button>
                    <ul className="dropdown-menu">
                      <li><Link to='/charimageCreator' className="dropdown-item">Character</Link></li>
                      <li><Link to='/itemimageCreator' className="dropdown-item">Item</Link></li>
                      <li><Link to='/spellimageCreator' className="dropdown-item">Spell</Link></li>
                    </ul>
                  </div>
                </li>
              </>
            )}

            {!store.isLoggedIn && (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle pt-0" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <i className="fa-regular fa-circle-user fa-2x"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#signInModal">Sign In</a></li>
                </ul>
              </li>
            )}

            {store.isLoggedIn && (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle pt-0" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <i className="fa-regular fa-circle-user fa-2x"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><a 
                  className="dropdown-item"
                  href="/profile/:id">
                    Profile
                  </a>
                  </li>
                  <li>
                    <a
                    className="dropdown-item"
                    href="/favorites">
                      Favorites
                    </a>
                  </li>

                  <li><a 
                  className="dropdown-item"
                  href="#">
                    Settings
                  </a>
                  </li>
                  <li><a 
                    className="dropdown-item" 
                    href="/" 
                    onClick={() => {
                      localStorage.setItem('userLoggedIn', 'false');
                      actions.setIsLoggedIn(false);
                      navigate('/');
                    }}
                  >
                    Logout
                  </a></li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};