// src/api/trash.js
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const getAllTrash = () => axios.get(`${BASE_URL}/trash`);
const getTrashById = (id) => axios.get(`${BASE_URL}/trash/${id}`);
const addTrash = (data) => axios.post(`${BASE_URL}/trash`, data);
const updateTrash = (id, data) => axios.put(`${BASE_URL}/trash/${id}`, data);
const deleteTrash = (id) => axios.delete(`${BASE_URL}/trash/${id}`);

module.exports = {
    getAllTrash,
    getTrashById,
    addTrash,
    updateTrash,
    deleteTrash,
};
