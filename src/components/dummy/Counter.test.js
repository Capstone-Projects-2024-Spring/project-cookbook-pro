import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Counter from './Counter';

describe('Counter Component', () => {
  test('initializes count at 0', () => {
    render(<Counter />);
    const countValue = screen.getByText(/count: 0/i);
    expect(countValue).toBeInTheDocument();
  });

  test('increments count by 1 when the increment button is clicked', async () => {
    render(<Counter />);
    const incrementButton = screen.getByText(/increment/i);
    fireEvent.click(incrementButton);
    
    // Use waitFor to delay the assertion until the expected element is available
    await waitFor(() => {
      const countValue = screen.getByText(/count: 1/i);
      expect(countValue).toBeInTheDocument();
    });
  });
});
