import React, { useState, useEffect } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import "./map.scss";

const defaultCenter = {
  lat: 1.335,
  lng: 103.776,
};

const cafes = [
  { id: 1, name: "Brew Haven", address: "12 Coffee St, Singapore 123456", lat: 1.3521, lng: 103.8198 },
  { id: 2, name: "Latte Lounge", address: "45 Espresso Rd, Singapore 234567", lat: 1.3448, lng: 103.8232 },
  { id: 3, name: "Mocha Magic", address: "78 Cappuccino Blvd, Singapore 345678", lat: 1.3603, lng: 103.8156 },
  { id: 4, name: "Cafe De Bliss", address: "23 Java Ln, Singapore 456789", lat: 1.3352, lng: 103.7767 }, // Near SIM University
  { id: 5, name: "Perk Up Cafe", address: "56 Brew St, Singapore 567890", lat: 1.3112, lng: 103.7637 },  // Near SIM University
  { id: 6, name: "The Grind House", address: "90 Roast Rd, Singapore 678901", lat: 1.3357, lng: 103.8482 },
  { id: 7, name: "Bean There", address: "112 Arabica St, Singapore 789012", lat: 1.3399, lng: 103.7641 }, // Near SIM University
  { id: 8, name: "Sip & Chill", address: "67 Cold Brew Ln, Singapore 890123", lat: 1.3196, lng: 103.7669 }, // Near SIM University

  // New cafes in Singapore
  { id: 9, name: "Java Jolt", address: "20 Raffles Place, Singapore", lat: 1.2839, lng: 103.8517 },
  { id: 10, name: "Caffeine Fix", address: "100 Orchard Rd, Singapore", lat: 1.3048, lng: 103.8318 },
  { id: 11, name: "Espresso Express", address: "50 Tanjong Pagar, Singapore", lat: 1.2769, lng: 103.8458 },
  { id: 12, name: "Daily Grind", address: "150 Pasir Ris St, Singapore", lat: 1.3724, lng: 103.9495 },
  { id: 13, name: "Brewed Awakening", address: "75 Bedok North, Singapore", lat: 1.3336, lng: 103.9273 },
  { id: 14, name: "Roastery Cafe", address: "40 Bukit Timah Rd, Singapore", lat: 1.3285, lng: 103.8065 },
  { id: 15, name: "Pour Over Perfection", address: "123 Clementi Ave, Singapore", lat: 1.3122, lng: 103.7648 },
  { id: 16, name: "Steamed Beans", address: "20 Jurong West, Singapore", lat: 1.3507, lng: 103.719 },
  { id: 17, name: "Night Owl Cafe", address: "400 Hougang Ave, Singapore", lat: 1.3701, lng: 103.8904 },

  // Cafes in Johor Bahru
  { id: 18, name: "JB Brew", address: "50 Jalan Wong Ah Fook, Johor Bahru, Malaysia", lat: 1.4655, lng: 103.7578 },
  { id: 19, name: "Southern Grind", address: "200 Jalan Tun Abdul Razak, Johor Bahru, Malaysia", lat: 1.4811, lng: 103.7629 },
  { id: 20, name: "Johor Java", address: "80 Jalan Trus, Johor Bahru, Malaysia", lat: 1.4617, lng: 103.7635 },
  { id: 21, name: "Cafe JB Vibes", address: "250 Jalan Tebrau, Johor Bahru, Malaysia", lat: 1.4895, lng: 103.7578 },
  { id: 22, name: "Cup of Joe JB", address: "75 Jalan Abdul Samad, Johor Bahru, Malaysia", lat: 1.4735, lng: 103.7516 }
];


function Map() {
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [proximity, setProximity] = useState(10); // In kilometers
  const [filteredCafes, setFilteredCafes] = useState(cafes);

  const isDarkMode = JSON.parse(localStorage.getItem("darkMode"));

  const darkModeMapStyles = [
    { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
    { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#4b6878" }] },
    { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#64779e" }] },
    { featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{ color: "#4b6878" }] },
    { featureType: "landscape.man_made", elementType: "geometry.stroke", stylers: [{ color: "#334e87" }] },
    { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#023e58" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#283d6a" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6f9ba5" }] },
    { featureType: "poi", elementType: "labels.text.stroke", stylers: [{ color: "#1d2c4d" }] },
    { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#023e58" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#3C7680" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#304a7d" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#98a5be" }] },
    { featureType: "road", elementType: "labels.text.stroke", stylers: [{ color: "#1d2c4d" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2c6675" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#255763" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#b0d5ce" }] },
    { featureType: "road.highway", elementType: "labels.text.stroke", stylers: [{ color: "#023e58" }] },
    { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#98a5be" }] },
    { featureType: "transit", elementType: "labels.text.stroke", stylers: [{ color: "#1d2c4d" }] },
    { featureType: "transit.line", elementType: "geometry.fill", stylers: [{ color: "#283d6a" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4e6d70" }] }
  ];
  

  useEffect(() => {
    // Get owner's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({
            lat: latitude,
            lng: longitude,
          });
        },
        (error) => console.error("Error getting location:", error)
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  // Function to calculate distance between two lat/lng points
  const calculateDistance = (location1, location2) => {
    if (!location1 || !location2) return 0;
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((location2.lat - location1.lat) * Math.PI) / 180;
    const dLng = ((location2.lng - location1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((location1.lat * Math.PI) / 180) *
        Math.cos((location2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Filter cafes based on search text and proximity
  useEffect(() => {
    const filtered = cafes.filter((cafe) => {
      const matchesSearch = cafe.name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const distance = calculateDistance(currentLocation, {
        lat: cafe.lat,
        lng: cafe.lng,
      });
      const withinProximity = distance <= proximity;
      return matchesSearch && withinProximity;
    });
    setFilteredCafes(filtered);
  }, [searchText, proximity, currentLocation]);

  const handleCafeClick = (cafe) => {
    setSelectedCafe(cafe);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleProximityChange = (e) => {
    setProximity(Number(e.target.value));
  };

  const handleProximityInputChange = (e) => {
    const value = Math.max(0, Math.min(50, Number(e.target.value))); // Ensure the value is between 0 and 50
    setProximity(value);
  };

  return (
    <div className="map-container">
      <h2>Coffee Trail: Explore Cafes Around You</h2>
      <LoadScript
        googleMapsApiKey="AIzaSyB2KKtu7WZ8-7WOX_OW8rRu9XgL1D-cwAw"
        libraries={["places"]}
      >
        {/* Replace StandaloneSearchBox with a custom search input */}
        <div className="map-search-container">
          <input
            type="text"
            placeholder="Search for cafes"
            value={searchText}
            onChange={handleSearchChange}
            className="map-search-input"
          />
        </div>

        {/* Proximity Slider with Text Input */}
        <div className="proximity-slider-container">
          <label>Proximity: </label>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={proximity}
            onChange={handleProximityChange}
            className="proximity-slider"
          />
          <input
            type="number"
            min="0"
            max="50"
            value={proximity}
            onChange={handleProximityInputChange}
            className="proximity-input"
          />
          <label> km</label>
        </div>

        <GoogleMap
          mapContainerClassName="map"
          center={currentLocation || defaultCenter}
          zoom={currentLocation ? 15 : 12}
          onLoad={(map) => setMap(map)}
          options={{
            styles: isDarkMode ? darkModeMapStyles : null ,
            disableDefaultUI: true,
            zoomControl: true,
          }}
        >
          {/* Owner's Current Location Marker */}
          {currentLocation && (
            <Marker
              position={currentLocation}
              title="You are here"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
          )}

          {/* Cafe Markers */}
          {filteredCafes.map((cafe) => (
            <Marker
              key={cafe.id}
              position={{ lat: cafe.lat, lng: cafe.lng }}
              title={cafe.name}
              onClick={() => handleCafeClick(cafe)}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      {/* Display selected cafe details */}
      {selectedCafe && (
        <div className="cafe-info">
          <h3>{selectedCafe.name}</h3>
          <p>{selectedCafe.address}</p>
        </div>
      )}
    </div>
  );
}

export default Map;