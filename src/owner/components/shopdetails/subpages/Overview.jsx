import React from 'react';
import './overview.scss'; // Import the SCSS file
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LabelIcon from '@mui/icons-material/Label';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';

function Overview({ data }) {
    return (
        <div className="shop-overview-container">
            <h3>{data?.name || "No name available"}</h3>
            <div className="shop-details">
                <div className="shop-description">
                    <DescriptionIcon className='icon' />
                        <div className="info">
                        <strong>Description:</strong>
                    <span>{data?.description || "No description available"}</span>
                    </div>
                </div>
                <div className="shop-detail-item">
                    
                    <LabelIcon className="icon" />
                    <div className='info'>
                        <strong>Type:</strong>
                        <span>{data?.type || "No type specified"}</span>
                    </div>
                </div>
                
                {/* Combined Location and Postal Code */}
                <div className="location-postal-container">
                    <LocationOnIcon className="icon" />
                    <div className="location-postal-details">
                        <div>
                            <div className='info'>
                                <strong>Location:</strong>
                                <span>{data?.location || "Location not provided"}</span>
                            </div>
                        </div>
                        <div>
                            <div className='info'>
                                <strong>Postal Code:</strong>
                                <span>{data?.postal_code || "Postal code not provided"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="shop-detail-item">
                    <AccessTimeIcon className="icon" />
                    <div className='info'>
                        <strong>Open Time:</strong>
                        <span>{data?.open_time || "No opening hours provided"}</span>
                    </div>
                </div>
                <div className="shop-detail-item">
                    <CalendarTodayIcon className="icon" />
                    <div className='info'>
                        <strong>Closed On:</strong>
                        <span>{data?.closed_on?.length > 0 ? data.closed_on.join(', ') : "No closed days provided"}</span>
                    </div>
                </div>
                <div className="shop-detail-item">
                    <CalendarTodayIcon className="icon" />
                    <div className='info'>
                        <strong>Date Established:</strong>
                        <span>{data?.date_established ? new Date(data.date_established).toLocaleDateString() : "No date available"}</span>
                    </div>
                </div>
                <div className="shop-detail-item">
                    <LabelIcon className="icon" />
                    <div className='info'>
                        <strong>License Number:</strong>
                        <span>{data?.license_number || "No license number available"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Overview;
