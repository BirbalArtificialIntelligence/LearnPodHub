/**
 * Example of Frontend-Backend Integration
 * This file demonstrates how to connect the React frontend to the Express backend
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Types from shared schema
import { Content, ModerationStatus } from '@shared/types';

/**
 * Custom hook for content moderation operations
 * Demonstrates integration between frontend and backend
 */
export function useContentModeration() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<{
    language?: string;
    status?: ModerationStatus;
  }>({});

  // Fetch contents with optional filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/contents', filter],
    queryFn: async ({ queryKey }) => {
      const [_, filterParams] = queryKey;
      const params = new URLSearchParams();
      
      if (filterParams.language) {
        params.append('language', filterParams.language);
      }
      
      if (filterParams.status) {
        params.append('status', filterParams.status);
      }
      
      const url = `/api/contents?${params.toString()}`;
      const res = await fetch(url, { credentials: 'include' });
      
      if (!res.ok) {
        throw new Error(`Error fetching contents: ${res.statusText}`);
      }
      
      return res.json();
    },
  });

  // Submit new content
  const submitContent = useMutation({
    mutationFn: async (newContent: { text: string; language: string }) => {
      const response = await apiRequest('POST', '/api/contents', newContent);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch contents after successful submission
      queryClient.invalidateQueries({ queryKey: ['/api/contents'] });
    },
  });

  // Update moderation status
  const updateModeration = useMutation({
    mutationFn: async ({ 
      contentId, 
      status, 
      notes 
    }: { 
      contentId: number; 
      status: ModerationStatus; 
      notes?: string;
    }) => {
      const response = await apiRequest(
        'PATCH', 
        `/api/contents/${contentId}/moderation`, 
        { status, notes }
      );
      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate specific content and contents list
      queryClient.invalidateQueries({ queryKey: ['/api/contents'] });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/contents/${variables.contentId}`] 
      });
    },
  });

  // Delete content
  const deleteContent = useMutation({
    mutationFn: async (contentId: number) => {
      const response = await apiRequest('DELETE', `/api/contents/${contentId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contents'] });
    },
  });

  return {
    contents: data?.data || [],
    isLoading,
    error,
    filter,
    setFilter,
    submitContent,
    updateModeration,
    deleteContent,
  };
}

/**
 * Example component showing frontend-backend integration
 * This is a simplified version for demonstration purposes
 */
export function ContentModerationPanel() {
  const {
    contents,
    isLoading,
    error,
    filter,
    setFilter,
    submitContent,
    updateModeration,
    deleteContent,
  } = useContentModeration();

  const [newContent, setNewContent] = useState({ text: '', language: 'en' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContent.mutate(newContent);
    setNewContent({ text: '', language: 'en' });
  };

  const handleApprove = (contentId: number) => {
    updateModeration.mutate({ contentId, status: 'approved' });
  };

  const handleReject = (contentId: number) => {
    updateModeration.mutate({ contentId, status: 'rejected' });
  };

  const handleDelete = (contentId: number) => {
    if (confirm('Are you sure you want to delete this content?')) {
      deleteContent.mutate(contentId);
    }
  };

  if (error) {
    return <div>Error loading contents: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Content Moderation</h2>
      
      {/* Filter controls */}
      <div className="flex gap-4">
        <select
          value={filter.language || ''}
          onChange={(e) => setFilter({ ...filter, language: e.target.value || undefined })}
          className="border rounded p-2"
        >
          <option value="">All Languages</option>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="es">Spanish</option>
        </select>
        
        <select
          value={filter.status || ''}
          onChange={(e) => setFilter({ ...filter, status: e.target.value as ModerationStatus || undefined })}
          className="border rounded p-2"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      
      {/* Content submission form */}
      <form onSubmit={handleSubmit} className="border p-4 rounded">
        <div className="space-y-4">
          <div>
            <label htmlFor="text" className="block mb-1">Content Text</label>
            <textarea
              id="text"
              value={newContent.text}
              onChange={(e) => setNewContent({ ...newContent, text: e.target.value })}
              className="w-full border rounded p-2"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label htmlFor="language" className="block mb-1">Language</label>
            <select
              id="language"
              value={newContent.language}
              onChange={(e) => setNewContent({ ...newContent, language: e.target.value })}
              className="border rounded p-2"
              required
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="zh">Chinese</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={submitContent.isPending}
          >
            {submitContent.isPending ? 'Submitting...' : 'Submit Content'}
          </button>
        </div>
      </form>
      
      {/* Content list */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Content List</h3>
        
        {isLoading ? (
          <div>Loading...</div>
        ) : contents.length === 0 ? (
          <div>No content found.</div>
        ) : (
          <div className="space-y-4">
            {contents.map((content: Content) => (
              <div key={content.id} className="border rounded p-4">
                <p className="mb-2">{content.text}</p>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Language: {content.language}</span>
                  <span>Status: {content.moderation?.status || 'pending'}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleApprove(content.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    disabled={updateModeration.isPending}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(content.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    disabled={updateModeration.isPending}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDelete(content.id)}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                    disabled={deleteContent.isPending}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
