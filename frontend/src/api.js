import axios from 'axios'
import React from 'react'
const apiUrl = import.meta.env.VITE_API_URL;

    const api = axios.create({
        baseURL: apiUrl
    });

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        if (!config.url.includes("/auth/login")) {
            if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    })


export default api