import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../services/deliveryService", () => ({
  getReadyOrders: vi.fn(),
  getOrdersOnTheWay: vi.fn(),
  getDeliveredOrders: vi.fn(),
  startDelivery: vi.fn(),
  completeDelivery: vi.fn(),
}));

vi.mock("../../services/profileService", () => ({
  getCustomerProfile: vi.fn(),
}));

import {
  getReadyOrders,
  getOrdersOnTheWay,
  getDeliveredOrders,
  startDelivery,
  completeDelivery,
} from "../../services/deliveryService";

import { getCustomerProfile } from "../../services/profileService";

import {
  currentService,
  availableService,
  allOrders,
  loading,
  error,
  loadDeliveryState,
  acceptOrder,
  deliverOrder,
  rejectOrder,
} from "../../composables/useDeliveryState";

describe("useDeliveryState", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    currentService.value = null;
    availableService.value = null;
    allOrders.value = [];
    loading.value = false;
    error.value = null;
  });

  it("empieza con el estado vacío", () => {
    expect(currentService.value).toBeNull();
    expect(availableService.value).toBeNull();
    expect(allOrders.value).toEqual([]);
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it("carga correctamente un pedido disponible, uno en camino y los entregados", async () => {
    getReadyOrders.mockResolvedValue([
      {
        id: 1,
        total: "25.50",
        userName: "Ana",
        userId: 101,
        status: "READY",
        paid: true,
        createdAt: "2026-10-05T10:00:00",
        items: [],
      },
    ]);

    getOrdersOnTheWay.mockResolvedValue([
      {
        id: 2,
        total: "30",
        userName: "Luis",
        userId: 102,
        status: "ON_THE_WAY",
        paid: true,
        createdAt: "2026-10-05T10:30:00",
        items: [],
      },
    ]);

    getDeliveredOrders.mockResolvedValue([
      {
        id: 3,
        total: "18",
        userName: "Marta",
        userId: 103,
        status: "DELIVERED",
        paid: true,
        createdAt: "2026-10-05T09:00:00",
        items: [],
      },
    ]);

    getCustomerProfile
      .mockResolvedValueOnce({
        address: "Calle Mayor 1",
        postalCode: "33201",
        city: "Gijón",
        phone: "600000001",
      })
      .mockResolvedValueOnce({
        address: "Calle Asturias 2",
        postalCode: "33202",
        city: "Gijón",
        phone: "600000002",
      })
      .mockResolvedValueOnce({
        address: "Calle Covadonga 3",
        postalCode: "33203",
        city: "Gijón",
        phone: "600000003",
      });

    await loadDeliveryState();

    expect(availableService.value).toEqual({
      id: 1,
      price: 25.5,
      customerName: "Ana",
      customerAddress: "Calle Mayor 1",
      customerPostalCode: "33201",
      customerCity: "Gijón",
      customerPhone: "600000001",
      status: "READY",
      paid: true,
      createdAt: "2026-10-05T10:00:00",
      tableNumber: undefined,
      userId: 101,
      items: [],
    });

    expect(currentService.value.id).toBe(2);
    expect(currentService.value.customerName).toBe("Luis");

    expect(allOrders.value).toHaveLength(1);
    expect(allOrders.value[0].id).toBe(3);
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it("deja los estados de servicio en null cuando no hay pedidos activos", async () => {
    getReadyOrders.mockResolvedValue([]);
    getOrdersOnTheWay.mockResolvedValue([]);
    getDeliveredOrders.mockResolvedValue([]);

    await loadDeliveryState();

    expect(availableService.value).toBeNull();
    expect(currentService.value).toBeNull();
    expect(allOrders.value).toEqual([]);
    expect(getCustomerProfile).not.toHaveBeenCalled();
    expect(loading.value).toBe(false);
  });

  it("convierte el total del pedido a número", async () => {
    getReadyOrders.mockResolvedValue([
      {
        id: 10,
        total: "42.75",
        userName: "Cliente",
        userId: 110,
        status: "READY",
        paid: true,
        items: [],
      },
    ]);

    getOrdersOnTheWay.mockResolvedValue([]);
    getDeliveredOrders.mockResolvedValue([]);

    getCustomerProfile.mockResolvedValue({
      address: "Calle Test",
      postalCode: "33200",
      city: "Gijón",
      phone: "600000000",
    });

    await loadDeliveryState();

    expect(availableService.value.price).toBe(42.75);
    expect(typeof availableService.value.price).toBe("number");
  });

  it("usa valores vacíos si el perfil del cliente no tiene dirección", async () => {
    getReadyOrders.mockResolvedValue([
      {
        id: 20,
        total: "15",
        userName: "Cliente",
        userId: 120,
        status: "READY",
        paid: true,
        items: [],
      },
    ]);

    getOrdersOnTheWay.mockResolvedValue([]);
    getDeliveredOrders.mockResolvedValue([]);

    getCustomerProfile.mockResolvedValue({});

    await loadDeliveryState();

    expect(availableService.value.customerAddress).toBe("");
    expect(availableService.value.customerPostalCode).toBe("");
    expect(availableService.value.customerCity).toBe("");
    expect(availableService.value.customerPhone).toBe("");
  });

  it("continúa cargando el pedido aunque falle la obtención del perfil", async () => {
    getReadyOrders.mockResolvedValue([
      {
        id: 30,
        total: "20",
        userName: "Cliente",
        userId: 130,
        status: "READY",
        paid: true,
        items: [],
      },
    ]);

    getOrdersOnTheWay.mockResolvedValue([]);
    getDeliveredOrders.mockResolvedValue([]);

    getCustomerProfile.mockRejectedValue(
      new Error("Perfil no disponible"),
    );

    await loadDeliveryState();

    expect(availableService.value).not.toBeNull();
    expect(availableService.value.id).toBe(30);
    expect(availableService.value.customerAddress).toBe("");
    expect(loading.value).toBe(false);
  });

  it("guarda el error cuando falla la carga de pedidos", async () => {
    const loadError = new Error("Error del servidor");

    getReadyOrders.mockRejectedValue(loadError);
    getOrdersOnTheWay.mockResolvedValue([]);
    getDeliveredOrders.mockResolvedValue([]);

    await loadDeliveryState();

    expect(error.value).toBe(loadError);
    expect(loading.value).toBe(false);
  });

  it("acepta un pedido disponible y lo convierte en servicio actual", async () => {
    availableService.value = {
      id: 40,
      price: 25,
      customerName: "Cliente",
      customerAddress: "Calle Test",
      customerPostalCode: "33201",
      customerCity: "Gijón",
      customerPhone: "600000000",
      status: "READY",
      paid: true,
      createdAt: "2026-10-05T12:00:00",
      userId: 140,
      items: [],
    };

    const updatedOrder = {
      id: 40,
      total: "25",
      userName: "Cliente",
      userId: 140,
      status: "ON_THE_WAY",
      paid: true,
      items: [],
    };

    startDelivery.mockResolvedValue(updatedOrder);

    getCustomerProfile.mockResolvedValue({
      address: "Calle Test",
      postalCode: "33201",
      city: "Gijón",
      phone: "600000000",
    });

    await acceptOrder();

    expect(startDelivery).toHaveBeenCalledWith(40);
    expect(currentService.value).not.toBeNull();
    expect(currentService.value.id).toBe(40);
    expect(currentService.value.status).toBe("ON_THE_WAY");
    expect(availableService.value).toBeNull();
    expect(loading.value).toBe(false);
  });

  it("no hace nada al aceptar si no hay pedido disponible", async () => {
    await acceptOrder();

    expect(startDelivery).not.toHaveBeenCalled();
    expect(currentService.value).toBeNull();
    expect(availableService.value).toBeNull();
  });

  it("guarda el error si falla la aceptación del pedido", async () => {
    availableService.value = {
      id: 50,
    };

    const acceptError = new Error("No se puede aceptar");
    startDelivery.mockRejectedValue(acceptError);

    await acceptOrder();

    expect(startDelivery).toHaveBeenCalledWith(50);
    expect(error.value).toBe(acceptError);
    expect(loading.value).toBe(false);
  });

  it("entrega el pedido actual y lo añade al historial", async () => {
    currentService.value = {
      id: 60,
      price: 30,
      customerName: "Cliente",
      userId: 160,
      status: "ON_THE_WAY",
      items: [],
    };

    const updatedOrder = {
      id: 60,
      total: "30",
      userName: "Cliente",
      userId: 160,
      status: "DELIVERED",
      paid: true,
      createdAt: "2026-10-05T13:00:00",
      items: [],
    };

    completeDelivery.mockResolvedValue(updatedOrder);

    getCustomerProfile.mockResolvedValue({
      address: "Calle Entrega",
      postalCode: "33201",
      city: "Gijón",
      phone: "600000060",
    });

    await deliverOrder();

    expect(completeDelivery).toHaveBeenCalledWith(60);
    expect(currentService.value).toBeNull();
    expect(allOrders.value).toHaveLength(1);
    expect(allOrders.value[0].id).toBe(60);
    expect(allOrders.value[0].status).toBe("DELIVERED");
    expect(loading.value).toBe(false);
  });

  it("rechaza un pedido eliminándolo de los disponibles", () => {
    availableService.value = {
      id: 70,
      customerName: "Cliente",
    };

    rejectOrder();

    expect(availableService.value).toBeNull();
  });
});