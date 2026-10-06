import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { useOrder } from "../../composables/useOrder";

describe("useOrder", () => {
  it("empieza con un pedido para restaurante", () => {
    const cartItems = ref([]);
    const { orderType, scheduledOrder } = useOrder(cartItems);

    expect(orderType.value).toBe("restaurant");
    expect(scheduledOrder.value).toBe("");
  });

  it("genera scheduledAt como null cuando no hay pedido programado", () => {
    const cartItems = ref([]);
    const { order } = useOrder(cartItems);

    expect(order.value.scheduledAt).toBeNull();
  });

  it("transforma correctamente los productos del carrito en orderItems", () => {
    const cartItems = ref([
      {
        product: {
          id: 1,
          name: "Fabada Asturiana",
          price: 12,
        },
        quantity: 2,
      },
      {
        product: {
          id: 2,
          name: "Cachopo",
          price: 18,
        },
        quantity: 1,
      },
    ]);

    const { orderItems } = useOrder(cartItems);

    expect(orderItems.value).toEqual([
      {
        productId: 1,
        quantity: 2,
      },
      {
        productId: 2,
        quantity: 1,
      },
    ]);
  });

  it("genera correctamente el objeto order", () => {
    const cartItems = ref([
      {
        product: {
          id: 10,
          name: "Sidra",
          price: 3,
        },
        quantity: 2,
      },
    ]);

    const { order } = useOrder(cartItems);

    expect(order.value).toEqual({
      type: "restaurant",
      scheduledAt: null,
      items: [
        {
          productId: 10,
          quantity: 2,
        },
      ],
    });
  });

  it("actualiza correctamente el tipo de pedido", () => {
    const cartItems = ref([]);
    const { orderType, order, updateOrderType } = useOrder(cartItems);

    updateOrderType("delivery");

    expect(orderType.value).toBe("delivery");
    expect(order.value.type).toBe("delivery");
  });

  it("actualiza correctamente el pedido programado", () => {
    const cartItems = ref([]);
    const {
      scheduledOrder,
      order,
      updateScheduledOrder,
    } = useOrder(cartItems);

    updateScheduledOrder("2026-10-05T20:30");

    expect(scheduledOrder.value).toBe("2026-10-05T20:30");
    expect(order.value.scheduledAt).toBe("2026-10-05T20:30");
  });

  it("vuelve a poner scheduledAt como null cuando se elimina la programación", () => {
    const cartItems = ref([]);
    const {
      order,
      updateScheduledOrder,
    } = useOrder(cartItems);

    updateScheduledOrder("2026-10-05T20:30");
    updateScheduledOrder("");

    expect(order.value.scheduledAt).toBeNull();
  });

  it("actualiza el pedido completo cuando cambian sus datos", () => {
    const cartItems = ref([
      {
        product: {
          id: 5,
          name: "Cabrales",
          price: 8,
        },
        quantity: 3,
      },
    ]);

    const {
      order,
      updateOrderType,
      updateScheduledOrder,
    } = useOrder(cartItems);

    updateOrderType("delivery");
    updateScheduledOrder("2026-10-06T13:00");

    expect(order.value).toEqual({
      type: "delivery",
      scheduledAt: "2026-10-06T13:00",
      items: [
        {
          productId: 5,
          quantity: 3,
        },
      ],
    });
  });
});