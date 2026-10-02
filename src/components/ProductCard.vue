<script setup>
/*
  Importamos onBeforeUnmount además de ref, para poder limpiar
  el temporizador si el componente se destruye antes de tiempo.
*/
import { ref, onBeforeUnmount } from 'vue'
import { formatCurrency } from '../utils/formatCurrency'
import QuantityStepper from './QuantityStepper.vue'

const props = defineProps({
  product: { type: Object, required: true },
})

const emit = defineEmits(['add'])

const quantity = ref(props.product.available ? 1 : 0)

const badgeToneClasses = {
  primary: 'text-primary',
  highlight: 'text-highlight',
  neutral: 'text-on-surface',
}

/*
  Tiempo (en milisegundos) que el botón muestra el estado "Añadido".
  Lo guardamos en una constante con nombre para no dejar un
  "número mágico" suelto en el código.
*/
const FEEDBACK_DURATION_MS = 1500

/*
  Estado reactivo: true mientras se muestra la confirmación.
  Al cambiar, Vue actualiza automáticamente el texto y las clases del botón.
*/
const justAdded = ref(false)

/*
  Referencia al temporizador activo. Es una variable normal (no ref)
  porque no se muestra en pantalla y no necesita reactividad.
*/
let feedbackTimer = null

function handleAdd() {
  emit('add', { id: props.product.id, quantity: quantity.value })

  /*
    Activamos la confirmación visual. Si ya había un temporizador
    en marcha (clics seguidos), lo cancelamos para que el tiempo
    vuelva a contar desde el último clic.
  */
  justAdded.value = true
  clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => {
    justAdded.value = false
  }, FEEDBACK_DURATION_MS)
}

/*
  Hook del ciclo de vida: antes de destruir el componente,
  cancelamos el temporizador pendiente para no dejarlo "vivo".
*/
onBeforeUnmount(() => {
  clearTimeout(feedbackTimer)
})
</script>

<template>
  <article class="flex flex-col overflow-hidden rounded-lg bg-surface-container-lowest shadow-sm">
    <RouterLink :to="`/product/${product.id}`" class="block">
      <div class="relative">
        <img :src="product.image" :alt="product.name" class="h-56 w-full object-cover" />
        <span
          v-if="product.badge"
          class="absolute left-3 top-3 rounded-full bg-surface-container-lowest/90 px-3 py-1 font-ui text-xs font-semibold uppercase tracking-caps"
          :class="badgeToneClasses[product.badge.tone] ?? badgeToneClasses.neutral"
        >
          {{ product.badge.label }}
        </span>
      </div>

      <div class="flex items-start justify-between gap-2 px-5 pt-5">
        <h3 class="font-headline text-xl font-medium text-on-surface">{{ product.name }}</h3>
        <span class="whitespace-nowrap font-headline text-lg font-semibold text-primary">
          {{ formatCurrency(product.price) }}
        </span>
      </div>
    </RouterLink>

    <p class="px-5 pt-2 font-body text-sm text-on-surface-variant">{{ product.description }}</p>

    <div class="mt-4 flex items-center justify-between border-t border-outline-variant/30 px-5 py-4">
      <QuantityStepper v-model="quantity" :disabled="!product.available" />

      <!--
        Clases fijas: forma, tamaño mínimo (para que no cambie de ancho)
        y borde en ambos estados (para que no cambie de alto).
        "transition" suaviza el cambio de colores.
        Clases dinámicas (:class): estado normal (fondo de color)
        o estado "añadido" (estilo invertido).
      -->
      <button
        v-if="product.available"
        type="button"
        class="min-w-28 rounded-lg border border-primary px-5 py-2 text-center font-ui text-sm font-semibold transition hover:opacity-90"
        :class="justAdded
          ? 'bg-surface-container-lowest text-primary'
          : 'bg-primary text-on-primary'"
        @click="handleAdd"
      >
        <!-- aria-live hace que los lectores de pantalla anuncien el cambio de texto -->
        <span aria-live="polite">{{ justAdded ? 'Añadido ✓' : 'Añadir' }}</span>
      </button>
      <span v-else class="font-ui text-sm font-semibold uppercase tracking-caps text-error">
        Agotado
      </span>
    </div>
  </article>
</template>