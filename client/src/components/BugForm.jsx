import React, { useState, useEffect } from 'react';
import { bugAPI } from '../services/api';

const BugForm = ({ bugId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reporter: '',
    assignee: '',
    severity: 'medium',
    status: 'open'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bugId) {
      loadBug();
    }
  }, [bugId]);

  const loadBug = async () => {
    try {
      setLoading(true);
      const response = await bugAPI.getBug(bugId);
      setFormData(response.data);
    } catch (error) {
      console.error('Error loading bug:', error);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }
    
    if (!formData.reporter.trim()) {
      newErrors.reporter = 'Reporter name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      if (bugId) {
        await bugAPI.updateBug(bugId, formData);
      } else {
        await bugAPI.createBug(formData);
      }
      
      onSubmit && onSubmit();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading && bugId) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bug-form">
      <h2>{bugId ? 'Edit Bug' : 'Report New Bug'}</h2>
      
      {errors.general && (
        <div className="error-message">{errors.general}</div>
      )}
      
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
          maxLength="100"
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={errors.description ? 'error' : ''}
          maxLength="500"
          rows="4"
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="reporter">Reporter *</label>
        <input
          type="text"
          id="reporter"
          name="reporter"
          value={formData.reporter}
          onChange={handleChange}
          className={errors.reporter ? 'error' : ''}
        />
        {errors.reporter && <span className="error-text">{errors.reporter}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="assignee">Assignee</label>
        <input
          type="text"
          id="assignee"
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="severity">Severity</label>
        <select
          id="severity"
          name="severity"
          value={formData.severity}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (bugId ? 'Update Bug' : 'Create Bug')}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BugForm;