<script setup>
import { ref, computed, onMounted } from "vue";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  TrendingUp,
  Wallet,
  BarChart3,
  LineChart,
  Clock,
  ChefHat,
  CheckCircle2,
  XCircle,
} from "lucide-vue-next";
import { getAdminDashboardSummary } from "@/services/adminDashboardService";
import { getBillingReport } from "@/services/billingService";

const summary = ref(null);
const weeklySales = ref([]);
const cargando = ref(true);
const error = ref(false);

const stats = computed(() => {
  if (!summary.value) return [];
  return [
    {
      label: "Ventas Hoy",
      value: summary.value.todayRevenue,
      icon: Wallet,
      isCurrency: true,
    },
    {
      label: "Ventas Totales",
      value: summary.value.totalRevenue,
      icon: TrendingUp,
      isCurrency: true,
    },
    {
      label: "Pedidos Hoy",
      value: summary.value.todayOrders,
      icon: BarChart3,
      isCurrency: false,
    },
    {
      label: "Pedidos Totales",
      value: summary.value.totalOrders,
      icon: LineChart,
      isCurrency: false,
    },
  ];
});

const STATUS_CONFIG = {
  PENDING: {
    label: "Pendientes",
    sub: "Requieren atención",
    icon: Clock,
    bg: "bg-error-container",
    text: "text-error",
  },
  IN_KITCHEN: {
    label: "En Cocina",
    sub: "Preparando",
    icon: ChefHat,
    bg: "bg-tertiary-container",
    text: "text-tertiary",
  },
  ON_THE_WAY: {
    label: "En Reparto",
    sub: "De camino",
    icon: ChefHat,
    bg: "bg-tertiary-container",
    text: "text-tertiary",
  },
  DELIVERED: {
    label: "Entregados",
    sub: "Hoy",
    icon: CheckCircle2,
    bg: "bg-secondary-container",
    text: "text-secondary",
  },
  CANCELLED: {
    label: "Cancelados",
    sub: "Hoy",
    icon: XCircle,
    bg: "bg-error-container",
    text: "text-error",
  },
};

const orderStatus = computed(() => {
  if (!summary.value) return [];
  return Object.entries(STATUS_CONFIG)
    .filter(([key]) => summary.value.ordersByStatus?.[key] !== undefined)
    .map(([key, cfg]) => ({
      ...cfg,
      count: summary.value.ordersByStatus[key],
    }));
});

const starProducts = computed(() => summary.value?.topProducts ?? []);

const maxSale = computed(() =>
  Math.max(1, ...weeklySales.value.map((d) => d.value)),
);

const barColors = [
  "bg-primary",
  "bg-secondary",
  "bg-tertiary-container",
  "bg-outline-variant",
  "bg-secondary-container",
  "bg-primary-container",
  "bg-outline",
];

function barColor(index) {
  return barColors[index % barColors.length];
}

function toISODate(date) {
  return date.toISOString().split("T")[0];
}

function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { monday, start: toISODate(monday), end: toISODate(sunday) };
}

async function cargarGrafica() {
  const { monday, start, end } = getWeekRange();
  const report = await getBillingReport(start, end);
  const dayLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  weeklySales.value = dayLabels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = toISODate(d);
    return { day: label, value: Number(report.revenueByDay?.[key] ?? 0) };
  });
}

async function cargarDashboard() {
  cargando.value = true;
  error.value = false;
  try {
    summary.value = await getAdminDashboardSummary();
    await cargarGrafica();
  } catch (err) {
    console.error("No se pudo cargar el dashboard:", err);
    error.value = true;
  } finally {
    cargando.value = false;
  }
}

onMounted(cargarDashboard);
</script>

<template>
  <div class="h-full flex flex-col">
    <h1 class="font-headline text-3xl font-semibold text-primary">
      Resumen del Negocio
    </h1>
    <p class="font-body text-white text-sm mt-1">
      Visión general del rendimiento de Goxu hoy.
    </p>

    <p v-if="error" class="font-ui text-sm text-error mt-2">
      No se han podido cargar los datos del backend.
    </p>

    <div
      v-if="!cargando"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4"
    >
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-surface-container-lowest rounded-xl p-4 flex flex-col border border-outline-variant/20 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <p class="font-ui text-sm text-outline">
            {{ stat.label }}
          </p>

          <component :is="stat.icon" class="w-5 h-5 text-highlight shrink-0" />
        </div>

        <p class="font-headline text-2xl font-semibold text-on-surface mt-2">
          {{ stat.isCurrency ? formatCurrency(stat.value) : stat.value }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
      <div
        class="bg-surface-container-lowest rounded-xl p-4 sm:p-5 lg:col-span-3 border border-outline-variant/20 shadow-sm"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-headline text-lg text-on-surface">
            Tendencia de Ventas (Semana)
          </h2>
          <span
            class="font-ui text-xs border border-highlight/40 px-3 py-1 rounded-md text-highlight"
            >Esta Semana</span
          >
        </div>
        <div class="flex gap-3 mt-4 overflow-x-auto">
          <div class="flex-1 flex items-end gap-3 h-40 min-w-100">
            <div
              v-for="(d, index) in weeklySales"
              :key="d.day"
              class="flex-1 flex flex-col items-center gap-2 h-full justify-end"
            >
              <div
                class="w-full max-w-10 rounded-t"
                :class="barColor(index)"
                :style="{ height: (d.value / maxSale) * 100 + '%' }"
              ></div>

              <span class="font-ui text-xs text-outline">
                {{ d.day }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20 shadow-sm"
      >
        <h2 class="font-headline text-lg text-on-surface mb-3">
          Estado de Pedidos
        </h2>
        <div class="flex flex-col gap-2">
          <div
            v-for="status in orderStatus"
            :key="status.label"
            class="flex items-center justify-between rounded-lg p-3"
            :class="status.bg"
          >
            <div class="flex items-center gap-2">
              <component
                :is="status.icon"
                class="w-4 h-4"
                :class="status.text"
              />
              <div>
                <p class="font-ui text-sm font-semibold text-on-surface">
                  {{ status.label }}
                </p>
                <p class="font-ui text-xs text-outline">{{ status.sub }}</p>
              </div>
            </div>
            <span
              class="font-headline text-xl font-semibold"
              :class="status.text"
              >{{ status.count }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-surface-container-lowest rounded-xl p-4 mt-4 flex-1 border border-highlight/20 shadow-sm"
    >
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-headline text-lg text-on-surface">
          Productos Estrella
        </h2>
        <RouterLink
          :to="{ name: 'admin-products' }"
          class="font-ui text-sm font-semibold text-primary"
          >Ver menú completo</RouterLink
        >
      </div>
      <table class="w-full min-w-125">
        <thead>
          <tr
            class="font-ui text-xs text-outline text-left border-b border-outline-variant/30"
          >
            <th class="pb-2">Producto</th>
            <th class="pb-2 text-right">Unidades vendidas</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in starProducts"
            :key="p.productId"
            class="border-b border-outline-variant/20 last:border-0"
          >
            <td class="py-2 font-ui font-semibold text-on-surface">
              {{ p.productName }}
            </td>
            <td class="text-right font-ui">{{ p.unitsSold }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
