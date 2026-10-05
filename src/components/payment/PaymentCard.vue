<script setup>
import { ref } from "vue";

const cardNumber = ref("");
const cardName = ref("");
const expiryDate = ref("");
const cvv = ref("");

const getPaymentData = () => {
  return {
    cardNumber: cardNumber.value.replace(/\s/g, ""),
    cardName: cardName.value,
    expiryDate: expiryDate.value,
    cvv: cvv.value,
  };
};

defineExpose({
  getPaymentData,
});
</script>

<template>
  <section
    class="mt-6 rounded-3xl bg-[var(--color-surface-container-low)] p-5 sm:p-6"
  >
    <h2
      class="font-headline text-2xl font-semibold text-[var(--color-on-surface)] sm:text-3xl"
    >
      Datos de la tarjeta
    </h2>

    <div class="mt-5 space-y-4">
      <div>
        <label
          for="card-number"
          class="font-ui text-sm font-semibold text-[var(--color-on-surface)]"
        >
          Número de tarjeta
        </label>

        <input
          id="card-number"
          v-model="cardNumber"
          type="text"
          inputmode="numeric"
          autocomplete="cc-number"
          placeholder="1234 5678 9012 3456"
          class="mt-2 w-full rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-4 py-3 font-ui text-sm text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)]"
        />
      </div>

      <div>
        <label
          for="card-name"
          class="font-ui text-sm font-semibold text-[var(--color-on-surface)]"
        >
          Nombre del titular
        </label>

        <input
          id="card-name"
          v-model="cardName"
          type="text"
          autocomplete="cc-name"
          placeholder="Nombre y apellidos"
          class="mt-2 w-full rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-4 py-3 font-ui text-sm text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)]"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label
            for="expiry-date"
            class="font-ui text-sm font-semibold text-[var(--color-on-surface)]"
          >
            Caducidad
          </label>

          <input
            id="expiry-date"
            v-model="expiryDate"
            type="text"
            inputmode="numeric"
            autocomplete="cc-exp"
            placeholder="MM/AA"
            class="mt-2 w-full rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-4 py-3 font-ui text-sm text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)]"
          />
        </div>

        <div>
          <label
            for="cvv"
            class="font-ui text-sm font-semibold text-[var(--color-on-surface)]"
          >
            CVV
          </label>

          <input
            id="cvv"
            v-model="cvv"
            type="password"
            inputmode="numeric"
            autocomplete="cc-csc"
            placeholder="123"
            class="mt-2 w-full rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-4 py-3 font-ui text-sm text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)]"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>