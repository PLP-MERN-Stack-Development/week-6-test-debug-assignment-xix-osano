const { validateBugData, sanitizeInput } = require('../../utils/validation');

describe('Validation Utils', () => {
  describe('validateBugData', () => {
    test('should return valid for correct bug data', () => {
      const bugData = {
        title: 'Test Bug',
        description: 'This is a test bug',
        reporter: 'John Doe',
        severity: 'medium',
        status: 'open'
      };
      
      const result = validateBugData(bugData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('should return invalid for missing title', () => {
      const bugData = {
        description: 'This is a test bug',
        reporter: 'John Doe'
      };
      
      const result = validateBugData(bugData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
    });
    
    test('should return invalid for title exceeding 100 characters', () => {
      const bugData = {
        title: 'a'.repeat(101),
        description: 'This is a test bug',
        reporter: 'John Doe'
      };
      
      const result = validateBugData(bugData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title cannot exceed 100 characters');
    });
    
    test('should return invalid for missing description', () => {
      const bugData = {
        title: 'Test Bug',
        reporter: 'John Doe'
      };
      
      const result = validateBugData(bugData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description is required');
    });
    
    test('should return invalid for invalid severity', () => {
      const bugData = {
        title: 'Test Bug',
        description: 'This is a test bug',
        reporter: 'John Doe',
        severity: 'invalid'
      };
      
      const result = validateBugData(bugData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid severity level');
    });
  });
  
  describe('sanitizeInput', () => {
    test('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      const result = sanitizeInput(input);
      expect(result).toBe('scriptalert("xss")/scriptHello');
    });
    
    test('should trim whitespace', () => {
      const input = '  Hello World  ';
      const result = sanitizeInput(input);
      expect(result).toBe('Hello World');
    });
    
    test('should handle non-string input', () => {
      const input = 123;
      const result = sanitizeInput(input);
      expect(result).toBe(123);
    });
  });
});