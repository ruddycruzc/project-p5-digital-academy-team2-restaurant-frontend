<script setup>
import { Bell, Store, MapPin, Info } from "lucide-vue-next";
import BaseModal from "../BaseModal.vue";
import { formatCurrency } from "../../utils/formatCurrency";

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["accept", "reject", "close"]);
</script>

<template>
  <BaseModal :open="open" @close="emit('close')">
    <div v-if="order" class="max-h-[75vh] overflow-y-auto pr-1">
      <div
        class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center mb-4"
      >
        <Bell class="w-5 h-5 text-primary" aria-hidden="true" />
      </div>

      <span
        class="inline-block bg-primary-container text-on-primary-container font-ui text-xs font-semibold uppercase px-3 py-1 rounded-full mb-2"
      >
        Nuevo Pedido
      </span>

      <h2 class="font-headline text-2xl text-on-surface">
        ¡Nuevo servicio de reparto!
      </h2>
      <p class="font-body text-sm text-outline mt-1">
        Pedido {{ order.id }} • {{ order.type }}
      </p>

      <div class="bg-surface-container rounded-lg p-3 mt-4 relative">
        <span
          class="absolute top-3 right-3 bg-primary-container text-on-primary-container font-ui text-xs font-semibold px-2 py-0.5 rounded-full"
        >
          Punto de recogida
        </span>
        <div class="flex items-start gap-2">
          <Store
            class="w-4 h-4 shrink-0 mt-0.5 text-primary"
            aria-hidden="true"
          />
          <div>
            <p class="font-ui text-xs font-semibold uppercase text-outline">
              Recogida
            </p>
            <p class="font-headline text-base text-on-surface">
              {{ order.establishmentName }}
            </p>
            <p class="font-body text-sm text-on-surface">
              {{ order.pickupAddress }}
            </p>
            <p class="font-body text-xs italic text-outline mt-1">
              {{ order.pickupNote }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-surface-container rounded-lg p-3 mt-4 relative">
        <span
          class="absolute top-3 right-3 bg-secondary-container text-on-secondary-container font-ui text-xs font-semibold px-2 py-0.5 rounded-full"
        >
          Destino cliente
        </span>

        <div class="flex items-start gap-2">
          <MapPin
            class="w-4 h-4 shrink-0 mt-0.5 text-primary"
            aria-hidden="true"
          />

          <div class="min-w-0">
            <p class="font-ui text-xs font-semibold uppercase text-outline">
              Entrega
            </p>

            <p class="font-headline text-base text-on-surface">
              {{ order.customerName || "Cliente no disponible" }}
            </p>

            <p class="font-body text-sm text-on-surface">
              {{ order.customerAddress || "Dirección no disponible" }}
            </p>

            <p
              v-if="order.customerPostalCode || order.customerCity"
              class="font-body text-sm text-outline"
            >
              {{ order.customerPostalCode }}
              {{ order.customerCity }}
            </p>

            <p
              v-if="order.customerPhone"
              class="font-body text-sm text-outline mt-1"
            >
              Teléfono: {{ order.customerPhone }}
            </p>
          </div>
        </div>
      </div>

      <p
        class="font-ui text-xs font-semibold uppercase tracking-caps text-outline mt-4 mb-2"
      >
        Resumen del Servicio
      </p>

      <div
        class="bg-surface-container rounded-lg p-3 grid grid-cols-3 gap-2 text-center"
      >
        <div>
          <p class="font-ui text-xs font-semibold uppercase text-outline">
            Pedido
          </p>

          <p class="font-headline text-base font-bold text-on-surface">
            #{{ order.id }}
          </p>
        </div>

        <div>
          <p class="font-ui text-xs font-semibold uppercase text-outline">
            Importe
          </p>

          <p class="font-headline text-base font-bold text-primary">
            {{ formatCurrency(order.amount) }}
          </p>
        </div>

        <div>
          <p class="font-ui text-xs font-semibold uppercase text-outline">
            Tipo
          </p>

          <p class="font-headline text-base font-bold text-on-surface">
            {{ order.type }}
          </p>
        </div>
      </div>

      <div
        class="flex items-start gap-2 bg-surface-container rounded-lg p-3 mt-3"
      >
        <Info class="w-4 h-4 shrink-0 mt-0.5 text-outline" aria-hidden="true" />
        <p class="font-body text-sm text-outline">
          Dispones de este servicio para realizar la entrega. Acepta o rechaza
          para continuar.
        </p>
      </div>

      <div class="flex gap-3 mt-4">
        <button
          type="button"
          @click="emit('reject')"
          class="flex-1 rounded-lg border border-outline-variant text-on-surface font-ui text-sm font-semibold uppercase py-2.5"
        >
          Rechazar
        </button>
        <button
          type="button"
          @click="emit('accept')"
          class="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary text-surface-container-lowest font-ui text-sm font-semibold uppercase py-2.5"
        >
          Aceptar Pedido
        </button>
      </div>
    </div>
  </BaseModal>
</template>
