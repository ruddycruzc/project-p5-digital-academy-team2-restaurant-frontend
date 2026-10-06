<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import goxiin from "../../assets/images/branding/goxiin.png";

import {
  Clock,
  Store,
  Bike,
  ShoppingBag,
  CheckSquare,
  Square,
  LogOut,
} from "lucide-vue-next";

import {
  getKitchenOrdersByStatus,
  updateKitchenOrderStatus,
} from "../../services/kitchenService";

import { useAuth } from "../../composables/useAuth";

const router = useRouter();
const { logout } = useAuth();

function handleLogout() {
  logout();
  router.push({ name: "login" });
}

const columns = [
  {
    key: "nuevos",
    label: "Nuevos",
    backendStatus: "PENDING",
  },
  {
    key: "en-curso",
    label: "En Curso",
    backendStatus: "IN_KITCHEN",
  },
  {
    key: "listos",
    label: "Listos",
    backendStatus: "READY",
  },
];

const orders = ref([]);
const loading = ref(false);
const error = ref(false);

const ordersByColumn = computed(() => {
  return columns.reduce((acc, col) => {
    acc[col.key] = orders.value.filter((order) => order.status === col.key);

    return acc;
  }, {});
});

function adaptOrder(order, status) {
  return {
    id: `#${String(order.id).padStart(3, "0")}`,
    backendId: order.id,
    type:
      order.tableNumber === "0"
        ? "recogida"
        : order.tableNumber
          ? "mesa"
          : "domicilio",

    locationLabel:
      order.tableNumber === "0"
        ? "Recogida en local"
        : order.tableNumber
          ? `Local - Mesa ${order.tableNumber}`
          : "Domicilio",
    elapsedMin: Math.floor(
      (Date.now() - new Date(order.createdAt).getTime()) / 60000,
    ),
    items: order.items.map((item) => `${item.quantity}x ${item.productName}`),
    status,
  };
}

async function loadOrders() {
  loading.value = true;
  error.value = false;

  try {
    const responses = await Promise.all(
      columns.map(async (column) => {
        const data = await getKitchenOrdersByStatus(column.backendStatus);

        return data.map((order) => adaptOrder(order, column.key));
      }),
    );

    orders.value = responses.flat();
  } catch (err) {
    console.error("No se pudieron cargar los pedidos de cocina:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(loadOrders);

function getVisualStatus(backendStatus) {
  const statusMap = {
    PENDING: "nuevos",
    IN_KITCHEN: "en-curso",
    READY: "listos",

    // Actualmente el backend no responde correctamente con el estado
    // "DELAYED". Próximamente se implementará correctamente.
    // DELAYED: "con-retraso",
  };

  return statusMap[backendStatus];
}

async function advanceStatus(order, nextStatus) {
  try {
    await updateKitchenOrderStatus(order.backendId, nextStatus);

    order.status = getVisualStatus(nextStatus);
  } catch (error) {
    console.error("No se pudo actualizar el estado del pedido:", error);
  }
}
</script>

<template>
  <div class="min-h-screen bg-outline-variant/50">
    <header
      class="relative bg-on-surface text-surface-container-lowest px-4 md:px-6 py-4 flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <img :src="goxiin" alt="Goxín" class="w-10 h-10 object-contain" />

        <span class="font-headline text-2xl md:text-5xl"> Goxu </span>

        <span
          class="bg-primary text-on-primary font-ui text-xs font-semibold uppercase px-3 py-1 rounded-full absolute left-1/2 -translate-x-1/2"
        >
          Dashboard de Cocina
        </span>
      </div>
      <button
        @click="handleLogout"
        class="group mt-4 flex items-center gap-2 font-ui text-sm font-semibold text-highlight transition-colors duration-200 hover:text-highlight/80 cursor-pointer"
      >
        <LogOut
          class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
        Log out
      </button>
    </header>

    <main class="px-4 py-6 md:px-6 md:py-8">
      <h1 class="sr-only">Dashboard de Cocina</h1>

      <div
        class="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0"
      >
        <section
          v-for="col in columns"
          :key="col.key"
          :aria-labelledby="`col-title-${col.key}`"
          class="shrink-0 w-[85vw] max-w-sm snap-start md:w-auto md:max-w-none bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm"
        >
          <div class="flex items-center justify-between mb-4">
            <h2
              :id="`col-title-${col.key}`"
              class="font-ui text-xs font-semibold uppercase tracking-caps text-outline"
            >
              {{ col.label }}
            </h2>

            <span
              class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-on-primary font-ui text-xs font-semibold"
              :aria-label="`${ordersByColumn[col.key].length} pedidos`"
            >
              {{ ordersByColumn[col.key].length }}
            </span>
          </div>

          <div class="flex flex-col gap-3">
            <div
              v-for="order in ordersByColumn[col.key]"
              :key="order.id"
              class="bg-surface-container rounded-xl p-4 flex flex-col gap-3 border border-outline-variant/30 shadow-sm"
            >
              <div class="flex items-center justify-between">
                <h3
                  class="font-headline text-lg text-on-surface"
                  :class="col.key === 'listos' ? 'line-through' : ''"
                >
                  {{ order.id }}
                </h3>

                <span
                  class="flex items-center gap-1 font-ui text-xs font-semibold px-2 py-1 rounded-full"
                  :class="
                    order.type === 'mesa'
                      ? 'bg-secondary-container text-secondary'
                      : 'bg-tertiary-container text-tertiary'
                  "
                >
                  <component
                    :is="
                      order.type === 'mesa'
                        ? Store
                        : order.type === 'recogida'
                          ? ShoppingBag
                          : Bike
                    "
                    class="w-3.5 h-3.5"
                    aria-hidden="true"
                  />

                  {{ order.locationLabel }}
                </span>
              </div>

              <template v-if="col.key === 'listos'">
                <div class="flex items-center gap-2">
                  <span
                    class="flex items-center justify-center w-5 h-5 rounded-full bg-outline-variant text-on-surface"
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <p class="font-body text-sm font-semibold text-on-surface">
                    Pedido preparado
                  </p>
                </div>

                <p class="font-body text-xs text-outline">
                  Listo para la entrega
                </p>
              </template>

              <template v-else>
                <span
                  class="flex items-center gap-1 font-ui text-xs text-outline"
                >
                  <Clock class="w-3.5 h-3.5" aria-hidden="true" />

                  {{ order.elapsedMin }} min
                </span>

                <ul v-if="order.items" class="flex flex-col gap-1">
                  <li
                    v-for="item in order.items"
                    :key="item"
                    class="font-body text-sm text-on-surface"
                  >
                    {{ item }}
                  </li>
                </ul>

                <ul v-if="order.checklist" class="flex flex-col gap-1">
                  <li
                    v-for="item in order.checklist"
                    :key="item.name"
                    class="flex items-center gap-2 font-body text-sm"
                    :class="
                      item.done
                        ? 'text-outline line-through'
                        : 'text-on-surface'
                    "
                  >
                    <component
                      :is="item.done ? CheckSquare : Square"
                      class="w-4 h-4 shrink-0"
                      aria-hidden="true"
                    />

                    <span class="sr-only">
                      {{ item.done ? "Completado" : "Pendiente" }}:
                    </span>

                    {{ item.name }}
                  </li>
                </ul>

                <button
                  v-if="col.key === 'nuevos'"
                  type="button"
                  @click="advanceStatus(order, 'IN_KITCHEN')"
                  class="w-full rounded-lg bg-primary text-on-primary font-ui text-sm font-semibold uppercase py-2.5 transition-all duration-200 hover:bg-highlight-hover active:scale-[0.98] cursor-pointer"
                >
                  Empezar
                </button>

                <button
                  v-if="col.key === 'en-curso'"
                  type="button"
                  @click="advanceStatus(order, 'READY')"
                  class="w-full rounded-lg bg-primary text-on-primary font-ui text-sm font-semibold uppercase py-2.5 transition-all duration-200 hover:bg-highlight-hover active:scale-[0.98] cursor-pointer"
                >
                  Listo
                </button>

                <!--
                  Actualmente el backend no responde correctamente con el estado
                  "DELAYED". Próximamente se implementará correctamente.

                  Botón para marcar retraso:
                  <button
                    type="button"
                    @click="advanceStatus(order, 'DELAYED')"
                  >
                    Marcar Retraso
                  </button>

                  Botón para marcar como listo un pedido retrasado:
                  <button
                    type="button"
                    @click="advanceStatus(order, 'READY')"
                  >
                    Marcar Listo Urgente
                  </button>
                -->
              </template>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
