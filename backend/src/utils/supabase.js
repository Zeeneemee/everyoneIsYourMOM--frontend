import { createClient } from '@supabase/supabase-js';
import { config } from '../config/database.js';

// Create Supabase client with anon key (for user-level operations)
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

// Create Supabase admin client with service key (for admin operations)
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceKey
);

/**
 * Generic query helper for Supabase
 */
export class SupabaseService {
  constructor(tableName) {
    this.tableName = tableName;
    this.client = supabase;
  }

  /**
   * Get all records from table
   */
  async getAll(filters = {}, options = {}) {
    try {
      let query = this.client.from(this.tableName).select('*');
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
      
      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending ?? true });
      }
      
      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching from ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Get a single record by ID
   */
  async getById(id) {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching ${this.tableName} by ID:`, error);
      throw error;
    }
  }

  /**
   * Create a new record
   */
  async create(data) {
    try {
      const { data: newRecord, error } = await this.client
        .from(this.tableName)
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return newRecord;
    } catch (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Update a record by ID
   */
  async update(id, data) {
    try {
      const { data: updatedRecord, error } = await this.client
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedRecord;
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a record by ID
   */
  async delete(id) {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Error deleting ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Search records with text search
   */
  async search(column, searchTerm, options = {}) {
    try {
      let query = this.client
        .from(this.tableName)
        .select('*')
        .ilike(column, `%${searchTerm}%`);
      
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error searching ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Execute custom query
   */
  async customQuery(queryBuilder) {
    try {
      const query = this.client.from(this.tableName).select('*');
      const { data, error } = await queryBuilder(query);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error executing custom query on ${this.tableName}:`, error);
      throw error;
    }
  }
}

export default supabase;

