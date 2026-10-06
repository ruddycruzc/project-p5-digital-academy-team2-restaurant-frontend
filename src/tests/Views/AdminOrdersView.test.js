import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import AdminOrdersView from "../../Views/Admin/Orders/AdminOrdersView.vue";

const sampleOrders = [
  {
    id: 1,
    userName: "Cliente 1",
    tableNumber: "4",
    status: "IN_KITCHEN",
    total: 20,
    createdAt: "2026-10-05T10:00:00",
    items: [],
  },
  {
    id: 2,
    userName: "Cliente 2",
    tableNumber: "2",
    status: "PENDING",
    total: 15,
    createdAt: "2026-10-05T10:05:00",
    items: [],
  },
  {
    id: 3,
    userName: "Cliente 3",
    tableNumber: "7",
    status: "ON_THE_WAY",
    total: 30,
    createdAt: "2026-10-05T10:10:00",
    items: [],
  },
  {
    id: 4,
    userName: "Cliente 4",
    tableNumber: "1",
    status: "DELIVERED",
    total: 18,
    createdAt: "2026-10-05T09:00:00",
    items: [],
  },
  {
    id: 5,
    userName: "Cliente 5",
    tableNumber: "3",
    status: "CANCELLED",
    total: 12,
    createdAt: "2026-10-05T09:30:00",
    items: [],
  },
];

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => sampleOrders,
      }),
    ),
  );
});

describe("AdminOrdersView", () => {
  it("cuenta correctamente los pedidos activos", async () => {
    const wrapper = mount(AdminOrdersView);
    await flushPromises();
    expect(wrapper.vm.counts.activos).toBe(3);
  });

  it("filtra solo los pedidos cancelados al seleccionar esa pestaña", async () => {
    const wrapper = mount(AdminOrdersView);
    await flushPromises();
    wrapper.vm.activeTab = "cancelados";
    await wrapper.vm.$nextTick();
    expect(
      wrapper.vm.filteredOrders.every((o) => o.status === "CANCELLED"),
    ).toBe(true);
  });
});
