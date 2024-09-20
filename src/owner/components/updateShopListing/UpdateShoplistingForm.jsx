import React, { useContext, useState, useEffect } from 'react';
import './updateShoplistingForm.scss';
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../../axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../context/authContext";

const ShopListingForm = ({ shoplisting }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const shopId = parseInt(location.pathname.split("/")[4]);

  const { isLoading, error, data } = useQuery({
    queryKey: ['shopdetails', shopId],
    queryFn: async () => {
      if (!shopId) {
        return null;
      }
      const res = await makeRequest.get(`shoplistings/find/${shopId}`);
      return res.data;
    },
    enabled: !!shopId,
    onError: (error) => {
      console.error('Error fetching shop data:', error);
    }
  });
  


  // State to handle form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    location: '',
    postal_code: '',
    open_hour: '',
    close_hour: '',
    closed_on: '',
    date_established: '',
    license_number: '',
    wifi: '',
    seating: '',
    facebook: '',
    instagram: '',
    delivery: ''
  });

  // State to check if the shop owner has created any shop
  const [hasShop, setHasShop] = useState(false);

  // Function to parse open and close time
  const parseOpenCloseTime = (openTimeFormatted) => {
    if (!openTimeFormatted) return ['', ''];
  
    const parseTime = (time) => {
      if (!time) return ''; // Handle missing time
      let [timeStr, period] = time.split(' '); // Split into time and period (AM/PM)
      let [hours, minutes] = timeStr.split(':'); // Split time into hours and minutes
  
      // If minutes are missing, default to '00'
      minutes = minutes || '00';
      hours = parseInt(hours);
  
      // Convert to 24-hour format if a period (AM/PM) exists
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
  
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    };
  
    // Split the openTimeFormatted into parts by spaces
    const parts = openTimeFormatted.split(/\s*-\s*/); // Split using ' - ' as delimiter
    const openTime = parts[0] || ''; // First part is open time
    const closeTime = parts[1] || ''; // Second part is close time
  
    return [
      parseTime(openTime.trim()),  // Convert open time to 24-hour format
      parseTime(closeTime.trim()), // Convert close time to 24-hour format
    ];
  };
  
  

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      const shopData = data[0];
      setHasShop(true);
      console.log('Shop Data:', shopData);
  
      // Parse the open_time and split into open_hour and close_hour
      const [openTime, closeTime] = parseOpenCloseTime(shopData.open_time);
  
      // Convert date_established to YYYY-MM-DD format
      const dateEstablished = shopData.date_established ? shopData.date_established.split('T')[0] : '';
  
      // Populate the form fields with fetched shop data
      setFormData({
        name: shopData.name || '',
        description: shopData.description || '',
        type: shopData.type || '',
        location: shopData.location || '',
        postal_code: shopData.postal_code || '',
        open_hour: openTime || '',
        close_hour: closeTime || '',
        closed_on: shopData.closed_on || '',
        date_established: dateEstablished || '',
        license_number: shopData.license_number || '',
        wifi: shopData.services_offered?.WiFi || '',
        seating: shopData.services_offered?.Seating || '',
        facebook: shopData.social_media?.Facebook || '',
        instagram: shopData.social_media?.Instagram || '',
        delivery: shopData.delivery_options?.Delivery || '',
        photo_gallery: shopData.photo_gallery || []
      });
    } else {
      setHasShop(false); // Handle the case where no shop data is found
    }
  }, [data]);
  
  

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    console.log(formData)
  };

  // Format the time back to '9 AM - 5 PM' format before submitting
  const formatTime = (openTime, closeTime) => {
    const format = (time) => {
      const [hour, minute] = time.split(':');
      let hourNum = parseInt(hour);
      let period = 'AM';
      if (hourNum >= 12) {
        period = 'PM';
        if (hourNum > 12) hourNum -= 12;
      }
      if (hourNum === 0) hourNum = 12;
      return `${hourNum}:${minute} ${period}`;
    };

    return `${format(openTime)} - ${format(closeTime)}`;
  };


  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  const openTimeFormatted = formatTime(formData.open_hour, formData.close_hour);

  const finalFormData = {
    ...formData,
    shopId: shopId,
    open_time: openTimeFormatted,
    closed_on: formData.closed_on ? [formData.closed_on] : [], // Convert to array if necessary
    photo_gallery: formData.photo_gallery, // Placeholder for photo uploads
    services_offered: {
      WiFi: formData.wifi || '',  // Ensure 'WiFi' field is capitalized if needed
      Seating: formData.seating || '',  // Ensure correct capitalization
    },
    social_media: {
      Facebook: formData.facebook || '',  // Ensure correct capitalization
      Instagram: formData.instagram || '',  // Ensure correct capitalization
    },
    delivery_options: {
      Delivery: formData.delivery || '',  // Ensure correct structure for delivery field
    },
    owner_id: currentUser.id, // Use the current user's ID
  };

  // // API call to update shop listing
  try {
    await makeRequest.put(`shoplistings/update/${shopId}`, finalFormData);
    alert("updated");
    navigate('/owner/shoplisting'); // Redirect after successful update
  }catch (error) {
    if (error.response) {
      console.error("Error updating shop listing:", error.response.data);
    } else {
      console.error("Error updating shop listing:", error.message);
    }
  }
  console.log("Final Form Data:", finalFormData);

};


  const onCancel = () => {
    navigate('/owner/shoplisting');
  };
  // TODO: allow user not to enter some data

  if (!hasShop) {
    return (
      <div style={{backgroundColor: "#fce9e9", height: "625px"}}>
        <div className='noShopMSG'>
          <h2>You haven't created any shops yet!</h2>
          <p>Please create a shop first to update shop listing.</p>
          <button onClick={() => navigate('/owner/shoplisting/create')} className="create-shop-button">
            Create Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-form-container">
      <h2>Update Shop Listing</h2>
      <form onSubmit={handleSubmit} className="shop-form">
        <div className="form-group">
          <label>Shop Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Type</label>
          <input type="text" name="type" value={formData.type} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Postal Code</label>
          <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} required />
        </div>

        {/* Open and Close Hours */}
        <div className="form-group">
          <label>Open Time</label>
          <input type="time" name="open_hour" value={formData.open_hour} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Close Time</label>
          <input type="time" name="close_hour" value={formData.close_hour} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Closed On</label>
          <input type="text" name="closed_on" value={formData.closed_on} onChange={handleChange} placeholder="E.g., Sunday" />
        </div>

        <div className="form-group">
          <label>Date Established</label>
          <input type="date" name="date_established" value={formData.date_established} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>License Number</label>
          <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>WiFi</label>
          <input type="text" name="wifi" value={formData.wifi} onChange={handleChange} placeholder="Free, Paid, etc." />
        </div>

        <div className="form-group">
          <label>Seating</label>
          <input type="text" name="seating" value={formData.seating} onChange={handleChange} placeholder="Indoor, Outdoor, etc." />
        </div>

        <div className="form-group">
          <label>Facebook URL</label>
          <input type="url" name="facebook" value={formData.facebook} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Instagram URL</label>
          <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Delivery</label>
          <input type="text" name="delivery" value={formData.delivery} onChange={handleChange} placeholder="Yes, No" />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">Update Shop</button>
          <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ShopListingForm;