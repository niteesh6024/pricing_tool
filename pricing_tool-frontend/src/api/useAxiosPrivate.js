import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { privateApiClient } from "./ApiClient";

const useAxiosPrivate = () => {
    const { token, refreshAccessToken } = useAuth();

    useEffect(() => {
        const requestIntercept = privateApiClient.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        const responseIntercept = privateApiClient.interceptors.response.use(
            response => response,
            async error => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refreshAccessToken();
                    if (!newAccessToken) return Promise.reject(error);
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return privateApiClient(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            privateApiClient.interceptors.request.eject(requestIntercept);
            privateApiClient.interceptors.response.eject(responseIntercept);
        };
    }, [token, refreshAccessToken]);

    return privateApiClient;
};

export default useAxiosPrivate;
