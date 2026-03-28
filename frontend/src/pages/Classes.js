import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ListPage.css';

function Classes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 });
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchClasses();
  }, [pagination.page, pageSize]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/classes/classes/', {
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
      console.error('Failed to fetch classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await axios.delete(`http://localhost:8000/api/classes/${id}/`);
        toast.success('Class deleted successfully');
        fetchClasses();
      } catch (error) {
        console.error('Failed to delete class:', error);
        toast.error('Failed to delete class');
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
          <span className="spinner"></span> Loading classes...
        </div>
      </div>
    );
  }

  return (
    <div className="list-container">
      <h1>Classes Management</h1>

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
          <p>No classes found</p>
        </div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Subject</th>
                <th>Tutor</th>
                <th>Level</th>
                <th>Schedule</th>
                <th>Max Students</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((cls) => (
                <tr key={cls.id}>
                  <td>{cls.id}</td>
                  <td>{cls.name}</td>
                  <td>{cls.subject}</td>
                  <td>{cls.tutor?.user?.username || '-'}</td>
                  <td>{cls.level}</td>
                  <td>{cls.schedule}</td>
                  <td>{cls.max_students}</td>
                  <td>
                    <button
                      className="button button-danger"
                      onClick={() => handleDelete(cls.id)}
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

export default Classes;
