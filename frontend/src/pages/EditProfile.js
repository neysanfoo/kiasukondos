import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProfile = () => {
  // use object destructuring for state variables
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    phoneNumber: "",
    profilePicture: null,
    currentPictureUrl: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // use an async/await function instead of .then
    const getUserProfile = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/user-profile/",
          { withCredentials: true }
        );
        setFormData({
          ...formData,
          username: data.user.username,
          email: data.user.email,
          phoneNumber: data.profile.phone_number,
          currentPictureUrl: data.profile.profile_picture,
        });
      } catch (error) {
        console.log(error);
      }
    };
    getUserProfile();
  }, []);

  console.log(formData)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    setFormData({
      ...formData,
      profilePicture: e.target.files[0],
    });
  };

  const handleSubmitInformation = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("username", formData.username);
      if (formData.profilePicture) {
        data.append("profile_picture", formData.profilePicture);
      }
      data.append("phone_number", formData.phoneNumber);

      const { data: responseData } = await axios.patch(
        "http://localhost:8000/api/user-profile/",
        data,
        { withCredentials: true }
      );
      setSuccess(responseData.message);
    } catch (error) {
      console.log(error);
      setError("Failed to update profile information");
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("current_password", formData.currentPassword);
      data.append("new_password", formData.newPassword);
      data.append("confirm_password", formData.confirmPassword);

      const { data: responseData } = await axios.patch(
        "http://localhost:8000/api/change-password/",
        data,
        { withCredentials: true }
      );

      setSuccess(responseData.message);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.log(error);
      setError("Failed to update password");
    }
  };

  // delete request to api/user-profile
  const deleteAccount = async (e) => {
    try {
      const { data } = await axios.delete(
        "http://localhost:8000/api/user-profile/",
        { withCredentials: true }
      );

      window.location.href = "/homes";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <h1>Edit Profile</h1>
          {formData.currentPictureUrl ? (
            <img
                className="edit-profile__current-photo"
              src={`http://localhost:8000${formData.currentPictureUrl}`}
              alt="Current Profile Picture"
            />
          ) : (
            <p>No photo selected</p>
          )}
          <label className="edit-profile__upload-label" htmlFor="photo">
            {formData.currentPictureUrl ? "Change photo" : "Upload photo"}
          </label>
            <input 
                className="edit-profile__upload-btn"
                type="file"
                id="photo"
                name="profilePicture"
                onChange={handlePhotoChange}
            />
        <button className="delete-profile__submit-btn" onClick={deleteAccount}>
          Delete Account
        </button>
        </div>
        <div className="col-md-8">
        {error && <p className="edit-profile__error">{error}</p>}
        {success && <p className="edit-profile__success">{success}</p>}
        <form className="edit-profile__form" onSubmit={handleSubmitInformation}>
            <div className="edit-profile__form-group">
            <label className="edit-profile__label" htmlFor="email">
                Email
            </label>
            <input
                className="edit-profile__input"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
            />
            </div>
            <div className="edit-profile__form-group">
            <label className="edit-profile__label" htmlFor="username">
                Username
            </label>
            <input
                className="edit-profile__input"
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
            />
            </div>
            <div className="edit-profile__form-group">
                <label className="edit-profile__label" htmlFor="phone-number">
                    Phone Number
                </label>
                <input 
                    className="edit-profile__input"
                    type="text"
                    id="phone-number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                />
            </div>
            <div className="edit-profile__form-group">
            <button className="edit-profile__submit-btn">Update Profile Information</button>
            </div>
            </form>
            <form className="edit-profile__form" onSubmit={handleSubmitPassword}>
              <div className="edit-profile__form-group">
                <label className="edit-profile__label" htmlFor="current-password">
                  Current Password
                </label>
                <input
                  className="edit-profile__input"
                  type="password"
                  id="current-password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="edit-profile__form-group">
                <label className="edit-profile__label" htmlFor="new-password">
                  New Password
                </label>
                <input
                  className="edit-profile__input"
                  type="password"
                  id="new-password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="edit-profile__form-group">
                <label className="edit-profile__label" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <input
                  className="edit-profile__input"
                  type="password"
                  id="confirm-password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="edit-profile__form-group">
                <button className="edit-profile__submit-btn me-4">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
    </div>
    );
};
export default EditProfile; 