import { useState, useEffect } from "react";
import URL from "../utils/constant";

const useApiData = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve token from localStorage (or another place)
        const token = localStorage.getItem('token'); // Or use a global state/store

        // Define headers with the token
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }) // Only include the Authorization header if token exists
        };

        const response = await fetch(`${URL}${endpoint}`, {
          method: 'GET',
          headers: headers
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

export default useApiData;
