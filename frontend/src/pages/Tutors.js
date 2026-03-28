import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ListPage.css';

function Tutors() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 });
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchTutors();
  }, [pagination.page, pageSize]);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/users/tutors/', {
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
      console.error('Failed to fetch tutors:', error);
      toast.error('Failed to load tutors');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tutor?')) {
      try {
        await axios.delete(`http://localhost:8000/api/tutors/${id}/`);
        toast.success('Tutor deleted successfully');
        fetchTutors();
      } catch (error) {
        console.error('Failed to delete tutor:', error);
        toast.error('Failed to delete tutor');
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
          <span className="spinner"></span> Loading tutors...
        </div>
      </div>
    );
  }

  return (
    <div className="list-container">
      <h1>Tutors Management</h1>

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
          <p>No tutors found</p>
        </div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Phone</th>
                <th>Specialization</th>
                <th>Hourly Rate</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((tutor) => (
                <tr key={tutor.id}>
                  <td>{tutor.id}</td>
                  <td>{tutor.user?.username || '-'}</td>
                  <td>{tutor.phone}</td>
                  <td>{tutor.specialization}</td>
                  <td>${tutor.hourly_rate}</td>
                  <td>{tutor.rating?.toFixed(2) || 'N/A'}</td>
                  <td>
                    <button
                      className="button button-danger"
                      onClick={() => handleDelete(tutor.id)}
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

export default Tutors;
