<script setup>
import { ref, onMounted } from "vue";
import { Download, Search } from "lucide-vue-next";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  getBillingReport,
  getBillingReportPdf,
  getInvoice,
} from "@/services/billingService";

const periods = ["DIARIO", "MENSUAL", "TRIMESTRAL", "ANUAL"];
const activePeriod = ref("MENSUAL");

const report = ref(null);
const cargando = ref(true);
const error = ref(false);
const pdfLoading = ref(false);

const STATUS_LABELS = {
  PENDING: "Pendiente",
  IN_KITCHEN: "En cocina",
  DELAYED: "Retrasado",
  READY: "Listo",
  ON_THE_WAY: "En reparto",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

function toISODate(date) {
  return date.toISOString().split("T")[0];
}

function getRangeForPeriod(period) {
  const now = new Date();
  let start;
  let end;

  if (period === "DIARIO") {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    end = start;
  } else if (period === "MENSUAL") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  } else if (period === "TRIMESTRAL") {
    const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
    start = new Date(now.getFullYear(), quarterStartMonth, 1);
    end = new Date(now.getFullYear(), quarterStartMonth + 3, 0);
  } else {
    start = new Date(now.getFullYear(), 0, 1);
    end = new Date(now.getFullYear(), 11, 31);
  }

  return { start: toISODate(start), end: toISODate(end) };
}

async function cargarInforme() {
  cargando.value = true;
  error.value = false;
  try {
    const { start, end } = getRangeForPeriod(activePeriod.value);
    report.value = await getBillingReport(start, end);
  } catch (err) {
    console.error("No se pudo cargar el informe:", err);
    error.value = true;
  } finally {
    cargando.value = false;
  }
}

async function descargarPdf() {
  pdfLoading.value = true;
  try {
    const { start, end } = getRangeForPeriod(activePeriod.value);
    const result = await getBillingReportPdf(start, end);
    window.open(result.url, "_blank");
  } catch (err) {
    console.error("No se pudo generar el PDF:", err);
  } finally {
    pdfLoading.value = false;
  }
}

const invoiceOrderId = ref("");
const invoiceResult = ref(null);
const invoiceError = ref(false);
const invoiceLoading = ref(false);

async function buscarFactura() {
  if (!invoiceOrderId.value) return;
  invoiceLoading.value = true;
  invoiceError.value = false;
  invoiceResult.value = null;
  try {
    invoiceResult.value = await getInvoice(invoiceOrderId.value);
  } catch (err) {
    console.error("No se pudo obtener la factura:", err);
    invoiceError.value = true;
  } finally {
    invoiceLoading.value = false;
  }
}

onMounted(cargarInforme);
</script>

<template>
  <div>
    <h1 class="font-headline text-3xl font-semibold text-primary">
      Facturación e Informes
    </h1>
    <p class="font-body text-white text-sm mt-1">
      Informes de ventas por periodo y consulta de facturas por pedido.
    </p>

    <div class="flex flex-wrap gap-2 mt-4">
      <button
        v-for="p in periods"
        :key="p"
        type="button"
        @click="
          activePeriod = p;
          cargarInforme();
        "
        class="font-ui font-semibold text-sm px-4 py-2 rounded-full whitespace-nowrap"
        :class="
          activePeriod === p
            ? 'bg-primary-container text-on-primary-container'
            : 'bg-surface-container-lowest text-on-surface'
        "
      >
        {{ p }}
      </button>
    </div>

    <p v-if="error" class="font-ui text-sm text-error mt-2">
      No se ha podido cargar el informe del backend.
    </p>

    <template v-if="!cargando && report">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div
          class="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20"
        >
          <p class="font-ui text-sm text-outline">Total Pedidos</p>
          <p class="font-headline text-2xl font-semibold text-on-surface mt-1">
            {{ report.totalOrders }}
          </p>
        </div>
        <div
          class="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20"
        >
          <p class="font-ui text-sm text-outline">Ingresos</p>
          <p class="font-headline text-2xl font-semibold text-primary mt-1">
            {{ formatCurrency(report.totalRevenue) }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div class="bg-surface-container-lowest rounded-xl p-4">
          <h2 class="font-headline text-lg text-on-surface mb-3">
            Pedidos por Estado
          </h2>
          <div class="flex flex-col gap-2">
            <div
              v-for="(count, status) in report.ordersByStatus"
              :key="status"
              class="flex items-center justify-between font-ui text-sm"
            >
              <span class="text-outline">{{
                STATUS_LABELS[status] || status
              }}</span>
              <span class="font-semibold text-on-surface">{{ count }}</span>
            </div>
          </div>
        </div>

        <div class="bg-surface-container-lowest rounded-xl p-4">
          <h2 class="font-headline text-lg text-on-surface mb-3">
            Productos Más Vendidos
          </h2>
          <div class="flex flex-col gap-2">
            <div
              v-for="p in report.topProducts"
              :key="p.productId"
              class="flex items-center justify-between font-ui text-sm"
            >
              <span class="text-on-surface">{{ p.productName }}</span>
              <span class="font-semibold text-outline"
                >{{ p.unitsSold }} uds.</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="bg-surface-container-lowest rounded-xl p-4 mt-4">
        <h2 class="font-headline text-lg text-on-surface mb-3">
          Evolución de Ingresos
        </h2>
        <div class="flex gap-2 overflow-x-auto h-40 items-end">
          <div
            v-for="(amount, day) in report.revenueByDay"
            :key="day"
            class="flex flex-col items-center gap-1 shrink-0"
          >
            <div
              class="w-8 bg-primary rounded-t"
              :style="{
                height:
                  (amount /
                    Math.max(1, ...Object.values(report.revenueByDay))) *
                    120 +
                  'px',
              }"
            ></div>
            <span class="font-ui text-xs text-outline whitespace-nowrap">{{
              day.slice(5)
            }}</span>
          </div>
        </div>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <div class="bg-surface-container-lowest rounded-xl p-5">
        <h3 class="font-headline text-lg text-on-surface">
          Descargar informe PDF
        </h3>
        <p class="font-body text-sm text-outline mt-2">
          Genera y descarga el PDF del periodo seleccionado ({{
            activePeriod
          }}).
        </p>
        <button
          type="button"
          @click="descargarPdf"
          :disabled="pdfLoading"
          class="mt-4 w-full bg-primary-container text-white font-ui font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Download class="w-4 h-4" />
          {{ pdfLoading ? "Generando..." : "Descargar PDF" }}
        </button>
      </div>

      <div class="bg-surface-container-lowest rounded-xl p-5">
        <h3 class="font-headline text-lg text-on-surface">
          Consultar factura por pedido
        </h3>
        <div class="flex gap-2 mt-3">
          <input
            v-model="invoiceOrderId"
            type="number"
            placeholder="Nº de pedido"
            class="flex-1 bg-surface-container-low rounded-lg px-3 py-2 font-body"
          />
          <button
            type="button"
            @click="buscarFactura"
            class="bg-primary-container text-white font-ui font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Search class="w-4 h-4" />
          </button>
        </div>
        <p v-if="invoiceError" class="font-ui text-sm text-error mt-2">
          No se ha encontrado la factura de ese pedido.
        </p>
        <div
          v-if="invoiceResult"
          class="mt-3 font-body text-sm text-on-surface"
        >
          <p>
            <strong>{{ invoiceResult.userName }}</strong> · Mesa
            {{ invoiceResult.tableNumber || "—" }}
          </p>
          <ul class="list-disc pl-5 mt-2">
            <li v-for="item in invoiceResult.items" :key="item.productName">
              {{ item.quantity }}x {{ item.productName }}
            </li>
          </ul>
          <p class="font-headline text-lg text-primary mt-2">
            {{ formatCurrency(invoiceResult.total) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
