import axios from 'axios'
import React from 'react'

    const api = axios.create({
        baseURL: "http://localhost:8080/api"
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