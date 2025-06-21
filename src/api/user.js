const axios = require('axios')
const BASE_URL = 'http://localhost:5000/api';

const Login = (credentials) => axios.post(`${BASE_URL}/user/login`, credentials);
const Register = (credentials) => axios.post(`${BASE_URL}/user/register`, credentials);
const getAllUsers = () => axios.get(`${BASE_URL}/user/all`);

module.exports = {
    Login,
    Register,
    getAllUsers
}