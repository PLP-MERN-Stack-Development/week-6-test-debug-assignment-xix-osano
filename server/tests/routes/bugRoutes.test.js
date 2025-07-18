const request = require('supertest');
const app = require('../../server');
const Bug = require('../../models/Bug');

describe('Bug Routes', () => {
  const sampleBug = {
    title: 'Test Bug',
    description: 'This is a test bug',
    reporter: 'John Doe',
    severity: 'medium',
    status: 'open'
  };
  
  describe('POST /api/bugs', () => {
    test('should create a new bug', async () => {
      const response = await request(app)
        .post('/api/bugs')
        .send(sampleBug)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(sampleBug.title);
      expect(response.body.data.description).toBe(sampleBug.description);
      expect(response.body.data.reporter).toBe(sampleBug.reporter);
    });
    
    test('should return validation error for missing title', async () => {
      const invalidBug = { ...sampleBug };
      delete invalidBug.title;
      
      const response = await request(app)
        .post('/api/bugs')
        .send(invalidBug)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Title is required');
    });
    
    test('should return validation error for missing description', async () => {
      const invalidBug = { ...sampleBug };
      delete invalidBug.description;
      
      const response = await request(app)
        .post('/api/bugs')
        .send(invalidBug)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Description is required');
    });
  });
  
  describe('GET /api/bugs', () => {
    beforeEach(async () => {
      await Bug.create(sampleBug);
      await Bug.create({
        ...sampleBug,
        title: 'Another Bug',
        severity: 'high'
      });
    });
    
    test('should get all bugs', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });
    
    test('should filter bugs by severity', async () => {
      const response = await request(app)
        .get('/api/bugs?severity=high')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].severity).toBe('high');
    });
    
    test('should filter bugs by status', async () => {
      const response = await request(app)
        .get('/api/bugs?status=open')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });
  
  describe('GET /api/bugs/:id', () => {
    test('should get a single bug', async () => {
      const bug = await Bug.create(sampleBug);
      
      const response = await request(app)
        .get(`/api/bugs/${bug._id}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(sampleBug.title);
    });
    
    test('should return 404 for non-existent bug', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/api/bugs/${fakeId}`)
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
    });
  });
  
  describe('PUT /api/bugs/:id', () => {
    test('should update a bug', async () => {
      const bug = await Bug.create(sampleBug);
      const updatedData = {
        ...sampleBug,
        status: 'in-progress'
      };
      
      const response = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .send(updatedData)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('in-progress');
    });
    
    test('should return 404 for non-existent bug', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .put(`/api/bugs/${fakeId}`)
        .send(sampleBug)
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
    });
  });
  
  describe('DELETE /api/bugs/:id', () => {
    test('should delete a bug', async () => {
      const bug = await Bug.create(sampleBug);
      
      const response = await request(app)
        .delete(`/api/bugs/${bug._id}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Bug deleted successfully');
      
      const deletedBug = await Bug.findById(bug._id);
      expect(deletedBug).toBeNull();
    });
    
    test('should return 404 for non-existent bug', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .delete(`/api/bugs/${fakeId}`)
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
    });
  });
});