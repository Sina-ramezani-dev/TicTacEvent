import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../pages/Login";
import { AuthContext } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

describe("Login Page", () => {
  const mockContext = {
    login: vi.fn(),
    user: null,
  };

  beforeEach(() => {
    // mock global fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "fake-token" }),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("affiche le titre de connexion", () => {
    render(
      <AuthContext.Provider value={mockContext}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByText("Connexion")).toBeInTheDocument();
  });

  it("affiche les champs email et mot de passe", () => {
    render(
      <AuthContext.Provider value={mockContext}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByPlaceholderText(/Identifiant/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mot de passe/i)).toBeInTheDocument();
  });

  it("déclenche login avec les bonnes valeurs", async () => {
    render(
      <AuthContext.Provider value={mockContext}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    // remplissage des champs
    fireEvent.change(screen.getByPlaceholderText(/Identifiant/i), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), {
      target: { value: "test" },
    });

    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

    // attente que le fetch soit terminé
    await new Promise((r) => setTimeout(r, 100));

    // vérifie que fetch a bien été appelé avec les bonnes données
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/auth/login",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@gmail.com",
          password: "test",
        }),
      })
    );
  });
});
