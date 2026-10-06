<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import logo from "../assets/images/branding/logo-Goxu.png";
import userIcon from "../assets/images/home/login.png";
import cartIcon from "../assets/images/home/carrito.png";

import { useAuth } from "../composables/useAuth";
import { useCart } from "../composables/useCart";

const links = [
  { label: "Inicio", to: "/" },
  { label: "Carta", to: "/carta" },
  //{ label: 'Reservas', to: '/reservation' },
  //{ label: 'Nosotros', to: null },
  { label: "Contacto", to: null, action: "contact" },
  { label: "Ofertas", to: "/ofertas-eventos" },
];

const route = useRoute();
const router = useRouter();
const menuOpen = ref(false);
const userMenuOpen = ref(false);
const userMenuRef = ref(null);

const linkClasses =
  "inline-block font-ui text-sm font-semibold text-inverse-on-surface transition duration-300 hover:scale-105 hover:text-highlight";

const iconLinkClasses =
  "flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 transition-colors duration-300 ease-in-out hover:bg-primary/25";

function scrollToContact() {
  document
    .getElementById("contacto")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function goToContact() {
  menuOpen.value = false;
  if (route.path === "/") {
    scrollToContact();
    return;
  }
  await router.push("/");
  await nextTick();
  setTimeout(scrollToContact, 650);
}

const { user, loadUser, logout } = useAuth();
const { cartItems } = useCart();

async function handleUserClick() {
  try {
    const currentUser = user.value || (await loadUser());

    if (currentUser) {
      userMenuOpen.value = !userMenuOpen.value;
      return;
    }

    router.push("/login");
  } catch (error) {
    router.push("/login");
  }
}

function handleLogout() {
  logout();
  userMenuOpen.value = false;
  menuOpen.value = false;
  router.push("/");
}
function handleClickOutside(event) {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    userMenuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-primary/30 bg-linear-to-r from-black/90 via-black/60 to-primary/15 px-5 py-3 backdrop-blur-xl shadow-[0_4px_20px_rgba(194,24,91,0.15)] md:px-8"
  >
    <div class="flex items-center justify-between gap-6">
      <RouterLink to="/" class="shrink-0">
        <img :src="logo" alt="Goxu" class="h-16 w-auto" />
      </RouterLink>

      <nav class="hidden items-center gap-10 md:flex lg:gap-12">
        <template v-for="link in links" :key="link.label">
          <RouterLink
            v-if="link.to"
            :to="link.to"
            :class="linkClasses"
            active-class="text-highlight"
          >
            {{ link.label }}
          </RouterLink>
          <a
            v-else-if="link.action === 'contact'"
            href="#contacto"
            :class="linkClasses"
            @click.prevent="goToContact"
          >
            {{ link.label }}
          </a>
          <span
            v-else
            class="font-ui text-sm font-semibold text-inverse-on-surface/50"
            >{{ link.label }}</span
          >
        </template>
      </nav>

      <div class="flex items-center gap-4">
        <div ref="userMenuRef" class="relative">
          <button
            type="button"
            aria-label="Acceder a mi cuenta"
            class="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 transition-colors duration-300 hover:bg-primary/25"
            @click.stop="handleUserClick"
          >
            <img :src="userIcon" alt="Mi cuenta" class="h-7 w-7 shrink-0" />
          </button>

          <div
            v-if="userMenuOpen"
            class="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-white/15 bg-surface shadow-lg"
          >
            <RouterLink
              to="/account"
              class="block px-4 py-3 font-ui text-sm text-on-surface transition-colors hover:bg-primary/10"
              @click="userMenuOpen = false"
            >
              Mi cuenta
            </RouterLink>

            <button
              type="button"
              class="block w-full px-4 py-3 text-left font-ui text-sm text-on-surface transition-colors hover:bg-primary/10"
              @click="handleLogout"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
        <RouterLink to="/cart" :class="[iconLinkClasses, 'relative']">
          <img :src="cartIcon" alt="Carrito" class="h-5 w-5 shrink-0" />

          <span
            v-if="cartItems.length > 0"
            class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-highlight"
          ></span>
        </RouterLink>

        <button
          type="button"
          class="ml-1 flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Abrir menú"
          @click="menuOpen = !menuOpen"
        >
          <span class="h-0.5 w-6 bg-inverse-on-surface"></span>
          <span class="h-0.5 w-6 bg-inverse-on-surface"></span>
          <span class="h-0.5 w-6 bg-inverse-on-surface"></span>
        </button>
      </div>
    </div>

    <nav v-if="menuOpen" class="mt-4 flex flex-col items-start gap-4 md:hidden">
      <template v-for="link in links" :key="link.label">
        <RouterLink
          v-if="link.to"
          :to="link.to"
          :class="[linkClasses, 'origin-left']"
          active-class="text-highlight"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </RouterLink>
        <a
          v-else-if="link.action === 'contact'"
          href="#contacto"
          :class="[linkClasses, 'origin-left']"
          @click.prevent="goToContact"
        >
          {{ link.label }}
        </a>
        <span
          v-else
          class="font-ui text-sm font-semibold text-inverse-on-surface/50"
          >{{ link.label }}</span
        >
      </template>
    </nav>
  </header>
</template>
