import React from 'react';
import './event.scss'; // Import the SCSS file
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PeopleIcon from '@mui/icons-material/People';
import { IconButton } from '@mui/material';

function Event() {
    const eventsData = [
        {
            "event_id": 1,
            "title": "Coffee Brewing Workshop",
            "description": "Learn the art of brewing the perfect cup of coffee with our expert baristas.",
            "date": "2024-09-21",
            "time": "10:00 AM - 1:00 PM",
            "location": "123 Coffee St, Brewtown",
            "price": "$50",
            "spots_available": 10
        },
        {
            "event_id": 2,
            "title": "Latte Art Competition",
            "description": "Compete with other baristas in a fun and friendly latte art competition.",
            "date": "2024-09-25",
            "time": "2:00 PM - 5:00 PM",
            "location": "Coffee Lovers Arena, Brewtown",
            "price": "Free",
            "spots_available": 5
        },
        {
            "event_id": 3,
            "title": "Coffee Tasting Event",
            "description": "Explore various coffee beans and brewing techniques from around the world.",
            "date": "2024-09-30",
            "time": "3:00 PM - 6:00 PM",
            "location": "Global Coffee House, Brewtown",
            "price": "$30",
            "spots_available": 20
        }
    ];

    return (
        <div className="event-page">
            <h2>Upcoming Coffee Events</h2>
            <div className="event-list">
                {eventsData.map((event) => (
                    <div className="event-card" key={event.event_id}>
                        <h3>{event.title}</h3>
                        <div className="event-detail">
                            <LocationOnIcon className="icon" />
                            <div className="info">
                                <strong>Location:</strong>
                                <span>{event.location}</span>
                            </div>
                        </div>
                        <div className="event-detail">
                            <AttachMoneyIcon className="icon" />
                            <div className="info">
                                <strong>Price:</strong>
                                <span>{event.price}</span>
                            </div>
                        </div>
                        <div className="event-detail">
                            <EventAvailableIcon className="icon" />
                            <div className="info">
                                <strong>Date:</strong>
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="event-detail">
                            <PeopleIcon className="icon" />
                            <div className="info">
                                <strong>Spots Available:</strong>
                                <span>{event.spots_available}</span>
                            </div>
                        </div>
                        <div className="event-actions">
                            <IconButton className="mui-icon-button" aria-label="edit">
                                <EditIcon />
                            </IconButton>
                            <IconButton className="mui-icon-button" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Event;
