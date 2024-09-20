import React, { useContext, useState } from "react";
import Shoplisting from "../components/shoplisting/Shoplisting";
import "./shopListings.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

const Shoplistings = () => {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.id;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [shopListings, setShopListings] = useState([]);

  const { isLoading, error } = useQuery({
    queryKey: ["shoplistings", userId],
    queryFn: () =>
      makeRequest.get(`shoplistings/find?userId=${userId}`).then((res) => {
        setShopListings(res.data); // Update state with fetched data
        return res.data;
      }),
    onError: (error) => {
      console.error("Error fetching shop listings:", error);
    },
  });

  const addShopListing = () => {
    navigate("/owner/shoplisting/create");
  };

  // Filter shop listings based on search term
  const filteredListings = shopListings.filter((listing) => {
    const shopName = listing?.name || "";
    const shopType = listing?.type || "";
    const shopLocation = listing?.location || "";
    const postalCode = listing?.postal_code || "";
    const searchTermLower = searchTerm.toLowerCase();

    return (
      shopName.toLowerCase().includes(searchTermLower) ||
      shopType.toLowerCase().includes(searchTermLower) ||
      shopLocation.toLowerCase().includes(searchTermLower) ||
      postalCode.toLowerCase().includes(searchTermLower)
    );
  });

  const handleRemoveShop = (shopId) => {
    setShopListings((prevListings) =>
      prevListings.filter((shop) => shop.shop_id !== shopId)
    );
  };

  return (
    <div className="shoplisting">
      <div className="header-container">
        <h1>My Shop Listings</h1>
        <button onClick={addShopListing}>
          <AddIcon />
        </button>
      </div>

      {/* Search Input */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search shop listings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Display Filtered Listings */}
      {error
        ? "No shop listings available"
        : isLoading
        ? "Loading..."
        : filteredListings.length === 0
        ? "No shop listings available"
        : filteredListings.map((shoplisting) => (
            <Shoplisting 
              shoplisting={shoplisting} 
              key={shoplisting.shop_id} 
              onDelete={() => handleRemoveShop(shoplisting.shop_id)} 
            />
          ))}
    </div>
  );
};

export default Shoplistings;
