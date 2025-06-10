import { apiClient } from "./ApiClient"

export  const getCategories
= (token)=>apiClient.get(`/api/categories/`,
        {
                headers: {
                Authorization: `Bearer ${token}`,
                },
        }
)

export  const createCategory =
(token, categoryData) => apiClient.post(`/api/categories/`,
        categoryData,
        {
                headers: {
                        Authorization: `Bearer ${token}`,
                },
        }
)
