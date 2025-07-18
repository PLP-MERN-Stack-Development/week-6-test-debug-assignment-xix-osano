const validateBugData = (bugData) => {
  const errors = [];
  
  if (!bugData.title || bugData.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (bugData.title && bugData.title.length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }
  
  if (!bugData.description || bugData.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (bugData.description && bugData.description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }
  
  if (!bugData.reporter || bugData.reporter.trim().length === 0) {
    errors.push('Reporter name is required');
  }
  
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  if (bugData.severity && !validSeverities.includes(bugData.severity)) {
    errors.push('Invalid severity level');
  }
  
  const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
  if (bugData.status && !validStatuses.includes(bugData.status)) {
    errors.push('Invalid status');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

module.exports = {
  validateBugData,
  sanitizeInput
};