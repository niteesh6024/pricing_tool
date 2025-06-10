import axios from "axios";
// This file is used to create an axios instance for making API requests
export const apiClient = axios.create(
    {
        baseURL:"http://localhost:8000" ,
        Origin: "http://localhost:3000"
    }
)