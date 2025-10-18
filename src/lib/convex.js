import { ConvexHttpClient } from 'convex/browser';

// Initialize Convex client with URL from environment
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || 'https://your-project.convex.cloud';

export const convexClient = new ConvexHttpClient(CONVEX_URL);

// Helper function to call Convex queries
export async function queryConvex(functionReference, args = {}) {
  try {
    return await convexClient.query(functionReference, args);
  } catch (error) {
    console.error('Convex query error:', error);
    throw error;
  }
}

// Helper function to call Convex mutations
export async function mutateConvex(functionReference, args = {}) {
  try {
    return await convexClient.mutation(functionReference, args);
  } catch (error) {
    console.error('Convex mutation error:', error);
    throw error;
  }
}

export default convexClient;

