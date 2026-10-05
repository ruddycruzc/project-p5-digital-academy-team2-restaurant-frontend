<script setup>
defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  paymentMethod: {
    type: String,
    default: "card",
  },
  amount: {
    type: Number,
    default: 0,
  },
  orderId: {
    type: [Number, String],
    default: null,
  },
  lastFourDigits: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "tracking"]);
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
  >
    <section
      class="w-full max-w-lg rounded-3xl bg-[var(--color-surface)] p-6 shadow-2xl sm:p-8"
      role="dialog"
      aria-modal="true"
    >
      <div class="text-center">
        <!-- Icono de confirmación -->
        <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-container)]"
        >
          <span
            class="text-3xl font-bold text-[var(--color-primary)]"
            aria-hidden="true"
          >
            ✓
          </span>
        </div>

        <h2
          class="mt-5 font-headline text-3xl font-semibold text-[var(--color-on-surface)]"
        >
          ¡Pedido confirmado!
        </h2>

        <p
          class="mt-2 font-body text-sm leading-6 text-[var(--color-on-surface-variant)]"
        >
          Tu pedido ha sido registrado correctamente.
        </p>
      </div>

      <!-- Información del pedido -->
      <div
        class="mt-6 rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-5"
      >
        <div class="flex items-center justify-between gap-4 border-b border-[var(--color-outline-variant)] pb-4">
          <span
            class="font-ui text-xs font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]"
          >
            Número de pedido
          </span>

          <span
            class="font-ui text-sm font-bold text-[var(--color-on-surface)]"
          >
            #{{ orderId }}
          </span>
        </div>

        <div class="flex items-center justify-between gap-4 pt-4">
          <span
            class="font-ui text-sm text-[var(--color-on-surface-variant)]"
          >
            Importe total
          </span>

          <span
            class="font-headline text-2xl font-semibold text-[var(--color-primary)]"
          >
            {{ amount.toFixed(2) }} €
          </span>
        </div>

        <!-- Tarjeta -->
        <div
          v-if="paymentMethod === 'card'"
          class="mt-4 rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-4"
        >
          <p
            class="font-ui text-sm text-[var(--color-on-surface)]"
          >
            Pagado con tarjeta
          </p>

          <p
            class="mt-1 font-ui text-sm text-[var(--color-on-surface-variant)]"
          >
            •••• {{ lastFourDigits }}
          </p>
        </div>

        <!-- Efectivo -->
        <div
          v-else
          class="mt-4 rounded-2xl border border-[var(--color-primary)] bg-[var(--color-primary-container)] p-4"
        >
          <p
            class="font-ui text-sm font-semibold text-[var(--color-on-surface)]"
          >
            Pago en efectivo
          </p>

          <p
            class="mt-1 font-body text-sm leading-5 text-[var(--color-on-surface-variant)]"
          >
            Recuerda que deberás realizar el pago al recibir tu pedido.
          </p>
        </div>
      </div>

      <!-- Acciones -->
      <div class="mt-6 space-y-3">
        <button
          type="button"
          class="w-full rounded-full bg-[var(--color-primary)] px-6 py-3 font-ui text-sm font-semibold text-[var(--color-on-primary)] transition-opacity hover:opacity-90"
          @click="emit('tracking')"
        >
          Ver seguimiento
        </button>

        <button
          type="button"
          class="w-full rounded-full border border-[var(--color-outline-variant)] px-6 py-3 font-ui text-sm font-semibold text-[var(--color-on-surface)]"
          @click="emit('close')"
        >
          Volver
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped></style>