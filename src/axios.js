import axios from 'axios';

export const makeRequest = axios.create({
    baseURL:"https://fyp30-b07db14946ce.herokuapp.com/",
    withCredentials:true,
});