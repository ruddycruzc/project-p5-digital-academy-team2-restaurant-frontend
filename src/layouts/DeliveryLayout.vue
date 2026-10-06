<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { LayoutGrid, Truck, LogOut, Menu, X } from "lucide-vue-next";
import { useAuth } from "../composables/useAuth";

import goxiin from "../assets/images/branding/goxiin.png";

const router = useRouter();
const { logout: logoutSession } = useAuth();

const navItems = [
  {
    name: "delivery-dashboard",
    label: "Dashboard",
    icon: LayoutGrid,
  },
  {
    name: "delivery-orders",
    label: "Mis entregas",
    icon: Truck,
  },
];

const mobileMenuOpen = ref(false);

function closeMenu() {
  mobileMenuOpen.value = false;
}

watch(() => router.currentRoute.value.fullPath, closeMenu);

function handleLogout() {
  logoutSession();
  router.push({ name: "login" });
}
</script>

<template>
  <div class="min-h-screen flex bg-outline-variant/50">
    <div
      class="md:hidden fixed top-0 left-0 right-0 z-30 bg-on-surface text-surface-container-lowest px-4 py-3 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <img :src="goxiin" alt="Goxín" class="w-9 h-9 object-contain" />

        <span class="font-headline text-2xl"> Goxu </span>
      </div>

      <button
        type="button"
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="p-2"
      >
        <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />

        <X v-else class="w-6 h-6" />
      </button>
    </div>

    <div
      v-if="mobileMenuOpen"
      @click="closeMenu"
      class="md:hidden fixed inset-0 bg-black/40 z-20"
    ></div>

    <aside
      class="w-64 shrink-0 bg-on-surface text-surface-container-lowest flex flex-col justify-between p-6 fixed inset-y-0 left-0 z-30 transition-transform duration-200 md:relative md:translate-x-0"
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div>
        <div class="hidden md:flex items-center gap-3">
          <img :src="goxiin" alt="Goxín" class="w-10 h-10 object-contain" />

          <span class="font-headline text-5xl"> Goxu </span>
        </div>

        <span
          class="inline-block mt-3 bg-primary text-on-primary font-ui text-xs font-semibold uppercase px-3 py-1 rounded-full"
        >
          Repartidor
        </span>

        <p class="font-ui text-xs text-surface-container-high mt-2">
          Servicio de Entregas
        </p>

        <nav class="mt-10 flex flex-col gap-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="{ name: item.name }"
            @click="closeMenu"
            class="flex items-center gap-3 px-4 py-3 rounded-lg font-ui font-semibold text-surface-container-high transition-colors"
            exact-active-class="bg-primary text-on-primary"
          >
            <component :is="item.icon" class="w-4 h-4" />

            {{ item.label }}
          </RouterLink>
        </nav>
      </div>

      <button
        type="button"
        @click="handleLogout"
        class="group flex items-center gap-1.5 font-ui text-xs text-highlight transition-colors duration-200 hover:text-highlight/80"
      >
        <LogOut
          class="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
        />

        <span>Log out</span>
      </button>
    </aside>

    <main class="flex-1 px-4 py-6 md:px-6 md:py-8 mt-14 md:mt-0">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
