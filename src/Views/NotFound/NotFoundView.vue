<script setup>
/*
  Imagen de Goxín, la mascota del restaurante.
  Se importa desde assets para que Vite la procese al compilar.
*/
import goxin from '@/assets/images/branding/goxiin.png'
</script>

<template>
  <!--
    Página 404: se muestra cuando la dirección no coincide con ninguna ruta.
    min-h-[70vh] deja espacio suficiente para centrar el contenido
    entre la cabecera y el pie de PublicLayout.
  -->
  <section class="flex min-h-[70vh] flex-col items-center justify-center px-5 py-16 text-center md:px-16">
    <!-- Imagen decorativa: alt vacío para que los lectores de pantalla la ignoren -->
    <img :src="goxin" alt="" aria-hidden="true" class="h-40 w-auto md:h-52" />

    <p class="mt-8 font-ui text-label-caps font-semibold uppercase tracking-caps text-highlight">
      Error 404
    </p>

    <h1 class="mt-3 font-headline text-4xl font-medium text-inverse-on-surface md:text-5xl">
      Página no encontrada
    </h1>

    <p class="mx-auto mt-4 max-w-xl font-body text-body-md text-inverse-on-surface/80">
      Goxín ha buscado por toda la casa, pero la página que buscas no existe o ha cambiado de sitio.
    </p>

    <!-- Dos salidas: volver al inicio o ir directamente a la carta -->
    <div class="mt-10 flex flex-wrap justify-center gap-4">
      <RouterLink
        to="/"
        class="rounded-lg border border-primary bg-primary px-6 py-3 font-ui text-sm font-semibold text-on-primary transition hover:opacity-90"
      >
        Volver al inicio
      </RouterLink>
      <RouterLink
        to="/carta"
        class="rounded-lg border border-inverse-on-surface/40 px-6 py-3 font-ui text-sm font-semibold text-inverse-on-surface transition hover:border-highlight hover:text-highlight"
      >
        Ver la carta
      </RouterLink>
    </div>
  </section>
</template>