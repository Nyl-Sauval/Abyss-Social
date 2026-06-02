import {useEffect, useState} from "react";
import {API_BASE_URL} from "../config";
import {useAuth} from "./useAuth.ts";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching data from the API.
 * Handles data fetching, loading states, error handling, and provides a refetch.
 * 
 * @template T - The type of data returned by the API endpoint
 * @param {string} url - The API endpoint URL (without the base URL)
 * @returns {FetchState<T>} An object containing:
 *   - data: The fetched data or null if not yet loaded
 *   - loading: Boolean indicating if the request is in progress
 *   - error: Error object if the request failed, otherwise null
 *   - refetch: Function to manually trigger a new fetch request
 */
export function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);  
  const [error, setError] = useState<Error | null>(null);
  
  // Toggle state used to trigger refetches
  const [toggle, setToggle] = useState<boolean>(false);
  
  // Get the authentication token from the Auth context
  const { token } = useAuth();

  const refetch = () => setToggle(prev => !prev);

  useEffect(() => {
    // Skip fetching if URL is empty
    if(!url || url === "") return

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Initialize headers object
        const headers: Record<string, string> = {};
        
        // Add authorization header
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(API_BASE_URL + url, { 
          headers,
          cache: "no-store" // Bypass browser cache to ensure fresh data on refetch
        });
        
        if (!response.ok) {
          throw new Error(`Fetch error: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, token, toggle]); // Re-run effect when URL, token, or toggle changes

  return { data, loading, error, refetch };
}
