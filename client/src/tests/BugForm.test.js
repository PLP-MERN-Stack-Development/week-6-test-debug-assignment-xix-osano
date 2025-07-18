import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BugForm from '../BugForm';
import { bugAPI } from '../../services/api';

jest.mock('../../services/api');

describe('BugForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reporter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/severity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const submitButton = screen.getByRole('button', { name: /create bug/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    expect(screen.getByText(/reporter name is required/i)).toBeInTheDocument();
  });

  it('validates title length', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'a'.repeat(101));
    
    const submitButton = screen.getByRole('button', { name: /create bug/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/title cannot exceed 100 characters/i)).toBeInTheDocument();
  });

  it('validates description length', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const descriptionInput = screen.getByLabelText(/description/i);
    await user.type(descriptionInput, 'a'.repeat(501));
    
    const submitButton = screen.getByRole('button', { name: /create bug/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/description cannot exceed 500 characters/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill out the form
    await user.type(screen.getByLabelText(/title/i), 'Login button not working');
    await user.type(screen.getByLabelText(/description/i), 'The login button does nothing when clicked.');
    await user.type(screen.getByLabelText(/reporter/i), 'Enosh');
    await user.type(screen.getByLabelText(/assignee/i), 'Jane');

    // Select options (assuming these are <select> elements)
    await user.selectOptions(screen.getByLabelText(/severity/i), 'High');
    await user.selectOptions(screen.getByLabelText(/status/i), 'Open');

    const submitButton = screen.getByRole('button', { name: /create bug/i });
    await user.click(submitButton);

    // Check that the mock submit handler was called with the correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Login button not working',
        description: 'The login button does nothing when clicked.',
        reporter: 'Enosh',
        assignee: 'Jane',
        severity: 'High',
        status: 'Open'
      });
    });
  });
});
