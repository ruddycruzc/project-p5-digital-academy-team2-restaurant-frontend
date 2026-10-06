<script setup>
import {
  UserCog,
  Truck,
  ClipboardList,
  UtensilsCrossed,
  CheckCircle2,
  Bike,
  Home,
  BookOpenCheck,
} from "lucide-vue-next";

import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { useAuth } from "../../composables/useAuth";
import { getCustomerProfile } from "../../services/profileService";
import { getOrderTracking } from "../../services/orderTrackingService";

const { user, loadUser } = useAuth();
const router = useRouter();

const profile = ref(null);
const pedidoActual = ref(null);
const tracking = ref([]);

const cargandoPerfil = ref(true);
const cargandoTracking = ref(false);
const errorPerfil = ref("");
const errorTracking = ref("");

const trackerSteps = [
  {
    status: "PENDING",
    label: "Recibido",
    icon: ClipboardList,
  },
  {
    status: "IN_KITCHEN",
    label: "Cocina",
    icon: UtensilsCrossed,
  },
  {
    status: "READY",
    label: "Listo",
    icon: CheckCircle2,
  },
  {
    status: "ON_THE_WAY",
    label: "En camino",
    icon: Bike,
  },
  {
    status: "DELIVERED",
    label: "Entregado",
    icon: Home,
  },
];

const currentTrackingStatus = computed(() => {
  if (!tracking.value.length) {
    return null;
  }

  return tracking.value[tracking.value.length - 1]?.status ?? null;
});

const currentStepIndex = computed(() => {
  return trackerSteps.findIndex(
    (step) => step.status === currentTrackingStatus.value,
  );
});

function isStepDone(index) {
  return index <= currentStepIndex.value;
}

function isStepActive(index) {
  return index === currentStepIndex.value;
}

function getStepDate(status) {
  const historyItem = tracking.value.find((item) => item.status === status);

  return historyItem?.changedAt ?? null;
}

function formatStepDate(date) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatOrderDate(date) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatOrderTotal(total) {
  if (total == null) {
    return "—";
  }

  return `${Number(total).toFixed(2)} €`;
}

function getOrderStatusLabel(status) {
  const labels = {
    PENDING: "Recibido",
    IN_KITCHEN: "En cocina",
    READY: "Listo",
    ON_THE_WAY: "En camino",
    DELIVERED: "Entregado",
  };

  return labels[status] ?? status ?? "—";
}

function verSeguimiento() {
  if (!pedidoActual.value?.id) {
    return;
  }

  router.push({
    name: "order-tracking",
    query: {
      orderId: pedidoActual.value.id,
    },
  });
}

async function cargarTracking(orderId) {
  if (!orderId) {
    tracking.value = [];
    return;
  }

  try {
    cargandoTracking.value = true;
    errorTracking.value = "";

    tracking.value = await getOrderTracking(orderId);
  } catch (error) {
    console.error("No se ha podido cargar el seguimiento:", error);

    tracking.value = [];
    errorTracking.value = "No se ha podido cargar el seguimiento del pedido.";
  } finally {
    cargandoTracking.value = false;
  }
}

async function cargarPerfil() {
  try {
    cargandoPerfil.value = true;
    errorPerfil.value = "";

    const currentUser = user.value || (await loadUser());

    if (!currentUser?.id) {
      throw new Error("No se ha podido identificar al usuario.");
    }

    profile.value = await getCustomerProfile(currentUser.id);

    pedidoActual.value = profile.value.recentOrders?.[0] ?? null;

    if (pedidoActual.value?.id) {
      await cargarTracking(pedidoActual.value.id);
    }
  } catch (error) {
    console.error("No se ha podido cargar el perfil:", error);

    errorPerfil.value = "No se ha podido cargar tu perfil.";
  } finally {
    cargandoPerfil.value = false;
  }
}

onMounted(cargarPerfil);
</script>

<template>
  <div class="text-left bg-outline-variant/50 px-4 py-6 sm:px-6 md:px-8">
    <h1 class="font-headline text-2xl sm:text-3xl font-semibold text-primary">
      MI CUENTA
    </h1>

    <!-- Accesos rápidos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
      <article
        class="bg-surface-container-lowest rounded-xl p-4 flex flex-col"
        style="
          background-color: var(--color-surface-container-lowest);
          border-radius: 1rem;
        "
      >
        <div
          class="bg-secondary-container text-secondary rounded-lg w-9 h-9 flex items-center justify-center mb-2"
        >
          <UserCog class="w-5 h-5" />
        </div>

        <h3 class="font-headline text-lg text-on-surface mb-1">
          Editar Perfil
        </h3>

        <p class="font-body text-sm text-outline flex-1">
          Actualiza tu información personal, contraseña y preferencias de
          comunicación.
        </p>

        <RouterLink
          to="/account/profile"
          class="font-ui font-semibold text-sm text-primary mt-2"
        >
          Gestionar →
        </RouterLink>
      </article>

      <!--
  TODO: FUTURA IMPLEMENTACIÓN
  Historial de pedidos pendiente de implementar.
  Se mantiene comentado para incorporarlo en una futura iteración.
-->
      <!--
<article
  class="bg-surface-container-lowest rounded-xl p-4 flex flex-col"
  style="
    background-color: var(--color-surface-container-lowest);
    border-radius: 1rem;
  "
>
  <div
    class="bg-secondary-container text-secondary rounded-lg w-9 h-9 flex items-center justify-center mb-2"
  >
    <History class="w-5 h-5" />
  </div>

  <h3 class="font-headline text-lg text-on-surface mb-1">
    Historial de Pedidos
  </h3>

  <p class="font-body text-sm text-outline flex-1">
    Revisa tus pedidos anteriores, repite tus favoritos y descarga
    facturas.
  </p>

  <RouterLink
    to="/pedidos"
    class="font-ui font-semibold text-sm text-primary mt-2"
  >
    Ver historial →
  </RouterLink>
</article>
-->
<article
  class="bg-surface-container-lowest rounded-xl p-4 flex flex-col"
  style="
    background-color: var(--color-surface-container-lowest);
    border-radius: 1rem;
  "
>
        <div
          class="bg-secondary-container text-secondary rounded-lg w-9 h-9 flex items-center justify-center mb-2"
        >
          <Truck class="w-5 h-5" />
        </div>

        <h3 class="font-headline text-lg text-on-surface mb-1">
          Rastrear Pedido
        </h3>

        <p class="font-body text-sm text-outline flex-1">
          Sigue en tiempo real el estado de tu pedido actual desde nuestra
          cocina hasta tu puerta.
        </p>

        <button
          type="button"
          @click="verSeguimiento"
          :disabled="!pedidoActual"
          class="font-ui font-semibold text-sm text-primary mt-2 text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Rastrear →
        </button>
      </article>
    </div>

    <!-- Pedido actual + Mi perfil -->
    <div class="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 mt-3">
      <div class="bg-surface-container-lowest rounded-xl p-5">
        <div class="flex items-center justify-between">
          <h2 class="font-headline text-xl text-on-surface">Pedido actual</h2>

          <span
            class="bg-surface-container-low font-ui text-sm font-semibold px-3 py-1 rounded-full"
          >
            #{{ pedidoActual?.id ?? "—" }}
          </span>
        </div>

        <hr class="border-outline-variant/40 my-3" />

        <div v-if="cargandoPerfil" class="py-6 text-center">
          <p class="font-body text-sm text-outline">Cargando pedido...</p>
        </div>

        <div v-else-if="!pedidoActual" class="py-6 text-center">
          <p class="font-body text-sm text-outline">
            No tienes pedidos recientes.
          </p>
        </div>

        <template v-else>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
            <div class="flex flex-col gap-1">
              <span class="font-ui text-xs font-semibold text-outline">
                FECHA
              </span>

              <span class="font-body text-sm text-on-surface">
                {{ formatOrderDate(pedidoActual.createdAt) }}
              </span>
            </div>

            <div class="flex flex-col gap-1">
              <span class="font-ui text-xs font-semibold text-outline">
                TOTAL
              </span>

              <span class="font-body text-sm text-on-surface">
                {{ formatOrderTotal(pedidoActual.total) }}
              </span>
            </div>

            <div class="flex flex-col gap-1">
              <span class="font-ui text-xs font-semibold text-outline">
                ESTADO
              </span>

              <span class="font-body text-sm font-semibold text-primary">
                {{ getOrderStatusLabel(pedidoActual.status) }}
              </span>
            </div>
          </div>

          <!-- Timeline -->
          <div v-if="cargandoTracking" class="py-8 text-center">
            <p class="font-body text-sm text-outline">
              Cargando seguimiento...
            </p>
          </div>

          <div v-else-if="tracking.length" class="mt-5">
            <ol class="relative flex justify-between mb-3">
              <!-- Línea del timeline -->
              <div
                class="absolute top-4.5 left-4.5 right-4.5 h-0.5 bg-outline-variant"
              ></div>

              <li
                v-for="(step, index) in trackerSteps"
                :key="step.status"
                class="relative z-10 flex flex-col items-center gap-1 sm:gap-2 flex-1"
              >
                <span
                  class="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  :class="
                    step.done
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface-container-lowest border-2 border-primary text-primary'
                  "
                >
                  <component :is="step.icon" class="w-4 h-4" />
                </span>

                <span
                  class="font-ui text-[10px] sm:text-xs text-center leading-tight"
                  :class="
                    isStepActive(index)
                      ? 'text-primary font-semibold'
                      : 'text-outline'
                  "
                >
                  {{ step.label }}
                </span>

                <span
                  v-if="getStepDate(step.status)"
                  class="font-body text-[9px] sm:text-[10px] text-outline"
                >
                  {{ formatStepDate(getStepDate(step.status)) }}
                </span>
              </li>
            </ol>

            <p v-if="errorTracking" class="font-ui text-xs text-error mt-2">
              {{ errorTracking }}
            </p>
          </div>

          <div v-else class="py-10 text-center">
            <button
              type="button"
              @click="verSeguimiento"
              :disabled="!pedidoActual"
              class="w-full sm:w-auto bg-primary-container text-on-primary-container font-ui font-semibold px-5 py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:bg-highlight-hover active:scale-[0.98]"
            >
              <BookOpenCheck class="w-4 h-4" />
              VER SEGUIMIENTO
            </button>
          </div>
        </template>
      </div>

      <!-- Mi perfil -->
      <div
        class="bg-surface-container-lowest rounded-xl p-5"
        style="
          background-color: var(--color-surface-container-lowest);
          border-radius: 1rem;
        "
      >
        <h2 class="font-headline text-xl text-on-surface">Mi perfil</h2>

        <hr class="border-outline-variant/40 my-3" />

        <div v-if="cargandoPerfil" class="py-6 text-center">
          <p class="font-body text-sm text-outline">Cargando perfil...</p>
        </div>

        <div v-else-if="errorPerfil" class="py-6 text-center">
          <p class="font-ui text-sm text-error">
            {{ errorPerfil }}
          </p>
        </div>

        <template v-else>
          <div class="flex items-center gap-3 mb-3">
            <img
              :src="profile?.avatar || 'https://i.pravatar.cc/150?img=12'"
              :alt="`Foto de perfil de ${profile?.name || ''} ${profile?.surname || ''}`"
              class="w-12 h-12 rounded-full object-cover"
            />

            <div class="flex flex-col">
              <strong class="font-headline text-base text-on-surface">
                {{ profile?.name }} {{ profile?.surname }}
              </strong>

              <span class="font-body text-sm text-outline"> Cliente </span>
            </div>
          </div>

          <div class="border-b border-outline-variant/40 py-2">
            <span class="font-ui text-xs font-semibold text-outline block mb-1">
              EMAIL
            </span>

            <span class="font-body text-sm text-on-surface wrap-break-word">
              {{ user?.email }}
            </span>
          </div>

          <div class="border-b border-outline-variant/40 py-2">
            <span class="font-ui text-xs font-semibold text-outline block mb-1">
              TELÉFONO
            </span>

            <span class="font-body text-sm text-on-surface">
              {{ profile?.phone || "No indicado" }}
            </span>
          </div>

          <div class="py-2">
            <span class="font-ui text-xs font-semibold text-outline block mb-1">
              DIRECCIÓN DE ENTREGA PRINCIPAL
            </span>

            <span class="font-body text-sm text-on-surface">
              {{ profile?.address || "No indicada" }}<br />

              <template v-if="profile?.postalCode || profile?.city">
                {{ profile?.postalCode || "" }}
                <template v-if="profile?.postalCode && profile?.city">
                  ,
                </template>
                {{ profile?.city || "" }}
              </template>
            </span>
          </div>

          <RouterLink
            to="/account/profile"
            class="block text-center mt-4 bg-secondary-container text-secondary rounded-lg py-3 font-ui font-semibold text-xs"
            style="
              background-color: var(--color-secondary-container);
              color: var(--color-secondary);
            "
          >
            EDITAR PERFIL
          </RouterLink>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-on-surface {
  color: var(--color-on-surface) !important;
}
</style>
