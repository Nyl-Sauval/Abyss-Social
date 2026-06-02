import {useState} from "react";
import {API_BASE_URL} from "../config";
import {useAuth} from "./useAuth.ts";

type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

interface MutationOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
}

interface MutationState<T, R> {
  data: R | null;
  loading: boolean;
  error: Error | null;
  mutate: (body?: T, overrideUrl?: string) => Promise<R | null>;
}

/**
 * Custom hook for making API mutations (POST, PUT, PATCH, DELETE) with authentication
 *
 * @template T - The type of data sent in the request body
 * @template R - The type of data returned by the API
 * @param {string} url - The API endpoint URL (without the base URL)
 * @param {MutationOptions} options - Optional configuration (method, headers)
 * @returns {MutationState<T, R>} An object containing data, loading state, error, and mutate function
 */
export function useMutation<T, R>(
  url: string,
  options: MutationOptions = {},
): MutationState<T, R> {
  const [data, setData] = useState<R | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

  const { token } = useAuth();

  // Extract HTTP method and additional headers from options (defaults to POST)
  const { method = "POST", headers = {} } = options;

  const mutate = async (body?: T, overrideUrl?: string): Promise<R | null> => {
    setLoading(true);
    setError(null);

    // Build headers with authentication token
    const authHeaders: Record<string, string> = { ...headers };
    if (token) {
      authHeaders["Authorization"] = `Bearer ${token}`;
    }

    try {
      // Check if body is FormData to handle headers differently
      const isFormData = body instanceof FormData;

      // Make the API request
      const response = await fetch(`${API_BASE_URL}${overrideUrl ?? url}`, {
        method,
        // Don't set Content-Type header for FormData
        headers: isFormData
          ? authHeaders
          : {
              "Content-Type": "application/json",
              ...authHeaders,
            },
        // Serialize body based on type (FormData or JSON)
        body:
          body === undefined
            ? undefined
            : isFormData
              ? body
              : JSON.stringify(body),
      });

      if (!response.ok) {
        let errorMessage = `Erreur: ${response.status}`;
        try {
          const errorData = await response.json();
          // Le backend renvoie généralement l'erreur dans un champ "error" ou "message"
          errorMessage = errorData.error || errorData.message || errorData.error_description || errorMessage;
        } catch (e) {
          // Si on ne peut pas parser le JSON, on garde le message générique
        }
        throw new Error(errorMessage);
      }

      const result = response.status !== 204 ? await response.json() : null;

      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, mutate };
}
