import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ListPage.css';

function Enrollments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 });
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchReviews();
  }, [pagination.page, pageSize]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/feedback/reviews/', {
        params: { page: pagination.page, page_size: pageSize }
      });
      setItems(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        page: pagination.page
      });
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`http://localhost:8000/api/feedback/reviews/${id}/`);
        toast.success('Review deleted successfully');
        fetchReviews();
      } catch (error) {
        console.error('Failed to delete enrollment:', error);
        toast.error('Failed to delete enrollment');
      }
    }
  };

  const handlePreviousPage = () => {
    if (pagination.previous) {
      setPagination({ ...pagination, page: pagination.page - 1 });
    }
  };

  const handleNextPage = () => {
    if (pagination.next) {
      setPagination({ ...pagination, page: pagination.page + 1 });
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="list-container">
        <div className="loading">
          <span className="spinner"></span> Loading reviews...
        </div>
      </div>
    );
  }

  return (
    <div className="list-container">
      <h1>Reviews Management</h1>

      <div className="list-controls">
        <div className="page-size-control">
          <label htmlFor="pageSize">Items per page:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value));
              setPagination({ ...pagination, page: 1 });
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card">
          <p>No reviews found</p>
        </div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Tutor</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((review) => (
                <tr key={review.id}>
                  <td>{review.id}</td>
                  <td>{review.student?.user?.username || '-'}</td>
                  <td>{review.tutor?.user?.username || '-'}</td>
                  <td>{review.rating}/5 ⭐</td>
                  <td>{review.comment?.substring(0, 50) || '-'}</td>
                  <td>{new Date(review.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="button button-danger"
                      onClick={() => handleDelete(review.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button
          onClick={handlePreviousPage}
          disabled={!pagination.previous}
          className="button button-secondary"
        >
          Previous
        </button>
        <span className="page-info">
          Page {pagination.page} of {Math.ceil(pagination.count / pageSize)}
          ({pagination.count} total)
        </span>
        <button
          onClick={handleNextPage}
          disabled={!pagination.next}
          className="button button-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Enrollments;
