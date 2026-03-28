import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ListPage.css';

function Users() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 });
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pageSize]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/users/users/', {
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
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${id}/`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
        toast.error('Failed to delete user');
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
          <span className="spinner"></span> Loading users...
        </div>
      </div>
    );
  }

  return (
    <div className="list-container">
      <h1>Users Management</h1>

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
          <p>No users found</p>
        </div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Is Staff</th>
                <th>Date Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.is_staff ? 'Yes' : 'No'}</td>
                  <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="button button-danger"
                      onClick={() => handleDelete(user.id)}
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

export default Users;
