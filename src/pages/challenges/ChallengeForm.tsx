import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateChallenge, useUpdateChallenge, useChallenge, useBadges } from '../../hooks/useChallenges';
import { routes } from '../../app/route';
import type { Badge, ReadingChallenge as Challenge } from '../../app/types/readingChallenge';

import { useBooks } from '../../hooks/useBooks';


const ChallengeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  // Fetch challenge data for edit mode
  const { data: challenge, isLoading: isChallengeLoading, isError: isChallengeError, error: challengeError } = useChallenge(id || '');
  
  // Fetch badges and books
  const { data: rawBadges, isLoading: isBadgesLoading } = useBadges(10000000);
  const { data: booksData, isLoading: isBooksLoading } = useBooks();
  // Form state
  const badgesData = Array.isArray(rawBadges?.data) ? rawBadges.data : [];
  const [formData, setFormData] = useState<Partial<Challenge>>({
    name: '',
    description: '',
    target_count: 1,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default: 1 week from now
    is_active: true,
    badge_id: '',
    book_ids: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mutations
  const createMutation = useCreateChallenge();
  const updateMutation = useUpdateChallenge();

  // Pre-fill form for edit mode
  useEffect(() => {
    if (isEditMode && challenge) {
      setFormData({
        name: challenge.name,
        description: challenge.description,
        target_count: challenge.target_count,
        start_date: new Date(challenge.start_date).toISOString().split('T')[0],
        end_date: new Date(challenge.end_date).toISOString().split('T')[0],
        is_active: challenge.is_active,
        badge_id: challenge.badge?.id || '',
        book_ids: challenge.suggested_books?.map((book) => book.id.toString()) || [],
      });
    }
  }, [challenge, isEditMode]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle book multi-select
  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, book_ids: selected }));
    setErrors((prev) => ({ ...prev, book_ids: '' }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.target_count || formData.target_count < 1) newErrors.target_count = 'Target count must be at least 1';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    if (new Date(formData.end_date!) <= new Date(formData.start_date!)) {
      newErrors.end_date = 'End date must be after start date';
    }
    if (!formData.book_ids || formData.book_ids.length === 0) newErrors.book_ids = 'At least one book is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      navigate(routes.admin.challenges.index);
    } catch (error) {
      setErrors({ form: (error as Error).message || 'Failed to save challenge' });
    }
  };

  const isLoading = isChallengeLoading || isBadgesLoading || isBooksLoading || createMutation.isPending || updateMutation.isPending;
  const badges = badgesData || [];
  const books = booksData || [];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        {isEditMode ? 'Edit Challenge' : 'Create Challenge'}
      </h2>

      {/* Error Alert */}
      {(isChallengeError || createMutation.isError || updateMutation.isError || errors.form) && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {errors.form || (isChallengeError ? (challengeError as Error)?.message : (createMutation.error || updateMutation.error)?.message) || 'An error occurred'}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600`}
            disabled={isLoading}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600`}
            rows={4}
            disabled={isLoading}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="target_count" className="block text-gray-700 font-medium mb-2">Target Book Count</label>
          <input
            type="number"
            id="target_count"
            name="target_count"
            value={formData.target_count || 1}
            onChange={handleChange}
            min="1"
            className={`w-full border ${errors.target_count ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600`}
            disabled={isLoading}
          />
          {errors.target_count && <p className="text-red-500 text-sm mt-1">{errors.target_count}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="start_date" className="block text-gray-700 font-medium mb-2">Start Date</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date || ''}
            onChange={handleChange}
            className={`w-full border ${errors.start_date ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600`}
            disabled={isLoading}
          />
          {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="end_date" className="block text-gray-700 font-medium mb-2">End Date</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date || ''}
            onChange={handleChange}
            className={`w-full border ${errors.end_date ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600`}
            disabled={isLoading}
          />
          {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="is_active" className="flex items-center gap-2 text-gray-700 font-medium">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active || false}
              onChange={handleChange}
              disabled={isLoading}
              className="h-5 w-5 text-blue-600 focus:ring-blue-600"
            />
            Active
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="badge_id" className="block text-gray-700 font-medium mb-2">Badge</label>
          <select
            id="badge_id"
            name="badge_id"
            value={formData.badge_id || ''}
            onChange={handleChange}
            className={`w-full border ${errors.badge_id ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600`}
            disabled={isLoading || isBadgesLoading}
          >
            <option value="">Select a badge (optional)</option>
            {badges.map((badge: Badge) => (
              <option key={badge.id} value={badge.id}>{badge.name}</option>
            ))}
          </select>
          {errors.badge_id && <p className="text-red-500 text-sm mt-1">{errors.badge_id}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="book_ids" className="block text-gray-700 font-medium mb-2">Books</label>
          <select
            id="book_ids"
            name="book_ids"
            multiple
            value={formData.book_ids || []}
            onChange={handleBookChange}
            className={`w-full border ${errors.book_ids ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 h-40`}
            disabled={isLoading || isBooksLoading}
          >
            {books.map((book) => (
              <option key={book.id} value={book.id}>{book.title} by {book.author}</option>
            ))}
          </select>
          {errors.book_ids && <p className="text-red-500 text-sm mt-1">{errors.book_ids}</p>}
          <p className="text-gray-500 text-sm mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple books</p>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            onClick={() => navigate(routes.admin.challenges.index)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Challenge' : 'Create Challenge'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChallengeForm;
