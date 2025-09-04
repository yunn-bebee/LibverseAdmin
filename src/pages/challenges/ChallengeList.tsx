  import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChallenges, useDeleteChallenge, useJoinChallenge } from '../../hooks/useChallenges';
import { routes } from '../../app/route';
import type { ReadingChallenge as Challenge, ChallengeFilters } from '../../app/types/readingChallenge';

const ChallengeList: React.FC = () => {
  const [filters, setFilters] = useState<ChallengeFilters>({ page: 1, per_page: 10 });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useChallenges(filters, filters.per_page);
  const deleteMutation = useDeleteChallenge();
  const joinMutation = useJoinChallenge();

  const challenges : Challenge[] = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.meta.pagination || { total_pages: 1, current_page: 1 };

  const handleFilterChange = (key: keyof ChallengeFilters, value: string | number | boolean | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleDeleteClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedChallenge) {
      await deleteMutation.mutateAsync(selectedChallenge.id);
      setDeleteDialogOpen(false);
      setSelectedChallenge(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedChallenge(null);
  };

  const handleJoinChallenge = async (challengeId: string) => {
    await joinMutation.mutateAsync(challengeId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-3xl font-semibold text-gray-800">Challenges Management</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          onClick={() => navigate(routes.admin.challenges.create)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Challenge
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search Challenges"
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          disabled={isLoading}
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <select
          value={filters.active !== undefined ? (filters.active ? 'active' : 'inactive') : ''}
          onChange={(e) => handleFilterChange('active', e.target.value === 'active' ? true : e.target.value === 'inactive' ? false : undefined)}
          disabled={isLoading}
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="current">Current</option>
        </select>
        <button
          onClick={() => setFilters({ page: 1, per_page: 10 })}
          disabled={isLoading}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Error Alerts */}
      {isError && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {(error as Error)?.message || 'Failed to fetch challenges'}
        </div>
      )}
      {deleteMutation.isError && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {(deleteMutation.error as Error)?.message || 'Failed to delete challenge'}
        </div>
      )}
      {joinMutation.isError && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {(joinMutation.error as Error)?.message || 'Failed to join challenge'}
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* No Results */}
          {pagination.total_pages === 0 && (
            <div className="flex justify-center items-center h-48 border border-dashed border-gray-300 rounded bg-gray-50">
              <p className="text-gray-600 text-lg">
                {filters.search || filters.active !== undefined ? 'No challenges match your criteria' : 'No challenges available'}
              </p>
            </div>
          )}

          {/* Challenges Grid */}
          {pagination.total_pages > 0 && (
            <div className="grid grid-cols-1 gap-6">
              {challenges.map((challenge: Challenge) => (
                <div key={challenge.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-700">{challenge.name}</h3>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        challenge.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {challenge.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{challenge.description}</p>
                  <div className="flex gap-2 flex-wrap mb-4">
                    <span className="border border-gray-300 rounded px-2 py-1 text-sm">
                      Target: {challenge.target_count} books
                    </span>
                    <span className="border border-gray-300 rounded px-2 py-1 text-sm">
                      Starts: {formatDate(challenge.start_date)}
                    </span>
                    <span className="border border-gray-300 rounded px-2 py-1 text-sm">
                      Ends: {formatDate(challenge.end_date)}
                    </span>
                    {challenge.has_joined && (
                      <span className="border border-blue-600 text-blue-600 rounded px-2 py-1 text-sm">Joined</span>
                    )}
                  </div>
                  {challenge.badge && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-gray-600">Badge:</span>
                      <span className="border border-gray-300 rounded px-2 py-1 text-sm">{challenge.badge.name}</span>
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => navigate(routes.admin.challenges.edit(challenge.id))}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                      onClick={() => navigate(routes.admin.challenges.view(challenge.id))}
                    >
                      View Details
                    </button>
                    {!challenge.has_joined && (
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        onClick={() => handleJoinChallenge(challenge.id)}
                        disabled={joinMutation.isPending}
                      >
                        Join
                      </button>
                    )}
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDeleteClick(challenge)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center gap-2">
                <button
                  className={`px-3 py-1 rounded ${
                    pagination.current_page === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                >
                  Previous
                </button>
                {[...Array(pagination.total_pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`px-3 py-1 rounded ${
                      pagination.current_page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className={`px-3 py-1 rounded ${
                    pagination.current_page === pagination.total_pages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.total_pages}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Delete Challenge</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the challenge "{selectedChallenge?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button
                className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ${
                  deleteMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeList;
