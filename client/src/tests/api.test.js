import axios from 'axios';
import { bugAPI } from '../services/api';

jest.mock('axios');
const mockedAxios = axios;

describe('Bug API Service', () => {
  beforeEach(() => {
    mockedAxios.create.mockReturnValue(mockedAxios);
    mockedAxios.interceptors = {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBugs', () => {
    it('should fetch all bugs successfully', async () => {
      const mockBugs = [
        { _id: '1', title: 'Bug 1', description: 'Description 1' },
        { _id: '2', title: 'Bug 2', description: 'Description 2' }
      ];
      
      mockedAxios.get.mockResolvedValueOnce({
        data: { success: true, data: mockBugs }
      });

      const result = await bugAPI.getAllBugs();
      
      expect(mockedAxios.get).toHaveBeenCalledWith('/bugs', { params: {} });
      expect(result).toEqual({ success: true, data: mockBugs });
    });

    it('should fetch bugs with filters', async () => {
      const filters = { status: 'open', severity: 'high' };
      
      mockedAxios.get.mockResolvedValueOnce({
        data: { success: true, data: [] }
      });

      await bugAPI.getAllBugs(filters);
      
      expect(mockedAxios.get).toHaveBeenCalledWith('/bugs', { params: filters });
    });
  });

  describe('getBug', () => {
    it('should fetch a single bug successfully', async () => {
      const mockBug = { _id: '1', title: 'Bug 1', description: 'Description 1' };
      
      mockedAxios.get.mockResolvedValueOnce({
        data: { success: true, data: mockBug }
      });

      const result = await bugAPI.getBug('1');
      
      expect(mockedAxios.get).toHaveBeenCalledWith('/bugs/1');
      expect(result).toEqual({ success: true, data: mockBug });
    });
  });

  describe('createBug', () => {
    it('should create a new bug successfully', async () => {
      const newBug = {
        title: 'New Bug',
        description: 'New Description',
        reporter: 'John Doe'
      };
      
      const createdBug = { _id: '1', ...newBug };
      
      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true, data: createdBug }
      });

      const result = await bugAPI.createBug(newBug);
      
      expect(mockedAxios.post).toHaveBeenCalledWith('/bugs', newBug);
      expect(result).toEqual({ success: true, data: createdBug });
    });
  });

  describe('updateBug', () => {
    it('should update a bug successfully', async () => {
      const updatedBug = {
        title: 'Updated Bug',
        description: 'Updated Description',
        reporter: 'John Doe'
      };
      
      const resultBug = { _id: '1', ...updatedBug };
      
      mockedAxios.put.mockResolvedValueOnce({
        data: { success: true, data: resultBug }
      });

      const result = await bugAPI.updateBug('1', updatedBug);
      
      expect(mockedAxios.put).toHaveBeenCalledWith('/bugs/1', updatedBug);
      expect(result).toEqual({ success: true, data: resultBug });
    });
  });

  describe('deleteBug', () => {
    it('should delete a bug successfully', async () => {
      mockedAxios.delete.mockResolvedValueOnce({
        data: { success: true, message: 'Bug deleted successfully' }
      });

      const result = await bugAPI.deleteBug('1');
      
      expect(mockedAxios.delete).toHaveBeenCalledWith('/bugs/1');
      expect(result).toEqual({ success: true, message: 'Bug deleted successfully' });
    });
  });
});