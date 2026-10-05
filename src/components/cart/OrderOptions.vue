<script setup>
import { ref } from "vue";

const orderType = ref("restaurant");
const scheduledOrder = ref("");

const emit = defineEmits(["update-order-type", "update-scheduled-order"]);

const selectOrderType = (type) => {
  orderType.value = type;
  emit("update-order-type", type);
};
</script>

<template>
  <div class="space-y-5">
    <div>
      <p class="font-ui text-sm font-semibold text-[var(--color-on-surface)]">
        Tipo de pedido
      </p>

      <div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          class="rounded-full px-4 py-3 font-ui text-sm font-semibold transition-colors"
          :class="
            orderType === 'restaurant'
              ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
              : 'border border-[var(--color-outline-variant)] text-[var(--color-on-surface)]'
          "
          @click="selectOrderType('restaurant')"
        >
          En restaurante
        </button>

        <button
          type="button"
          class="rounded-full px-4 py-3 font-ui text-sm font-semibold transition-colors"
          :class="
            orderType === 'delivery'
              ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
              : 'border border-[var(--color-outline-variant)] text-[var(--color-on-surface)]'
          "
          @click="selectOrderType('delivery')"
        >
          A domicilio
        </button>
      </div>
    </div>

    <div>
      <label
        for="scheduled-order"
        class="font-ui text-sm font-semibold text-[var(--color-on-surface)]"
      >
        Programar el pedido
      </label>

      <input
        id="scheduled-order"
        v-model="scheduledOrder"
        type="text"
        placeholder="Ej: En media hora"
        class="mt-3 w-full rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-4 py-3 font-body text-sm text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)]"
        @input="emit('update-scheduled-order', scheduledOrder)"
      />
    </div>
  </div>
</template>

<style scoped>
</style>