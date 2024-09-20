import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import './shoplisting.scss';
import { makeRequest } from '../../../axios';

function Shoplisting({ shoplisting, onDelete }) {
    const navigate = useNavigate();

    const handleToggle = () => {
        navigate(`/owner/shoplisting/${shoplisting.shop_id}/overview`);
    };

    const handleEditShop = () => {
        navigate(`/owner/shoplisting/update/${shoplisting.shop_id}`);
    };

    const handleDeleteShop = async () => {
        // alert(`Delete shop with ID: ${shoplisting.shop_id}`);
        if(window.confirm(`Are you sure you want to delete the shop "${shoplisting.name}"`)){
            try{
                await makeRequest.delete(`/shoplistings/delete?shopId=${shoplisting.shop_id}`);
                alert(`shop "${shoplisting.name}" deleted successfully`);
                onDelete();
            }catch(err){
                alert(`Failed to delete shop: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    // Conditional rendering for no shop message
    if (!shoplisting || Object.keys(shoplisting).length === 0) {
        return (
            <div className="no-shop-message">
                <p>No shop listings found. Please create a shop.</p>
                <button onClick={() => navigate('/owner/shoplisting/create')}>Create Shop</button>
            </div>
        );
    }

    return (
        <div className="shoplisting">
            <div className="shop">
                <img src={shoplisting.photo_gallery[0]} alt={shoplisting.name} />

                <div className="details">
                    <h2>{shoplisting.name}</h2>
                    <p className="type">{shoplisting.type}</p>
                </div>

                <div className="buttons">
                    <button onClick={handleEditShop}><EditIcon /></button>
                    <button onClick={handleDeleteShop}><DeleteIcon /></button>
                    <button onClick={handleToggle}>
                        <InfoIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Shoplisting;
