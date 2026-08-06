import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import LoginForm from "@/app/login/LoginForm";

const replace = jest.fn();
const refresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

function fillAndSubmit(email = "admin@example.com", password = "admin1234") {
  fireEvent.change(screen.getByPlaceholderText("admin@example.com"), {
    target: { value: email },
  });
  fireEvent.change(screen.getByPlaceholderText("••••••••"), {
    target: { value: password },
  });
  fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
}

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("renders the email and password fields", () => {
    render(<LoginForm redirectTo="/admin" />);

    expect(screen.getByPlaceholderText("admin@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("redirects to the target page after a successful login", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });

    render(<LoginForm redirectTo="/admin" />);
    fillAndSubmit();

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/admin"));

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("shows the API message when the credentials are rejected", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Correo o contraseña incorrectos" }),
    });

    render(<LoginForm redirectTo="/admin" />);
    fillAndSubmit("admin@example.com", "wrong-password");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Correo o contraseña incorrectos",
    );
    expect(replace).not.toHaveBeenCalled();
  });

  it("reports a connection failure instead of hanging", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("network down"));

    render(<LoginForm redirectTo="/admin" />);
    fillAndSubmit();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /no pudimos conectarnos con el servidor/i,
    );
  });

  it("re-enables the button after a failed attempt", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, json: async () => ({}) });

    render(<LoginForm redirectTo="/admin" />);
    fillAndSubmit();

    await screen.findByRole("alert");
    expect(screen.getByRole("button", { name: /ingresar/i })).toBeEnabled();
  });
});
