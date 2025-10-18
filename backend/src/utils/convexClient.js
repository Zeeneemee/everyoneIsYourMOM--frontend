import { ConvexHttpClient } from 'convex/browser';
import { config } from '../config/database.js';

/**
 * Convex HTTP Client for server-side operations
 */
export class ConvexClient {
  constructor() {
    if (!config.convex.url) {
      throw new Error(
        'CONVEX_URL is not defined. Please add it to your .env file.\n' +
        'Get it from: https://dashboard.convex.dev/ -> Your Project -> Settings -> URL'
      );
    }

    this.client = new ConvexHttpClient(config.convex.url);
  }

  /**
   * Query Convex database
   */
  async query(functionName, args = {}) {
    try {
      return await this.client.query(functionName, args);
    } catch (error) {
      console.error(`Convex query error (${functionName}):`, error);
      throw error;
    }
  }

  /**
   * Mutate Convex database
   */
  async mutation(functionName, args = {}) {
    try {
      return await this.client.mutation(functionName, args);
    } catch (error) {
      console.error(`Convex mutation error (${functionName}):`, error);
      throw error;
    }
  }

  /**
   * Execute Convex action
   */
  async action(functionName, args = {}) {
    try {
      return await this.client.action(functionName, args);
    } catch (error) {
      console.error(`Convex action error (${functionName}):`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const convexClient = new ConvexClient();

export default convexClient;

