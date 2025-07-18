import React, { useState, useEffect } from 'react';
import { bugAPI } from '../services/api';

const BugList = ({ onEdit, onDelete, refreshTrigger }) => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    sortBy: 'createdAt',
    order: 'desc'
  });

  useEffect(() => {
    loadBugs();
  }, [filters, refreshTrigger]);

  const loadBugs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bugAPI.getAllBugs(filters);
      setBugs(response.data || []);
    } catch (error) {
      console.error('Error loading bugs:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        await bugAPI.deleteBug(id);
        loadBugs(); // Refresh the list
        onDelete && onDelete(id);
      } catch (error) {
        console.error('Error deleting bug:', error);
        setError(error.message);
      }
    }
  };

  const getSeverityClass = (severity) => {
    const classes = {
      low: 'severity-low',
      medium: 'severity-medium',
      high: 'severity-high',
      critical: 'severity-critical'
    };
    return classes[severity] || '';
  };

  const getStatusClass = (status) => {
    const classes = {
      open: 'status-open',
      'in-progress': 'status-in-progress',
      resolved: 'status-resolved',
      closed: 'status-closed'
    };
    return classes[status] || '';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading bugs...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
        <button onClick={loadBugs}>Retry</button>
      </div>
    );
  }

  return (
    <div className="bug-list-container">
      <h2>Bug List</h2>
      
      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="severity-filter">Severity:</label>
          <select
            id="severity-filter"
            name="severity"
            value={filters.severity}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-filter">Sort By:</label>
          <select
            id="sort-filter"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            <option value="createdAt">Created Date</option>
            <option value="updatedAt">Updated Date</option>
            <option value="title">Title</option>
            <option value="severity">Severity</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="order-filter">Order:</label>
          <select
            id="order-filter"
            name="order"
            value={filters.order}
            onChange={handleFilterChange}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Bug List */}
      {bugs.length === 0 ? (
        <div className="no-bugs">
          <p>No bugs found.</p>
          <p>Try adjusting your filters or create a new bug report.</p>
        </div>
      ) : (
        <div className="bug-grid">
          {bugs.map(bug => (
            <div key={bug._id} className="bug-card">
              <div className="bug-header">
                <h3 className="bug-title">{bug.title}</h3>
                <div className="bug-badges">
                  <span className={`badge ${getSeverityClass(bug.severity)}`}>
                    {bug.severity}
                  </span>
                  <span className={`badge ${getStatusClass(bug.status)}`}>
                    {bug.status}
                  </span>
                </div>
              </div>
              
              <p className="bug-description">{bug.description}</p>
              
              <div className="bug-meta">
                <p><strong>Reporter:</strong> {bug.reporter}</p>
                {bug.assignee && <p><strong>Assignee:</strong> {bug.assignee}</p>}
                <p><strong>Created:</strong> {formatDate(bug.createdAt)}</p>
                <p><strong>Updated:</strong> {formatDate(bug.updatedAt)}</p>
              </div>
              
              <div className="bug-actions">
                <button 
                  onClick={() => onEdit(bug._id)}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(bug._id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="bug-count">
        Total bugs: {bugs.length}
      </div>
    </div>
  );
};

export default BugList;