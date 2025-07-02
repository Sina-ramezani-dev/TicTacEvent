import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../pages/Register';
import { AuthContext } from "../contexts/AuthContext";

describe('Register Page', () => {
  const mockRegister = vi.fn();

  const renderWithContext = () => {
    render(
      <AuthContext.Provider value={{ register: mockRegister }}>
        <Register />
      </AuthContext.Provider>
    );
  };

  it('affiche le titre inscription', () => {
    renderWithContext();
    expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
  });

  it('remplit le formulaire et envoie', () => {
    renderWithContext();

    fireEvent.change(screen.getByPlaceholderText(/Nom/i), {
      target: { value: 'TestUser' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Mail/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Créer un compte/i }));

    expect(mockRegister).toHaveBeenCalled();
  });
});
