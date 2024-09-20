import { useContext } from 'react';
import './shopdetails.scss';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../../axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Tabs, Tab, Box } from '@mui/material';

import Overview from './subpages/Overview';
import Events from './subpages/Events';

function ShopDetails(shop) {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const shopId = parseInt(location.pathname.split("/")[3]);

    const { isLoading, error, data } = useQuery({
        queryKey: ['shopdetails', shopId],
        queryFn: async () => {
            const res = await makeRequest.get(`shoplistings/find/${shopId}`);
            console.log("API Response:", res.data); // Debugging line
            return res.data; // Make sure data is returned correctly
        }
    });

    const shopBasePath = `/owner/shoplisting/${shopId}`;


    const backToListings = () => {
        navigate('/owner/shoplisting')
    }


    return (
        <div className="shop-details-container">
            <div className='header-container'>
                <IconButton onClick={backToListings}>
                    <ArrowBackIcon />
                </IconButton>
                <h2>Shop Details</h2>
            </div>
            {/* Handle different states: loading, error, or data */}
            {error ? (
                <div className="error-message">Something went wrong: {error.message}</div>
            ) : isLoading ? (
                <div>Loading...</div>
            ) : data ? (
                <>
                    {/* Small Navbar for navigating between subpages */}
                    <Box className="shop-navbar">
                        <Tabs
                            value={location.pathname}
                            variant="scrollable"
                            scrollButtons="auto"
                            textColor="primary"
                            indicatorColor="primary"
                        >
                            <Tab label="Overview" component={Link} to={`${shopBasePath}/overview`} />
                            <Tab label="Events" component={Link} to={`${shopBasePath}/events`} />
                            {/* Add more tabs here as needed */}
                        </Tabs>
                    </Box>

                    {/* Subpage content that changes based on route */}
                    <div className="shop-content">
                        <Routes>
                            <Route path={`/overview`} element={<Overview data={data[0]} />} />
                            <Route path={`/events`} element={<Events shopId={shopId} />} />
                            {/* Add more routes here as needed */}
                        </Routes>
                    </div>
                </>
            ) : (
                <div>No data found</div>
            )}
        </div>
    );
}

export default ShopDetails