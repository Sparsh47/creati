import axios from 'axios';

export const authenticatedFetcher = async ([url, token]: [string, string]) => {
    const response = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    return response.data;
}

export const fetcherOptions = {
    refreshInterval: 60000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    errorRetryCount: 3,
    errorRetryInterval: 1000
}