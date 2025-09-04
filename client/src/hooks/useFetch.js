import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null); // reset error before fetching
            try {
                const res = await axios.get(url);
                console.log("[useFetch] Success:", res.data);
                setData(res.data);
            } catch (err) {
                console.error("[useFetch] Error:", err);
                setError(err);
            }
            setLoading(false);
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useFetch;