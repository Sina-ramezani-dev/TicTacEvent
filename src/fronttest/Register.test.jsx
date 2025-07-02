import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../pages/Register';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

describe('Register Page', () => {
  const mockRegister = vi.fn();

  beforeEach(() => {
    render(
      <AuthContext.Provider value={{ register: mockRegister }}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  });

  it('affiche le titre inscription', () => {
    expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
  });

  it('remplit le formulaire et envoie', () => {
    fireEvent.change(screen.getByPlaceholderText(/Nom/i), { target: { value: 'TestUser' } });
    fireEvent.change(screen.getByPlaceholderText(/Mail/i), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: 'test1234' } });

    fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));
    expect(mockRegister).toHaveBeenCalled();
  });
});
