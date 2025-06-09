import { apiClient } from "./ApiClient"

export  const getCategories
= (token)=>apiClient.get(`/api/categories/`,
        {
                headers: {
                Authorization: `Bearer ${token}`,
                },
        }
)
