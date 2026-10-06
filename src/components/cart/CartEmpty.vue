<script setup>
</script>

<template>
  <section
    class="flex min-h-64 flex-col items-center justify-center rounded-3xl bg-[var(--color-surface-container-low)] px-6 py-12 text-center"
  >
    <div
      class="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-secondary-container)]"
    >
      <span
        class="font-ui text-2xl text-[var(--color-on-secondary-container)]"
        aria-hidden="true"
      >
        🛒
      </span>
    </div>

    <h2
      class="mt-5 font-headline text-3xl font-semibold text-[var(--color-on-surface)]"
    >
      Tu carrito está vacío
    </h2>

    <p
      class="mt-2 max-w-md font-body text-sm leading-6 text-[var(--color-on-surface-variant)] sm:text-base"
    >
      Todavía no has añadido ningún plato a tu pedido.
    </p>

    <RouterLink
      to="/carta"
      class="mt-6 rounded-full bg-[var(--color-primary)] px-6 py-3 font-ui text-sm font-semibold text-[var(--color-on-primary)] transition-transform hover:scale-[1.01]"
    >
      Ver carta
      <span aria-hidden="true">→</span>
    </RouterLink>
  </section>
</template>

<style scoped>
</style>