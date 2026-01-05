import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // needed because StarterPage uses <Link>
import StarterPage from './StarterPage';

describe('StarterPage Component', () => {
  
  test('renders the main logo text', () => {
    render(
      <BrowserRouter>
        <StarterPage />
      </BrowserRouter>
    );
    // check if "ca acasă" exists on the screen
    const logoElement = screen.getByText(/ca acasă/i);
    expect(logoElement).toBeInTheDocument();
  });

  test('renders the motto', () => {
    render(
      <BrowserRouter>
        <StarterPage />
      </BrowserRouter>
    );
    // check for the text "Nowhere else like home"
    const mottoElement = screen.getByText(/Nowhere else/i);
    expect(mottoElement).toBeInTheDocument();
  });

  test('renders the "Start Searching" button', () => {
    render(
      <BrowserRouter>
        <StarterPage />
      </BrowserRouter>
    );
    // check for a link/button that says "Start Searching"
    const buttonElement = screen.getByText(/Start Searching/i);
    expect(buttonElement).toBeInTheDocument();
  });
});