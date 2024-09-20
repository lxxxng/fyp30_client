import { makeRequest } from '../../../axios';
import './update.scss';
import { useState, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, Box, Button, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext } from '../../../context/authContext';

const Update = ({ openUpdate, setOpenUpdate, user }) => {

  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const [formValues, setFormValues] = useState({
    city: user.city || '',
    bio: user.bio || '',
    fav_beans: user.fav_beans || [],
    fav_brewing_methods: user.fav_brewing_methods || [],
    fav_coffee_place: user.fav_coffee_place || [],
    fav_coffee_type: user.fav_coffee_type || [],
    allergies: user.allergies || [],
    tags: user.tags || [],
  });

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    }catch (err){
      console.log(err);
    }
  }

  const handleChange = (e) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
      mutationFn: (user) => makeRequest.put("/users", user), 
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
      },
      onError: (error) => {
        console.error("Update failed:", error); 
      },
  });

  const handleClick = async (e) => {
      e.preventDefault();

      let coverUrl = user.coverPic;  
      let profileUrl = user.profilePic;  
      
      if (cover) {
          coverUrl = await upload(cover);
      }

      if (profile) {
          profileUrl = await upload(profile);
      }

      const payload = { ...formValues, coverPic: coverUrl, profilePic: profileUrl };

      // Log the payload before sending it to the server
      console.log('Payload being sent to the server:', payload);

      // Trigger the mutation to send the data to the server
      mutation.mutate(payload);
      
      // Close the modal
      setOpenUpdate(false);

      // update currentUser profile pic
      currentUser.profilePic = profileUrl;
  };

  // Function to add a new item to an array field
  const handleAddInput = (field) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  // Function to update a specific item in an array field
  const handleInputChange = (e, index, field) => {
    const newArray = [...formValues[field]];
    newArray[index] = e.target.value;
    setFormValues({ ...formValues, [field]: newArray });
  };

  // Function to remove an item from an array field
  const handleRemoveInput = (index, field) => {
    const newArray = [...formValues[field]];
    newArray.splice(index, 1);
    setFormValues({ ...formValues, [field]: newArray });
  };

  const renderDynamicInputs = (field, placeholder) => (
    <Box sx={{ marginBottom: '16px' }}>
      {formValues[field].map((value, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <TextField
            fullWidth
            value={value}
            placeholder={placeholder}
            onChange={(e) => handleInputChange(e, index, field)}
            sx={{ marginRight: 1 }}
          />
          <IconButton onClick={() => handleRemoveInput(index, field)}>
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
      <Button
        variant="outlined"
        size="small"
        onClick={() => handleAddInput(field)}
        startIcon={<AddIcon />}
      >
        Add {placeholder}
      </Button>
    </Box>
  );



  return (
    <Modal open={openUpdate} onClose={() => setOpenUpdate(false)} keepMounted>
      <Box
        sx={{
          width: 400,
          bgcolor: 'background.paper',
          p: 4,
          margin: 'auto',
          mt: '10%',
          borderRadius: 1,
          maxHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={() => setOpenUpdate(false)}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ overflowY: 'auto', flexGrow: 1, paddingBottom: '16px' }}>
          <form>
            Cover: <input type="file" onChange={(e) => setCover(e.target.files[0])} /> <br />
            Profile: <input type="file" onChange={(e) => setProfile(e.target.files[0])} />

            <TextField
              label="City"
              name="city"
              value={formValues.city}
              onChange={(e) => setFormValues({ ...formValues, city: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Bio"
              name="bio"
              value={formValues.bio}
              onChange={(e) => setFormValues({ ...formValues, bio: e.target.value })}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              sx={{ marginBottom: '16px' }}
            />

            {/* Dynamic Input Fields */}
            {renderDynamicInputs('fav_beans', 'Favorite Bean')}
            {renderDynamicInputs('fav_brewing_methods', 'Favorite Brewing Method')}
            {renderDynamicInputs('fav_coffee_place', 'Favorite Coffee Place')}
            {renderDynamicInputs('fav_coffee_type', 'Favorite Coffee Type')}
            {renderDynamicInputs('allergies', 'Allergy')}
            {renderDynamicInputs('tags', 'Tag')}
          </form>
        </Box>
        <Box sx={{ paddingTop: 2, borderTop: '1px solid #ddd' }}>
          <Button variant="contained" color="primary" onClick={handleClick} fullWidth>
            Update
          </Button>
        </Box>
      </Box>
    </Modal>
  
  )
}

export default Update