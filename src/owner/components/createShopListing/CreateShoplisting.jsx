import React, { useContext, useState } from "react";
import "./createShoplisting.scss";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import { makeRequest } from "../../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./createShoplisting.scss"

const ShopListingForm = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // State to manage form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    location: "",
    postal_code: "",
    open_time: "",
    closed_on: "",
    date_established: "",
    license_number: "",
    wifi: "",
    seating: "",
    facebook: "",
    instagram: "",
    delivery: "",
    open_hour: "",
    close_hour: "",
  });

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const newClosedOn = [...formData.closed_on];

    if (checked) {
      newClosedOn.push(name);
    } else {
      const index = newClosedOn.indexOf(name);
      newClosedOn.splice(index, 1);
    }
    setFormData({ ...formData, closed_on: newClosedOn });
  };

  const handleChange = (e) => {
    const newFormData = { ...formData };
    newFormData[e.target.name] = e.target.value;
    setFormData(newFormData);
  };

  const formatTime = (openTime, closeTime) => {
    const format = (time) => {
      const [hour, minute] = time.split(":");
      let hourNum = parseInt(hour);
      let period = "AM";
      if (hourNum >= 12) {
        period = "PM";
        if (hourNum > 12) hourNum -= 12;
      }
      if (hourNum === 0) hourNum = 12;
      return `${hourNum}:${minute} ${period}`;
    };
    return `${format(openTime)} - ${format(closeTime)}`;
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => makeRequest.post("/shoplistings/create", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["shoplistings"]);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const openTimeFormatted = formatTime(
      formData.open_hour,
      formData.close_hour
    );

    const finalFormData = {
      ...formData,
      open_time: openTimeFormatted,
      closed_on: formData.closed_on ? [formData.closed_on] : [],
      photo_gallery: [],
      services_offered: {
        wifi: formData.wifi,
        seating: formData.seating,
      },
      social_media: {
        facebook: formData.facebook,
        instagram: formData.instagram,
      },
      delivery_options: formData.delivery,
      owner_id: currentUser.id,
    };

    try {
      mutation.mutate(finalFormData);
      alert("Created new shop listing");
      navigate("/owner/shoplisting");
    } catch (error) {
      console.error("Error creating shop listing:", error);
    }
  };

  const onCancel = () => {
    navigate("/owner/shoplisting");
  };

  return (
    <div className="shop-form-container">
      <h2>Create Shop Listing</h2>
      <form onSubmit={handleSubmit} className="shop-form">
        <div className="form-group">
          <label>Shop Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <label>Postal Code</label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        {/* Open and Close Hours */}
        <div className="form-group">
          <label>Open Time</label>
          <input
            type="time"
            name="open_hour"
            value={formData.open_hour}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <label>Close Time</label>
          <input
            type="time"
            name="close_hour"
            value={formData.close_hour}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <label>Closed On</label>
          <div className="checkbox-group">
    {daysOfWeek.map((day) => (
      <React.Fragment key={day}>
        <input
          type="checkbox"
          name={day}
          id={day} // Add an id for the checkbox
          checked={formData.closed_on.includes(day)}
          onChange={(e) => handleCheckboxChange(e)}
        />
        <label htmlFor={day}>
          {day}
        </label>
      </React.Fragment>
    ))}
  </div>
        </div>

        <div className="form-group">
          <label>Date Established</label>
          <input
            type="date"
            name="date_established"
            value={formData.date_established}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <label>License Number</label>
          <input
            type="text"
            name="license_number"
            value={formData.license_number}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <label>WiFi</label>
          <input
            type="text"
            name="wifi"
            value={formData.wifi}
            onChange={(e) => handleChange(e)}
            placeholder="Free, Paid, etc."
          />
        </div>

        <div className="form-group">
          <label>Seating</label>
          <input
            type="text"
            name="seating"
            value={formData.seating}
            onChange={(e) => handleChange(e)}
            placeholder="Indoor, Outdoor, etc."
          />
        </div>

        <div className="form-group">
          <label>Facebook URL</label>
          <input
            type="url"
            name="facebook"
            value={formData.facebook}
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="form-group">
          <label>Instagram URL</label>
          <input
            type="url"
            name="instagram"
            value={formData.instagram}
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="form-group">
          <label>Delivery</label>
          <input
            type="text"
            name="delivery"
            value={formData.delivery}
            onChange={(e) => handleChange(e)}
            placeholder="Yes, No"
          />
        </div>

        <div className="btnGroup">
          <button type="submit" className="submit-button">
            Create Shop
          </button>
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShopListingForm;
