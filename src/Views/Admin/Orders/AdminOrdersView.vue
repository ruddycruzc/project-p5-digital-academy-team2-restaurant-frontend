<script setup>
import { ref, computed, onMounted } from "vue";
import {
  ChefHat,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
} from "lucide-vue-next";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "@/services/orderService";

const tabs = [
  { key: "todos", label: "Todos" },
  { key: "activos", label: "Activos" },
  { key: "entregados", label: "Entregados" },
  { key: "cancelados", label: "Cancelados" },
];
const activeTab = ref("activos");

const orders = ref([]);
const cargando = ref(true);
const error = ref(false);
const expandedId = ref(null);

const STATUS_CONFIG = {
  PENDING: {
    label: "Pendiente",
    bg: "bg-secondary-container",
    text: "text-secondary",
    icon: Clock,
  },
  IN_KITCHEN: {
    label: "En cocina",
    bg: "bg-tertiary-container",
    text: "text-tertiary",
    icon: ChefHat,
  },
  DELAYED: {
    label: "Retrasado",
    bg: "bg-error-container",
    text: "text-error",
    icon: Clock,
  },
  READY: {
    label: "Listo",
    bg: "bg-highlight/20",
    text: "text-highlight",
    icon: CheckCircle2,
  },
  ON_THE_WAY: {
    label: "En reparto",
    bg: "bg-highlight/20",
    text: "text-highlight",
    icon: Truck,
  },
  DELIVERED: {
    label: "Entregado",
    bg: "bg-primary-container",
    text: "text-on-primary-container",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelado",
    bg: "bg-error-container",
    text: "text-error",
    icon: XCircle,
  },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG);
const ACTIVE_STATUSES = [
  "PENDING",
  "IN_KITCHEN",
  "DELAYED",
  "READY",
  "ON_THE_WAY",
];

const counts = computed(() => ({
  todos: orders.value.length,
  activos: orders.value.filter((o) => ACTIVE_STATUSES.includes(o.status))
    .length,
  entregados: orders.value.filter((o) => o.status === "DELIVERED").length,
  cancelados: orders.value.filter((o) => o.status === "CANCELLED").length,
}));

const filteredOrders = computed(() => {
  if (activeTab.value === "todos") return orders.value;
  if (activeTab.value === "activos")
    return orders.value.filter((o) => ACTIVE_STATUSES.includes(o.status));
  if (activeTab.value === "entregados")
    return orders.value.filter((o) => o.status === "DELIVERED");
  return orders.value.filter((o) => o.status === "CANCELLED");
});

function itemsSummary(order) {
  return order.items.map((i) => `${i.quantity}x ${i.productName}`).join(", ");
}

function formatDateTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toggleDetalle(id) {
  expandedId.value = expandedId.value === id ? null : id;
}

async function cargarPedidos() {
  cargando.value = true;
  error.value = false;
  try {
    orders.value = await getAllOrders();
  } catch (err) {
    console.error("No se pudieron cargar los pedidos:", err);
    error.value = true;
  } finally {
    cargando.value = false;
  }
}

async function cambiarEstado(order, nuevoEstado) {
  try {
    await updateOrderStatus(order.id, nuevoEstado);
    await cargarPedidos();
  } catch (err) {
    console.error("No se pudo cambiar el estado:", err);
  }
}

async function eliminarPedido(orderId) {
  if (!confirm("¿Eliminar este pedido? Esta acción no se puede deshacer."))
    return;
  try {
    await deleteOrder(orderId);
    await cargarPedidos();
  } catch (err) {
    console.error("No se pudo eliminar el pedido:", err);
  }
}

onMounted(cargarPedidos);
</script>

<template>
  <div>
    <span
      class="bg-secondary-container text-on-secondary-container font-ui text-xs font-semibold uppercase px-3 py-1 rounded-full"
    >
      Gestión Operativa
    </span>
    <h1 class="font-headline text-3xl font-semibold text-primary mt-3">
      Pedidos
    </h1>
    <p class="font-body text-white text-sm mt-1">
      Supervisión en tiempo real de los pedidos y su estado actual.
    </p>

    <p v-if="error" class="font-ui text-sm text-error mt-2">
      No se han podido cargar los pedidos del backend.
    </p>

    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4"
    >
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          @click="activeTab = tab.key"
          class="font-ui font-semibold text-sm px-4 py-2 rounded-full whitespace-nowrap"
          :class="
            activeTab === tab.key
              ? 'bg-primary-container text-on-primary-container'
              : 'bg-surface-container-lowest text-on-surface'
          "
        >
          {{ tab.label }} ({{ counts[tab.key] }})
        </button>
      </div>
    </div>

    <div
      v-if="!cargando"
      class="bg-surface-container-lowest rounded-xl mt-4 overflow-x-auto"
    >
      <table class="w-full min-w-225">
        <thead>
          <tr
            class="font-ui text-sm font-semibold text-outline text-left border-b border-outline-variant/30"
          >
            <th class="p-4">Nº Pedido</th>
            <th class="p-4">Cliente</th>
            <th class="p-4">Mesa</th>
            <th class="p-4">Artículos</th>
            <th class="p-4 text-right">Total</th>
            <th class="p-4">Hora</th>
            <th class="p-4">Estado</th>
            <th class="p-4"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="o in filteredOrders" :key="o.id">
            <tr class="border-b border-outline-variant/20 last:border-0">
              <td
                class="p-4 font-ui font-semibold text-primary whitespace-nowrap"
              >
                #{{ o.id }}
              </td>
              <td
                class="p-4 font-body text-sm text-on-surface whitespace-nowrap"
              >
                {{ o.userName }}
              </td>
              <td class="p-4 font-body text-sm text-outline whitespace-nowrap">
                {{ o.tableNumber || "—" }}
              </td>
              <td class="p-4 font-body text-sm text-on-surface max-w-xs">
                {{ itemsSummary(o) }}
              </td>
              <td
                class="p-4 text-right font-headline text-xl text-primary whitespace-nowrap"
              >
                {{ formatCurrency(o.total) }}
              </td>
              <td class="p-4 font-body text-sm text-outline whitespace-nowrap">
                {{ formatDateTime(o.createdAt) }}
              </td>
              <td class="p-4">
                <select
                  :value="o.status"
                  @change="cambiarEstado(o, $event.target.value)"
                  class="font-ui text-sm font-semibold px-2 py-1 rounded-lg"
                  :class="[
                    STATUS_CONFIG[o.status].bg,
                    STATUS_CONFIG[o.status].text,
                  ]"
                >
                  <option v-for="s in ALL_STATUSES" :key="s" :value="s">
                    {{ STATUS_CONFIG[s].label }}
                  </option>
                </select>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="toggleDetalle(o.id)"
                    class="flex items-center gap-1 font-ui text-sm font-semibold bg-surface-container-low px-3 py-2 rounded-lg whitespace-nowrap"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    @click="eliminarPedido(o.id)"
                    class="flex items-center gap-1 font-ui text-sm font-semibold bg-error-container text-error px-3 py-2 rounded-lg whitespace-nowrap"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="expandedId === o.id" class="bg-surface-container">
              <td colspan="8" class="p-4">
                <ul class="font-body text-sm text-on-surface list-disc pl-5">
                  <li v-for="item in o.items" :key="item.id">
                    {{ item.quantity }}x {{ item.productName }} —
                    {{ formatCurrency(item.subtotal) }}
                  </li>
                </ul>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <p
        v-if="filteredOrders.length === 0"
        class="p-4 font-ui text-sm text-outline"
      >
        No hay pedidos en esta categoría.
      </p>
    </div>
  </div>
</template>
