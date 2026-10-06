<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import {
  Store,
  MapPin,
  Eye,
  CheckCircle,
  AlertTriangle,
  Bell,
  History,
  Map,
  Handshake,
  CornerUpRight,
} from "lucide-vue-next";
import { formatCurrency } from "../../utils/formatCurrency";
import NewOrderModal from "../../components/delivery/NewOrderModal.vue";
import OrderDetailModal from "../../components/delivery/OrderDetailModal.vue";
import {
  currentService,
  availableService,
  allOrders,
  loading,
  error,
  loadDeliveryState,
  acceptOrder,
  rejectOrder,
  deliverOrder,
} from "../../composables/useDeliveryState";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const activeRoute = ref({
  zone: "Asturias (Gijón)",
  nextTurn: "Ruta de entrega",
  turnDistance: "—",
  eta: "—",
  remainingDistance: "—",
  origin: [43.541, -5.6635],
  destination: [43.5357, -5.6532],
});

const todayHistory = computed(() => {
  const today = new Date().toDateString();

  return allOrders.value
    .filter((order) => {
      if (!order.createdAt) return false;

      return new Date(order.createdAt).toDateString() === today;
    })
    .slice(0, 5);
});

const incomingOrderForModal = computed(() => {
  if (!availableService.value) return null;

  return {
    id: availableService.value.id,
    customerName: availableService.value.customerName,
    customerAddress: availableService.value.customerAddress,
    customerPostalCode: availableService.value.customerPostalCode,
    customerCity: availableService.value.customerCity,
    customerPhone: availableService.value.customerPhone,
    amount: availableService.value.price,
    type: availableService.value.tableNumber
      ? `Mesa ${availableService.value.tableNumber}`
      : "Pedido a domicilio",
    paid: availableService.value.paid,
    items: availableService.value.items,
  };
});

const showNewOrderModal = ref(false);
const showOrderDetailModal = ref(false);

let newOrderTimer = null;

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("es-ES");
}

function formatTime(date) {
  if (!date) return "—";

  return new Date(date).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function handleAccept() {
  acceptOrder();
  showNewOrderModal.value = false;
}

function handleReject() {
  rejectOrder();
  showNewOrderModal.value = false;
}

function handleDeliver() {
  deliverOrder();
}

const mapContainer = ref(null);
let mapInstance = null;

onMounted(async () => {
  await loadDeliveryState();

  if (availableService.value) {
    newOrderTimer = setTimeout(() => {
      showNewOrderModal.value = true;
    }, 1500);
  }

  mapInstance = L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: false,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(mapInstance);

  L.marker(activeRoute.value.origin).addTo(mapInstance);
  L.marker(activeRoute.value.destination).addTo(mapInstance);

  L.polyline([activeRoute.value.origin, activeRoute.value.destination], {
    color: "#246d00",
    weight: 4,
  }).addTo(mapInstance);

  mapInstance.fitBounds(
    [activeRoute.value.origin, activeRoute.value.destination],
    {
      padding: [30, 30],
    },
  );
});

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  if (newOrderTimer) {
    clearTimeout(newOrderTimer);
  }
});
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="font-headline text-6xl text-primary">Panel de Repartidor</h1>
      <p class="font-body text-sm text-outline mt-1">
        Gijón &amp; Oviedo • Turno activo (12:00 - 16:30)
      </p>
    </header>

    <div class="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div class="flex flex-col gap-6">
        <section
          class="bg-surface-container-lowest rounded-xl p-4 flex flex-col gap-4 border-2 border-primary"
        >
          <h2
            class="flex items-center gap-2 font-ui text-xs font-semibold uppercase tracking-caps text-outline"
          >
            <AlertTriangle class="w-4 h-4" aria-hidden="true" />
            Servicio Actual en Curso
          </h2>

          <template v-if="currentService">
            <div class="flex items-start justify-between">
              <div>
                <span
                  class="inline-block bg-primary-container text-on-primary-container font-ui text-xs font-semibold uppercase px-3 py-1 rounded-full mb-2"
                >
                  En Tránsito
                </span>

                <h3 class="font-headline text-lg text-on-surface">
                  Pedido {{ currentService.id }}
                </h3>
              </div>

              <div class="text-right">
                <p class="font-headline text-xl text-tertiary">
                  {{ formatCurrency(currentService.price) }}
                </p>

                <p class="font-body text-xs text-outline">
                  {{ currentService.paid ? "Pagado" : "Pendiente de pago" }}
                </p>
              </div>
            </div>

            <div
              class="bg-surface-container rounded-lg p-3 flex flex-col gap-3"
            >
              <div class="flex items-start gap-2">
                <Store class="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />

                <div>
                  <p
                    class="font-ui text-xs font-semibold uppercase text-outline"
                  >
                    Cliente
                  </p>

                  <p class="font-body text-sm text-on-surface">
                    {{ currentService.customerName || "Cliente no disponible" }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-2">
                <MapPin class="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />

                <div>
                  <p
                    class="font-ui text-xs font-semibold uppercase text-outline"
                  >
                    Pedido
                  </p>

                  <p class="font-body text-sm text-on-surface">
                    {{ currentService.items?.length || 0 }} artículos
                  </p>

                  <p
                    v-if="currentService.tableNumber"
                    class="font-body text-sm text-outline"
                  >
                    Mesa {{ currentService.tableNumber }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                @click="showOrderDetailModal = true"
                class="flex-2 flex items-center justify-center gap-2 rounded-full bg-primary text-surface-container-lowest font-ui text-sm font-semibold uppercase py-2 cursor-pointer transition-all duration-200 hover:bg-highlight-hover active:scale-[0.98]"
              >
                <Eye class="w-4 h-4" aria-hidden="true" />
                Ver Pedido
              </button>

              <button
                type="button"
                @click="handleDeliver"
                :disabled="loading"
                class="flex-1 flex items-center justify-center gap-2 rounded-full bg-primary-container text-on-primary-container font-ui text-sm font-semibold uppercase py-2 cursor-pointer transition-all duration-200 hover:bg-highlight-hover active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle class="w-4 h-4" aria-hidden="true" />

                {{ loading ? "Actualizando..." : "Entregar" }}
              </button>
            </div>
          </template>

        </section>

        <section
          class="bg-surface-container-highest rounded-xl p-4 flex flex-col gap-3 border border-primary/50"
        >
          <h2
            class="flex items-center gap-2 font-ui text-xs font-semibold uppercase tracking-caps text-outline"
          >
            <Bell class="w-4 h-4" aria-hidden="true" />
            Servicios Disponibles
          </h2>

          <template v-if="availableService">
            <div class="flex items-start justify-between">
              <span
                class="inline-block bg-primary-container text-on-primary-container font-ui text-xs font-semibold uppercase px-3 py-1 rounded-full"
              >
                Nuevo Servicio
              </span>

              <p class="font-headline text-lg text-tertiary">
                {{ formatCurrency(availableService.price) }}
              </p>
            </div>

            <p class="font-headline text-lg text-on-surface">
              Pedido {{ availableService.id }}
            </p>

            <div class="flex flex-col gap-2 font-body text-sm text-on-surface">
              <div class="flex items-center gap-2">
                <Store class="w-4 h-4 shrink-0" aria-hidden="true" />

                <span>
                  {{ availableService.customerName || "Cliente no disponible" }}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <MapPin class="w-4 h-4 shrink-0" aria-hidden="true" />

                <span>
                  {{ availableService.items?.length || 0 }} artículos
                </span>
              </div>

              <p v-if="availableService.tableNumber" class="text-outline">
                Mesa {{ availableService.tableNumber }}
              </p>
            </div>

            <p class="font-body text-xs text-outline">
              {{ availableService.paid ? "Pedido pagado" : "Pago pendiente" }}
            </p>

            <button
              type="button"
              @click="showNewOrderModal = true"
              :disabled="loading"
              class="mt-1 flex items-center justify-center gap-2 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface font-ui text-sm font-semibold uppercase py-2.5 cursor-pointer transition-all duration-200 hover:bg-surface-container-high active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Handshake class="w-4 h-4 text-primary" aria-hidden="true" />

              Gestionar / Aceptar
            </button>
          </template>
          <p v-else class="font-body text-sm text-outline">
            No hay servicios disponibles ahora mismo.
          </p>
        </section>

        <section class="flex flex-col gap-3">
          <h2
            class="flex items-center gap-2 font-ui text-xs font-semibold uppercase tracking-caps text-outline"
          >
            <History class="w-4 h-4" aria-hidden="true" />
            Historial Reciente (Hoy)
          </h2>

          <div
            v-for="order in todayHistory"
            :key="order.id"
            class="bg-surface-container-lowest rounded-xl p-3 border border-primary/50 shadow-sm flex items-center justify-between"
          >
            <div>
              <div class="flex items-center gap-2">
                <p class="font-headline text-base text-on-surface">
                  Pedido {{ order.id }}
                </p>

                <span
                  class="bg-secondary-container text-on-secondary-container font-ui text-xs font-semibold px-2 py-0.5 rounded-full"
                >
                  Entregado
                </span>
              </div>

              <p class="font-body text-sm text-outline">
                {{ order.customerName || "Cliente" }}
                · Entregado a las {{ formatTime(order.createdAt) }}
              </p>
            </div>

            <div class="text-right">
              <p class="font-headline text-base text-tertiary">
                {{ formatCurrency(order.price) }}
              </p>

              <p class="font-body text-xs text-outline">
                {{ formatDate(order.createdAt) }}
              </p>
            </div>
          </div>
          <div
            v-if="loading"
            class="mb-6 rounded-xl border border-primary/30 bg-surface-container-lowest p-4"
          >
            <p class="font-body text-sm text-outline">Cargando servicios...</p>
          </div>

          <div
            v-if="error"
            class="mb-6 rounded-xl border border-error/40 bg-surface-container-lowest p-4"
          >
            <p class="font-ui text-sm font-semibold text-error">
              No se han podido cargar los servicios.
            </p>
          </div>
        </section>
      </div>

      <aside
        class="bg-surface-container-lowest rounded-xl p-4 border border-primary/50 shadow-sm flex flex-col gap-3 self-start"
      >
        <div class="flex items-center justify-between">
          <h2
            class="flex items-center gap-2 font-ui text-xs font-semibold uppercase tracking-caps text-outline"
          >
            <Map class="w-4 h-4" aria-hidden="true" />
            Ruta Activa • {{ activeRoute.zone }}
          </h2>
          <span
            class="flex items-center gap-1 font-ui text-xs font-semibold text-primary"
          >
            <span class="w-2 h-2 rounded-full bg-primary"></span>
            GPS Activo
          </span>
        </div>

        <div
          class="bg-surface-container rounded-lg p-3 flex items-center gap-2"
        >
          <CornerUpRight
            class="w-4 h-4 text-primary shrink-0"
            aria-hidden="true"
          />
          <p class="font-body text-sm text-on-surface flex-1">
            {{ activeRoute.nextTurn }}
          </p>
          <span class="font-ui text-xs font-semibold text-outline">{{
            activeRoute.turnDistance
          }}</span>
        </div>

        <div ref="mapContainer" class="rounded-lg h-64 z-0"></div>

        <div
          class="bg-surface-container rounded-lg p-3 flex items-center justify-between"
        >
          <div>
            <p class="font-ui text-xs font-semibold uppercase text-outline">
              Tiempo Estimado
            </p>
            <p class="font-headline text-lg text-primary">
              {{ activeRoute.eta }}
            </p>
          </div>
          <div class="text-right">
            <p class="font-ui text-xs font-semibold uppercase text-outline">
              Distancia Restante
            </p>
            <p class="font-headline text-lg text-on-surface">
              {{ activeRoute.remainingDistance }}
            </p>
          </div>
        </div>
      </aside>
    </div>

    <NewOrderModal
      :open="showNewOrderModal"
      :order="incomingOrderForModal"
      @accept="handleAccept"
      @reject="handleReject"
      @close="showNewOrderModal = false"
    />
    <OrderDetailModal
      :open="showOrderDetailModal"
      :order="currentService"
      @close="showOrderDetailModal = false"
    />
  </div>
</template>
