import React, { useState, useContext } from 'react';
import { Context } from "../store/appContext";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { store, actions } = useContext(Context);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    createUser();

  };

  const createUser = () => {
    fetch(localStorage.getItem('backendUrl') + 'api/register', {
      method: 'POST',
      body: JSON.stringify({
        username: email.toLowerCase(),
        password: password
      }),
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      return response.json();
    }).then((jsonRes) => {
      console.log(jsonRes);
      setSuccess("Registration successful!");
      window.location.reload();
    }).catch((e) => {
      console.log(e);
      setError("Registration failed. Please try again.");
    });
  };

  return (
    <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
         <div class="modal-dialog d-flex justify-content-center">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="exampleModalLabel1">Register</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
        <div class="modal-body">
    <form onSubmit={handleSubmit} className="container p-4">
      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}

      <div className="row mb-3">
        <label htmlFor="inputEmail" className="col-sm-3 col-form-label">
          Email
        </label>
        <div className="col-sm-9">
          <input
            type="email"
            className="form-control"
            id="inputEmail"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="inputPassword" className="col-sm-3 col-form-label">
          Password
        </label>
        <div className="col-sm-9">
          <input
            type="password"
            className="form-control"
            id="inputPassword"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="inputConfirmPassword" className="col-sm-3 col-form-label">
          Confirm Password
        </label>
        <div className="col-sm-9">
          <input
            type="password"
            className="form-control"
            id="inputConfirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-sm-10 offset-sm-2">
          {/* <button type="submit" className="btn btn-primary" data-bs-target="#registerModal" onClick={createUser}> */}
          <button type="submit" className="btn btn-primary" data-bs-target="#registerModal">
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