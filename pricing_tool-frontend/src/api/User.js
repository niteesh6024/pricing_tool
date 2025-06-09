import { apiClient } from "./ApiClient"

export  const authenticateUser 
= (username, password)=>apiClient.post(`/api/login/`,
        {
                username: username,
                password: password
        }
)

export  const registerUser 
= (username, email, password, role)=>apiClient.post(`/api/register/`,
        {
                username: username,
                email: email,
                password: password,
                role: role
        }
)       