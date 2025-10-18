import { useState, useEffect } from 'react';
import convexClient from '../lib/convex';

/**
 * Custom hook to query Convex database
 * Similar to Convex's useQuery but for HTTP client
 */
export function useConvexQuery(functionName, args = {}, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { enabled = true, refetchInterval } = options;

  useEffect(() => {
    let isMounted = true;
    let intervalId;

    async function fetchData() {
      if (!enabled) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await convexClient.query(functionName, args);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          console.error(`Query error (${functionName}):`, err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    // Set up polling if refetchInterval is provided
    if (refetchInterval && enabled) {
      intervalId = setInterval(fetchData, refetchInterval);
    }

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [functionName, JSON.stringify(args), enabled, refetchInterval]);

  return { data, loading, error };
}

/**
 * Custom hook for Convex mutations
 */
export function useConvexMutation(functionName) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (args = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await convexClient.mutation(functionName, args);
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error(`Mutation error (${functionName}):`, err);
      return { success: false, error: err };
    }
  };

  return { mutate, loading, error };
}

