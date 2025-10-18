# Frontend Memory Viewer Example

This is an optional enhancement that shows how to add memory viewing capability to the Profile screen.

## Add Memory Section to ProfileScreen.jsx

```jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ProfileScreen() {
  const { user } = useAuth();
  const [memories, setMemories] = useState([]);
  const [memoryStats, setMemoryStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMemories, setShowMemories] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Fetch memory statistics
  const fetchMemoryStats = async () => {
    try {
      const response = await fetch(`${API_URL}/memory/stats`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setMemoryStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching memory stats:', error);
    }
  };

  // Fetch all memories
  const fetchMemories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/memory`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setMemories(data.data);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a memory
  const deleteMemory = async (memoryId) => {
    try {
      const response = await fetch(`${API_URL}/memory/${memoryId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setMemories(memories.filter(m => m.id !== memoryId));
        fetchMemoryStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  // Clear all memories
  const clearAllMemories = async () => {
    if (!confirm('Are you sure you want to clear all memories? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/memory`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setMemories([]);
        setMemoryStats(null);
        alert(`Cleared ${data.count} memories`);
      }
    } catch (error) {
      console.error('Error clearing memories:', error);
    }
  };

  useEffect(() => {
    fetchMemoryStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      {/* ... existing profile content ... */}

      {/* Memory Section */}
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              🧠 Mom's Memories About You
            </h2>
            <button
              onClick={() => {
                setShowMemories(!showMemories);
                if (!showMemories && memories.length === 0) {
                  fetchMemories();
                }
              }}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              {showMemories ? 'Hide' : 'Show'} Memories
            </button>
          </div>

          {/* Memory Statistics */}
          {memoryStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-pink-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-pink-600">
                  {memoryStats.total}
                </div>
                <div className="text-sm text-gray-600">Total Memories</div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {memoryStats.byIntent?.food || 0}
                </div>
                <div className="text-sm text-gray-600">Food Preferences</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {memoryStats.byIntent?.cleaning || 0}
                </div>
                <div className="text-sm text-gray-600">Cleaning Prefs</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">
                  {memoryStats.byIntent?.exchange || 0}
                </div>
                <div className="text-sm text-gray-600">Exchange Prefs</div>
              </div>
            </div>
          )}

          {/* Memory List */}
          {showMemories && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading memories...</p>
                </div>
              ) : memories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No memories yet. Start chatting with Mom to build memories!</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">
                      Showing {memories.length} memories
                    </p>
                    <button
                      onClick={clearAllMemories}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Clear All
                    </button>
                  </div>

                  {memories.map((memory) => (
                    <div
                      key={memory.id}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              memory.metadata?.intent === 'food' ? 'bg-orange-100 text-orange-700' :
                              memory.metadata?.intent === 'cleaning' ? 'bg-blue-100 text-blue-700' :
                              memory.metadata?.intent === 'exchange' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {memory.metadata?.intent || 'general'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {memory.metadata?.type}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(memory.metadata?.stored_at).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 text-sm">
                            {memory.memory || memory.text || JSON.stringify(memory).substring(0, 100)}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => deleteMemory(memory.id)}
                          className="ml-4 text-red-500 hover:text-red-700"
                          title="Delete this memory"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              ℹ️ About Memories
            </h3>
            <p className="text-sm text-blue-800">
              Mom learns from your conversations to provide more personalized recommendations. 
              Your memories are private and you can delete them anytime. Mom uses these to 
              remember your preferences like dietary restrictions, cleaning times, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;
```

## Alternative: Simple Memory Badge

If you want a simpler integration, just show a memory count badge:

```jsx
function SimpleMemoryBadge() {
  const [memoryCount, setMemoryCount] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    fetch(`${API_URL}/memory/stats`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMemoryCount(data.data.total);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">Mom remembers</span>
      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full font-semibold">
        {memoryCount} things
      </span>
      <span className="text-gray-600">about you</span>
    </div>
  );
}
```

## Add to Navigation

You can add a memory indicator to the navigation:

```jsx
<div className="flex items-center gap-2">
  <span className="text-xs text-gray-500">
    🧠 {memoryCount} memories
  </span>
</div>
```

## Search Memories Component

```jsx
function MemorySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const searchMemories = async () => {
    if (!query.trim()) return;
    
    const response = await fetch(
      `${API_URL}/memory/search?q=${encodeURIComponent(query)}`,
      { credentials: 'include' }
    );
    const data = await response.json();
    if (data.success) {
      setResults(data.data);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchMemories()}
          placeholder="Search memories..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          onClick={searchMemories}
          className="px-6 py-2 bg-pink-500 text-white rounded-lg"
        >
          Search
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Found {results.length} memories</p>
          {results.map(memory => (
            <div key={memory.id} className="bg-gray-50 p-3 rounded">
              {memory.memory || memory.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Usage Tips

1. **Show memory count** on the profile to give users transparency
2. **Allow deletion** so users feel in control
3. **Categorize memories** by intent (food, cleaning, exchange)
4. **Search functionality** helps users find specific memories
5. **Export option** for data portability (future enhancement)

This is completely optional - the memory system works great behind the scenes without any UI!

