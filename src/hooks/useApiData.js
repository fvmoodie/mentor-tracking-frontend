import { useEffect, useState, useCallback } from "react";

const useApiData = (url, autoFetch = true) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchData = useCallback(async (signal) => {
    try {
      setError("");
      setLoading(true);
      
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal, // Pass the abort signal
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const json = await res.json();
      setData(json);
      return json;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || "Failed to fetch data");
      }
      throw err; // Re-throw for error handling in components
    } finally {
      setLoading(false);
    }
  }, [url, token]);

  const executeRequest = useCallback(async (method = 'GET', body = null) => {
    try {
      setError("");
      setLoading(true);
      
      const controller = new AbortController();
      const options = {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal: controller.signal,
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const res = await fetch(url, options);

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const json = await res.json();
      setData(json);
      return json;
    } catch (err) {
      setError(err.message || "Request failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, token]);

  useEffect(() => {
    if (!autoFetch) return;

    const controller = new AbortController();
    
    fetchData(controller.signal)
      .catch(() => {}); // Errors already handled in fetchData

    return () => controller.abort();
  }, [autoFetch, fetchData]);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchData,
    post: (body) => executeRequest('POST', body),
    put: (body) => executeRequest('PUT', body),
    del: () => executeRequest('DELETE'),
  };
};

export default useApiData;