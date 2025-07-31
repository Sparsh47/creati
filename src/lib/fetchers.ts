import axios from 'axios';

export const authenticatedFetcher = async ([url, token]: [string, string]) => {
    const response = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    return response.data;
}