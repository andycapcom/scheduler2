import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock data that matches your component's data structure
const mockCandidates = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Michael Johnson' },
];

const mockEngineerAvailability = {
  1: {
    name: 'Alex Chen',
    slots: ['2025-05-12T09:00:00', '2023-05-12T10:00:00']
  },
  2: {
    name: 'Sarah Williams',
    slots: ['2025-05-12T09:00:00', '2025-05-12T14:00:00']
  }
};

const mockCandidateAvailability = {
  1: ['2025-05-12T09:00:00', '2025-05-12T10:00:00'],
  2: ['2025-05-12T09:00:00', '2025-05-13T15:00:00']
};

// Mock the data imports
jest.mock('./data', () => ({
  candidates: mockCandidates,
  engineerAvailability: mockEngineerAvailability,
  candidateAvailability: mockCandidateAvailability
}));

describe('Interview Scheduler App', () => {
  beforeEach(() => {
    // Mock the current date to June 12, 2023 (Monday)
    jest.useFakeTimers().setSystemTime(new Date('2025-05-12'));
  });
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-05-12')); // May 12, 2023 (Friday)
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders the app header', () => {
    render(<App />);
    expect(screen.getByText('Interview Scheduler')).toBeInTheDocument();
  });

  test('displays candidate dropdown with options', () => {
    render(<App />);
    const dropdown = screen.getByLabelText('Select Candidate:');
    expect(dropdown).toBeInTheDocument();

    // Check default option
    expect(screen.getByText('-- Select a candidate --')).toBeInTheDocument();

    // Check all candidate options are rendered
    mockCandidates.forEach(candidate => {
      expect(screen.getByText(candidate.name)).toBeInTheDocument();
    });
  });
});
