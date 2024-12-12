import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../store/appContext";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { store, actions } = useContext(Context);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoginSuccess(false);

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    signIn();
  };

  const signIn = () => {
    fetch(localStorage.getItem('backendUrl') + 'api/token', {
      method: 'POST',
      body: JSON.stringify({
        email: email.toLowerCase(),
        password: password
      }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then((response) => response.json())
    .then((jsonRes) => {
      if (jsonRes.token) {
        localStorage.setItem('token', jsonRes.token);
        localStorage.setItem('userId', jsonRes.id);
        localStorage.setItem('userLoggedIn', 'true');
  
        console.log("Token retrieved for user ID:", jsonRes.id);
  
        actions.setIsLoggedIn(true);

        const modalElement = document.getElementById('signInModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
      } else {
        setError("Invalid credentials.");
        setLoginSuccess(false);
      }
    })
    .catch((e) => {
      console.log(e);
      setError("E-mail/Password is Incorrect");
      setLoginSuccess(false);
    });
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    const modalElement = document.getElementById('registerModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  };

  return (
    <div className="modal fade" id="signInModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog d-flex justify-content-center">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title" id="exampleModalLabel1">Sign In</h2>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit} className="container p-4">
              {error && <p className="text-danger">{error}</p>}

              {loginSuccess && (
                <div className="alert alert-success" role="alert">
                  Login Successful! Welcome back.
                </div>
              )}

              <div className="row mb-3">
                <label htmlFor="inputEmail3" className="col-sm-3 col-form-label">
                  Email
                </label>
                <div className="col-sm-9">
                  <input
                    type="email"
                    className="form-control"
                    id="inputEmail3"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label htmlFor="inputPassword3" className="col-sm-3 col-form-label">
                  Password
                </label>
                <div className="col-sm-9">
                  <input
                    type="password"
                    className="form-control"
                    id="inputPassword3"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-10 offset-sm-2">
                  <button type="submit" className="btn btn-primary m-2">
                    Sign In
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={handleRegisterClick} 
                  >
                    Register
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};