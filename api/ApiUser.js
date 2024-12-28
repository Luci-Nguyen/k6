import { URL } from 'https://jslib.k6.io/url/1.0.0/index.js';
import http from 'k6/http';

export const userAPI = (baseUrl, headers) => {

    const getAllUser = (page) => {
        const url = new URL(`${baseUrl}/users`);
        url.searchParams.append('page', page);
        return http.get(url.toString(),headers)
    }
    const getSingleUser =(userId)=>{
        const url = new URL(`${baseUrl}/users/${userId}`);
        return http.get(url.toString(),headers)
    }
    return {
        getAllUser, getSingleUser
    }
}