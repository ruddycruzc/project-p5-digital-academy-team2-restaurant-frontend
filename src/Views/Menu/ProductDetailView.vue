<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'

/*
  route: para leer el id del producto de la URL (/product/:id).
  router: para llevar al usuario al carrito después de añadir.
*/
const route = useRoute()
const router = useRouter()
const { addItem } = useCart()

/*
  Producto real que llega del back.
  Empieza en null porque, al abrir la página, todavía no tenemos los datos.
*/
const product = ref(null)
const cargando = ref(true)
const errorCarga = ref(false)
const quantity = ref(1)

/*
  Pide el producto al back con el id de la URL: GET /api/products/{id}.
  fetch no lanza error si el servidor responde 404, por eso se comprueba response.ok a mano.
  El precio llega como texto/decimal desde el back, así que se convierte a número
  para poder calcular el total y formatearlo.
*/
async function cargarProducto() {
  cargando.value = true
  errorCarga.value = false
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${route.params.id}`)
    if (!response.ok) throw new Error('Producto no encontrado')
    const data = await response.json()
    product.value = { ...data, price: Number(data.price) }
  } catch (err) {
    console.warn('No se pudo cargar el producto:', err)
    errorCarga.value = true
  } finally {
    /* Se ejecuta siempre, haya ido bien o mal */
    cargando.value = false
  }
}

onMounted(cargarProducto)

/* Precio y total con formato español (24,50) */
const formattedPrice = computed(() =>
  product.value.price.toLocaleString('es-ES', { minimumFractionDigits: 2 })
)
const total = computed(() =>
  (product.value.price * quantity.value).toLocaleString('es-ES', { minimumFractionDigits: 2 })
)

function increaseQuantity() {
  quantity.value++
}
function decreaseQuantity() {
  if (quantity.value > 1) quantity.value--
}

/*
  addItem suma de uno en uno, así que se llama tantas veces como indique la cantidad
  (igual que en CartaView). Después se lleva al usuario al carrito como confirmación.
*/
function addToOrder() {
  for (let i = 0; i < quantity.value; i++) {
    addItem(product.value)
  }
  router.push('/cart')
}
</script>

<template>
  <div class="page text-left">
    <!-- Mientras llega la respuesta del back -->
    <p v-if="cargando" class="p-16 text-center font-body text-body-md text-white">
      Cargando el plato…
    </p>

    <!-- Si el producto no existe o el back no responde -->
    <div v-else-if="errorCarga" class="p-16 text-center">
      <p class="font-body text-body-md text-white">No hemos encontrado este plato.</p>
      <RouterLink
        to="/carta"
        class="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-ui text-sm font-semibold text-on-primary"
      >
        Volver a la carta
      </RouterLink>
    </div>

    <!-- Producto cargado correctamente -->
    <div
      v-else
      class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[662px_466px] gap-8 md:gap-6 p-6 md:p-16 items-start"
    >
      <!-- Columna izquierda: imagen, nombre, precio y descripción -->
      <div class="flex flex-col gap-8">
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full aspect-[662/361.64] object-cover rounded-lg"
        />

        <div>
          <h1 class="text-white! font-headline text-[32px] leading-10 md:text-[48px] md:leading-14 font-semibold">
            {{ product.name }}
          </h1>
          <p class="font-headline text-headline-md font-medium text-highlight mt-2">
            {{ formattedPrice }} €
          </p>
        </div>

        <p class="font-body text-[16px] leading-6.5 font-normal text-white">
          {{ product.description }}
        </p>
      </div>

      <!-- Columna derecha: cantidad, resumen y botón -->
      <div class="bg-surface-container-low border border-outline-variant/20 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6 md:p-8">
        <div class="flex items-center justify-between">
          <span class="font-ui text-label-caps tracking-caps uppercase font-semibold text-on-surface">
            Cantidad
          </span>
          <div class="flex items-center gap-3">
            <button @click="decreaseQuantity" class="border border-highlight rounded-md w-9 h-9 flex items-center justify-center">-</button>
            <span class="font-body">{{ quantity }}</span>
            <button @click="increaseQuantity" class="border border-highlight rounded-md w-9 h-9 flex items-center justify-center">+</button>
          </div>
        </div>

        <hr class="my-4 border-outline-variant/30" />

        <div class="w-full bg-surface border border-outline-variant/20 rounded p-6">
          <h3 class="text-on-surface! font-headline text-xl font-semibold mb-3">Resumen</h3>
          <div class="flex flex-col gap-4">
            <div class="flex justify-between gap-2 font-body text-sm">
              <span class="shrink-0">Producto:</span>
              <span class="text-right">{{ product.name }}</span>
            </div>
            <div class="flex justify-between gap-2 font-body text-sm">
              <span class="shrink-0">Cantidad:</span>
              <span class="text-right">{{ quantity }}</span>
            </div>

            <hr class="border-outline-variant/30" />

            <div class="flex justify-between items-center font-semibold">
              <span class="font-ui text-on-surface!">TOTAL</span>
              <span class="font-headline text-[28px] leading-6 font-medium text-primary">{{ total }} €</span>
            </div>
          </div>
        </div>

        <!-- Si el producto no está disponible, el botón se desactiva -->
        <button
          @click="addToOrder"
          :disabled="!product.available"
          class="mt-4 w-full bg-primary-container text-white rounded-xl py-4 font-ui text-button font-semibold disabled:opacity-50"
        >
          {{ product.available ? 'AÑADIR AL PEDIDO' : 'AGOTADO' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  background-color: #7c8874;
  min-height: 100vh;
}
</style>