import axios from "axios";

export const apiClient = axios.create(
    {
        baseURL:"http://localhost:8000" ,
        Origin: "http://localhost:3000"
    }
)