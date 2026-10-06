<script setup>
import { ref, computed, onMounted } from "vue";
import { Search, Plus, Pencil, Trash2, X } from "lucide-vue-next";
import fabadaImg from "@/assets/images/menu/fabada.png";
import sidraImg from "@/assets/images/menu/sidra.png";
import arrozImg from "@/assets/images/menu/arroz-con-leche.png";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productService";

const categories = [
  "Todos",
  "Entrantes",
  "Especialidades",
  "Carnes",
  "Pescados",
  "Postres",
  "Bebidas",
];
const categoryStyles = {
  Todos: { bg: "bg-primary-container", text: "text-on-primary-container" },
  Entrantes: { bg: "bg-secondary-container", text: "text-secondary" },
  Especialidades: { bg: "bg-secondary-container", text: "text-secondary" },
  Carnes: { bg: "bg-error/15", text: "text-error" },
  Pescados: { bg: "bg-tertiary-container", text: "text-tertiary" },
  Postres: { bg: "bg-highlight/20", text: "text-highlight" },
  Bebidas: { bg: "bg-tertiary-container", text: "text-tertiary" },
};
const formCategories = categories.filter((c) => c !== "Todos");

const activeCategory = ref("Todos");
const searchQuery = ref("");

const products = ref([]);
const cargando = ref(true);
const errorCarga = ref(false);

const productosMock = [
  {
    id: 1,
    image: fabadaImg,
    name: "Fabada Tradicional",
    description: "Con compango ahumado de Tineo",
    category: "Especialidades",
    price: 24.5,
    available: true,
  },
  {
    id: 2,
    image: sidraImg,
    name: "Sidra Natural DOP",
    description: "Selección especial de la casa, botella 70cl",
    category: "Bebidas",
    price: 6.0,
    available: true,
  },
  {
    id: 3,
    image: arrozImg,
    name: "Arroz con Leche Requesón",
    description: "Postre tradicional asturiano caramelizado",
    category: "Postres",
    price: 7.5,
    available: false,
  },
];

async function cargarProductos() {
  cargando.value = true;
  errorCarga.value = false;
  try {
    products.value = await getProducts();
  } catch (err) {
    console.warn(
      "No se pudo conectar con el backend de productos, usando datos de ejemplo:",
      err,
    );
    errorCarga.value = true;
    products.value = productosMock;
  } finally {
    cargando.value = false;
  }
}

onMounted(cargarProductos);

const filteredProducts = computed(() =>
  products.value.filter((p) => {
    const matchesCategory =
      activeCategory.value === "Todos" || p.category === activeCategory.value;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    return matchesCategory && matchesSearch;
  }),
);

async function toggleAvailability(productId) {
  const product = products.value.find((p) => p.id === productId);
  if (!product) return;
  const nuevoEstado = !product.available;
  product.available = nuevoEstado;

  try {
    await updateProduct(productId, {
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      available: nuevoEstado,
      featured: product.featured || false,
      badgeLabel: product.badgeLabel || null,
      badgeTone: product.badgeTone || null,
    });
  } catch (err) {
    console.warn(
      "No se pudo actualizar en el backend, revirtiendo cambio local:",
      err,
    );
    product.available = !nuevoEstado;
  }
}

const showForm = ref(false);
const editingId = ref(null);
const guardando = ref(false);
const formError = ref(false);

const form = ref({
  name: "",
  description: "",
  price: 0,
  image: "",
  category: "Entrantes",
  available: true,
  featured: false,
  badgeLabel: "",
  badgeTone: "",
});

function abrirCrear() {
  editingId.value = null;
  form.value = {
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "Entrantes",
    available: true,
    featured: false,
    badgeLabel: "",
    badgeTone: "",
  };
  formError.value = false;
  showForm.value = true;
}

function abrirEditar(product) {
  editingId.value = product.id;
  form.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
    available: product.available,
    featured: product.featured || false,
    badgeLabel: product.badgeLabel || "",
    badgeTone: product.badgeTone || "",
  };
  formError.value = false;
  showForm.value = true;
}

function cerrarForm() {
  showForm.value = false;
}

async function guardarProducto() {
  guardando.value = true;
  formError.value = false;

  const payload = {
    name: form.value.name,
    description: form.value.description,
    price: Number(form.value.price),
    image: form.value.image,
    category: form.value.category,
    available: form.value.available,
    featured: form.value.featured,
    badgeLabel: form.value.badgeLabel || null,
    badgeTone: form.value.badgeTone || null,
  };

  try {
    if (editingId.value) {
      const actualizado = await updateProduct(editingId.value, payload);
      const idx = products.value.findIndex((p) => p.id === editingId.value);
      if (idx !== -1) products.value[idx] = actualizado;
    } else {
      const creado = await createProduct(payload);
      products.value.push(creado);
    }
    showForm.value = false;
  } catch (err) {
    console.error("No se pudo guardar el producto:", err);
    formError.value = true;
  } finally {
    guardando.value = false;
  }
}

async function eliminarProducto(productId) {
  try {
    await deleteProduct(productId);
    products.value = products.value.filter((p) => p.id !== productId);
  } catch (err) {
    console.error("No se pudo eliminar el producto:", err);
  }
}

defineExpose({
  products,
  errorCarga,
  cargando,
  activeCategory,
  filteredProducts,
  toggleAvailability,
});
</script>

<template>
  <div>
    <div
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
    >
      <div>
        <h1 class="font-headline text-3xl font-semibold text-primary">
          Gestión de Productos
        </h1>
        <p class="font-body text-white text-sm mt-1">
          Administra el inventario, precios y disponibilidad.
        </p>
      </div>
      <button
        type="button"
        @click="abrirCrear"
        class="bg-primary-container text-white font-ui font-semibold px-5 py-3 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2"
      >
        <Plus class="w-4 h-4" />
        AÑADIR PRODUCTO
      </button>
    </div>

    <p v-if="errorCarga" class="font-ui text-sm text-error mt-3">
      No se ha podido conectar con el servidor. Mostrando datos de ejemplo.
    </p>

    <div
      class="bg-surface-container-lowest rounded-xl p-4 mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
    >
      <div
        class="flex-1 flex items-center gap-2 bg-surface-container-low rounded-lg px-4 py-2"
      >
        <Search class="w-4 h-4 text-outline shrink-0" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar productos..."
          class="bg-transparent w-full font-body text-on-surface outline-none"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          @click="activeCategory = cat"
          class="font-ui font-semibold text-sm px-4 py-2 rounded-full whitespace-nowrap"
          :class="
            activeCategory === cat
              ? [categoryStyles[cat].bg, categoryStyles[cat].text]
              : 'bg-surface-container-low text-on-surface'
          "
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <p v-if="cargando" class="font-ui text-sm text-outline mt-4">
      Cargando productos...
    </p>

    <template v-else>
      <div class="md:hidden flex flex-col gap-3 mt-4">
        <div
          v-for="p in filteredProducts"
          :key="p.id"
          class="bg-surface-container-lowest rounded-xl p-4 flex flex-col gap-3"
        >
          <div class="flex items-center gap-4">
            <img
              :src="p.image"
              alt=""
              class="w-16 h-16 rounded-lg object-cover shrink-0"
            />
            <div class="flex-1">
              <p class="font-headline text-xl text-on-surface">{{ p.name }}</p>
              <p class="font-body text-sm text-outline">{{ p.description }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span
              class="font-ui text-xs px-3 py-1 rounded-full whitespace-nowrap"
              :class="[
                categoryStyles[p.category]?.bg || 'bg-secondary-container',
                categoryStyles[p.category]?.text || 'text-secondary',
              ]"
            >
              {{ p.category }}
            </span>
            <span class="font-headline text-2xl text-primary">{{
              formatCurrency(p.price)
            }}</span>
          </div>
          <div
            class="flex items-center justify-between border-t border-outline-variant/20 pt-3"
          >
            <span class="font-ui text-sm font-semibold text-on-surface"
              >Disponibilidad</span
            >
            <button
              type="button"
              @click="toggleAvailability(p.id)"
              class="w-11 h-6 rounded-full relative transition-colors cursor-pointer appearance-none border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              :class="p.available ? 'bg-primary' : 'bg-outline-variant'"
              :aria-pressed="p.available"
            >
              <span
                class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform block"
                :class="p.available ? 'translate-x-5' : 'translate-x-0'"
              ></span>
            </button>
          </div>
          <div
            class="flex items-center gap-2 border-t border-outline-variant/20 pt-3"
          >
            <button
              type="button"
              @click="abrirEditar(p)"
              class="flex-1 flex items-center justify-center gap-2 bg-surface-container-low text-on-surface font-ui text-sm py-2 rounded-lg"
            >
              <Pencil class="w-4 h-4" /> Editar
            </button>
            <button
              type="button"
              @click="eliminarProducto(p.id)"
              class="flex-1 flex items-center justify-center gap-2 bg-error/10 text-error font-ui text-sm py-2 rounded-lg"
            >
              <Trash2 class="w-4 h-4" /> Eliminar
            </button>
          </div>
        </div>
      </div>

      <div
        class="hidden md:block bg-surface-container-lowest rounded-xl mt-4 overflow-x-auto"
      >
        <table class="w-full min-w-160">
          <thead>
            <tr
              class="font-ui text-xs text-outline text-left border-b border-outline-variant/30"
            >
              <th class="p-4">Producto</th>
              <th class="p-4">Categoría</th>
              <th class="p-4">Precio</th>
              <th class="p-4">Disponibilidad</th>
              <th class="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in filteredProducts"
              :key="p.id"
              class="border-b border-outline-variant/20 last:border-0"
            >
              <td class="p-4 flex items-center gap-4">
                <img
                  :src="p.image"
                  alt=""
                  class="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div>
                  <p class="font-headline text-xl text-on-surface">
                    {{ p.name }}
                  </p>
                  <p class="font-body text-base text-outline">
                    {{ p.description }}
                  </p>
                </div>
              </td>
              <td class="p-4">
                <span
                  class="font-ui text-xs px-3 py-1 rounded-full whitespace-nowrap"
                  :class="[
                    categoryStyles[p.category]?.bg || 'bg-secondary-container',
                    categoryStyles[p.category]?.text || 'text-secondary',
                  ]"
                >
                  {{ p.category }}
                </span>
              </td>
              <td
                class="p-4 font-headline text-2xl text-primary whitespace-nowrap"
              >
                {{ formatCurrency(p.price) }}
              </td>
              <td class="p-4">
                <button
                  type="button"
                  @click="toggleAvailability(p.id)"
                  class="w-11 h-6 rounded-full relative transition-colors cursor-pointer appearance-none border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  :class="p.available ? 'bg-primary' : 'bg-outline-variant'"
                  :aria-pressed="p.available"
                >
                  <span
                    class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform block"
                    :class="p.available ? 'translate-x-5' : 'translate-x-0'"
                  ></span>
                </button>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="abrirEditar(p)"
                    class="p-2 rounded-lg bg-surface-container-low text-on-surface"
                    title="Editar"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    @click="eliminarProducto(p.id)"
                    class="p-2 rounded-lg bg-error/10 text-error"
                    title="Eliminar"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <div
      v-if="showForm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-surface-container-lowest rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-headline text-xl text-on-surface">
            {{ editingId ? "Editar producto" : "Nuevo producto" }}
          </h2>
          <button type="button" @click="cerrarForm">
            <X class="w-5 h-5 text-outline" />
          </button>
        </div>

        <p v-if="formError" class="font-ui text-sm text-error mb-3">
          No se ha podido guardar el producto. Revisa los datos.
        </p>

        <form @submit.prevent="guardarProducto" class="flex flex-col gap-3">
          <input
            v-model="form.name"
            type="text"
            placeholder="Nombre"
            required
            class="bg-surface-container-low rounded-lg px-3 py-2 font-body"
          />
          <textarea
            v-model="form.description"
            placeholder="Descripción"
            required
            class="bg-surface-container-low rounded-lg px-3 py-2 font-body"
          ></textarea>
          <input
            v-model.number="form.price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Precio"
            required
            class="bg-surface-container-low rounded-lg px-3 py-2 font-body"
          />
          <input
            v-model="form.image"
            type="text"
            placeholder="Ruta de imagen (ej: /menu-img/fabada.png)"
            required
            class="bg-surface-container-low rounded-lg px-3 py-2 font-body"
          />
          <select
            v-model="form.category"
            class="bg-surface-container-low rounded-lg px-3 py-2 font-body"
          >
            <option v-for="cat in formCategories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
          <input
            v-model="form.badgeLabel"
            type="text"
            placeholder="Etiqueta (opcional)"
            class="bg-surface-container-low rounded-lg px-3 py-2 font-body"
          />
          <div class="flex items-center gap-4">
            <label
              class="flex items-center gap-2 font-ui text-sm text-on-surface"
            >
              <input v-model="form.available" type="checkbox" />
              Disponible
            </label>
            <label
              class="flex items-center gap-2 font-ui text-sm text-on-surface"
            >
              <input v-model="form.featured" type="checkbox" />
              Destacado
            </label>
          </div>
          <button
            type="submit"
            :disabled="guardando"
            class="mt-2 bg-primary-container text-white font-ui font-semibold py-3 rounded-xl disabled:opacity-50"
          >
            {{ guardando ? "Guardando..." : "Guardar" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
