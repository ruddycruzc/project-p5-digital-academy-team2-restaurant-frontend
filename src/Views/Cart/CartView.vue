<script setup>
import { useRouter } from "vue-router";

import CartItem from "../../components/cart/CartItem.vue";
import CartSummary from "../../components/cart/CartSummary.vue";
import CartEmpty from "../../components/cart/CartEmpty.vue";

import { useCart } from "../../composables/useCart";
import { useOrder } from "../../composables/useOrder.js";
import { useAuth } from "../../composables/useAuth";

import { createOrder } from "../../services/orderService";

const router = useRouter();

// Carrito
const {
  cartItems,
  subtotal,
  tax,
  total,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
} = useCart();

// Datos del pedido
const {
  orderItems,
  updateOrderType,
  updateScheduledOrder,
} = useOrder(cartItems);

// Autenticación
const { loadUser } = useAuth();

// Crea el pedido y continúa al pago
const handleContinue = async () => {
  try {
    const currentUser = await loadUser();

    if (!currentUser?.id) {
      router.push({
        name: "login",
        query: {
          redirect: "/cart",
        },
      });

      return;
    }

    const payload = {
      userId: currentUser.id,
      tableNumber: null,
      items: orderItems.value,
    };

    const createdOrder = await createOrder(payload);

    console.log("Pedido creado:", createdOrder);

    await router.push({
      name: "payment",
      query: {
        orderId: createdOrder.id,
      },
    });
  } catch (error) {
    console.error("No se pudo crear el pedido:", error);
  }
};
</script>

<template>
  <main
    class="min-h-screen flex bg-outline-variant/50 px-4 py-10 sm:px-6 lg:px-8"
  >
    <section class="mx-auto w-full max-w-7xl">
      <!-- Cabecera -->
      <header class="mb-8">
        <h1
          class="font-headline text-4xl font-semibold text-[var(--color-on-surface)] sm:text-5xl"
        >
          Tu Pedido
        </h1>

        <p
          class="mt-2 max-w-xl font-body text-sm leading-6 text-[var(--color-on-surface-variant)] sm:text-base"
        >
          Revisa los platos seleccionados antes de confirmar.
        </p>
      </header>

      <!-- Contenido -->
      <div
        class="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_360px] lg:gap-10"
      >
        <!-- Productos -->
        <section class="min-w-0">
          <div v-if="cartItems.length > 0" class="space-y-6">
            <CartItem
              v-for="item in cartItems"
              :key="item.product.id"
              :item="item"
              @increase="increaseQuantity"
              @decrease="decreaseQuantity"
              @remove="removeItem"
            />
          </div>

          <CartEmpty v-else />
        </section>

        <!-- Resumen -->
        <CartSummary
          :subtotal="subtotal"
          :tax="tax"
          :total="total"
          @update-order-type="updateOrderType"
          @update-scheduled-order="updateScheduledOrder"
          @continue="handleContinue"
        />
      </div>
    </section>
  </main>
</template>

<style scoped></style>
