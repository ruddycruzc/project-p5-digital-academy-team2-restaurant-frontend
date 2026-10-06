import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuth } from "../../composables/useAuth";

vi.mock("../../services/authService", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("../../utils/authStorage", () => ({
  getToken: vi.fn(),
  removeToken: vi.fn(),
}));

import { getCurrentUser } from "../../services/authService";
import { getToken, removeToken } from "../../utils/authStorage";

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const { user, loading } = useAuth();

    user.value = null;
    loading.value = false;
  });

  it("empieza sin usuario autenticado", () => {
    const {
      user,
      loading,
      isAuthenticated,
      roles,
    } = useAuth();

    expect(user.value).toBeNull();
    expect(loading.value).toBe(false);
    expect(isAuthenticated.value).toBe(false);
    expect(roles.value).toEqual([]);
  });

  it("detecta correctamente el rol de CUSTOMER", () => {
    const {
      user,
      isCustomer,
      isAdmin,
      isKitchen,
      isDelivery,
    } = useAuth();

    user.value = {
      id: 1,
      roles: ["CUSTOMER"],
    };

    expect(isCustomer.value).toBe(true);
    expect(isAdmin.value).toBe(false);
    expect(isKitchen.value).toBe(false);
    expect(isDelivery.value).toBe(false);
  });

  it("detecta correctamente el rol de ADMIN", () => {
    const { user, isAdmin } = useAuth();

    user.value = {
      id: 1,
      roles: ["ADMIN"],
    };

    expect(isAdmin.value).toBe(true);
  });

  it("detecta correctamente el rol de KITCHEN", () => {
    const { user, isKitchen } = useAuth();

    user.value = {
      id: 1,
      roles: ["KITCHEN"],
    };

    expect(isKitchen.value).toBe(true);
  });

  it("detecta correctamente el rol de DELIVERY", () => {
    const { user, isDelivery } = useAuth();

    user.value = {
      id: 1,
      roles: ["DELIVERY"],
    };

    expect(isDelivery.value).toBe(true);
  });

  it("detecta varios roles del usuario", () => {
    const {
      user,
      isAuthenticated,
      isAdmin,
      isKitchen,
      roles,
    } = useAuth();

    user.value = {
      id: 1,
      roles: ["ADMIN", "KITCHEN"],
    };

    expect(isAuthenticated.value).toBe(true);
    expect(roles.value).toEqual(["ADMIN", "KITCHEN"]);
    expect(isAdmin.value).toBe(true);
    expect(isKitchen.value).toBe(true);
  });

  it("no carga el usuario si no existe token", async () => {
    getToken.mockReturnValue(null);

    const {
      user,
      loading,
      loadUser,
    } = useAuth();

    const result = await loadUser();

    expect(result).toBeNull();
    expect(user.value).toBeNull();
    expect(loading.value).toBe(false);
    expect(getCurrentUser).not.toHaveBeenCalled();
  });

  it("carga correctamente el usuario autenticado", async () => {
    const currentUser = {
      id: 1,
      name: "Ruddy",
      roles: ["CUSTOMER"],
    };

    getToken.mockReturnValue("fake-token");
    getCurrentUser.mockResolvedValue(currentUser);

    const {
      user,
      loading,
      isAuthenticated,
      loadUser,
    } = useAuth();

    const result = await loadUser();

    expect(result).toEqual(currentUser);
    expect(user.value).toEqual(currentUser);
    expect(isAuthenticated.value).toBe(true);
    expect(loading.value).toBe(false);
    expect(getCurrentUser).toHaveBeenCalledOnce();
  });

  it("deja al usuario como null si falla la carga", async () => {
    const error = new Error("Error de conexión");

    getToken.mockReturnValue("fake-token");
    getCurrentUser.mockRejectedValue(error);

    const {
      user,
      loading,
      loadUser,
    } = useAuth();

    await expect(loadUser()).rejects.toThrow("Error de conexión");

    expect(user.value).toBeNull();
    expect(loading.value).toBe(false);
  });

  it("elimina el token cuando la carga devuelve un error 401", async () => {
    const error = {
      status: 401,
      data: {
        message: "Token expirado",
      },
    };

    getToken.mockReturnValue("expired-token");
    getCurrentUser.mockRejectedValue(error);

    const { loadUser } = useAuth();

    await expect(loadUser()).rejects.toEqual(error);

    expect(removeToken).toHaveBeenCalledOnce();
  });

  it("no elimina el token si el error no es 401", async () => {
    const error = {
      status: 500,
      data: {
        message: "Error interno",
      },
    };

    getToken.mockReturnValue("valid-token");
    getCurrentUser.mockRejectedValue(error);

    const { loadUser } = useAuth();

    await expect(loadUser()).rejects.toEqual(error);

    expect(removeToken).not.toHaveBeenCalled();
  });

  it("hace logout correctamente", () => {
    const {
      user,
      isAuthenticated,
      logout,
    } = useAuth();

    user.value = {
      id: 1,
      roles: ["CUSTOMER"],
    };

    expect(isAuthenticated.value).toBe(true);

    logout();

    expect(removeToken).toHaveBeenCalledOnce();
    expect(user.value).toBeNull();
    expect(isAuthenticated.value).toBe(false);
  });
});