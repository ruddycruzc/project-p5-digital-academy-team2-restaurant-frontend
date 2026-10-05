<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthTabs from "../../components/AuthTabs.vue";
import BaseInput from "../../components/BaseInput.vue";
import BaseButton from "../../components/BaseButton.vue";
import { loginUser } from "../../services/authService";
import { saveToken } from "../../utils/authStorage";
import { useAuth } from "../../composables/useAuth";

const router = useRouter();
const { loadUser } = useAuth();

function getDashboardRoute(user) {
  const role = user.roles?.[0];

  const dashboardRoutes = {
    CUSTOMER: "account",
    ADMIN: "admin-dashboard",
    KITCHEN: "kitchen-dashboard",
    DELIVERY: "delivery-dashboard",
  };

  return dashboardRoutes[role] || "home";
}

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const submitting = ref(false);
const errorMessage = ref("");

async function handleSubmit() {
  errorMessage.value = ''
  submitting.value = true

  try {
    const response = await loginUser(email.value, password.value)

    saveToken(response.token, rememberMe.value)

    const currentUser = await loadUser()

    await router.push({
      name: getDashboardRoute(currentUser),
    })
  } catch (error) {
    if (error.status === 401) {
      errorMessage.value = 'El correo o la contraseña no son correctos.'
    } else {
      errorMessage.value = 'No se ha podido iniciar sesión. Inténtalo de nuevo.'
    }

    console.error('Error al iniciar sesión:', error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen">
    <div class="hidden flex-1 bg-surface-dim md:block"></div>

    <div
      class="flex flex-1 items-center justify-center bg-surface px-6 py-16 md:px-16"
    >
      <div class="w-full max-w-md">
        <AuthTabs />

        <h1
          class="mt-10 font-headline text-headline-md font-medium text-on-surface"
        >
          Bienvenido de nuevo
        </h1>

        <p class="mt-2 font-body text-body-md text-on-surface-variant">
          Accede para gestionar tus reservas y pedidos.
        </p>

        <form class="mt-8 flex flex-col gap-6" @submit.prevent="handleSubmit">
          <BaseInput
            id="email"
            v-model="email"
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            autocomplete="email"
          />

          <BaseInput
            id="password"
            v-model="password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
          />

          <div class="flex items-center justify-between">
            <label
              class="flex items-center gap-2 font-body text-sm text-on-surface"
            >
              <input
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 rounded-sm border-outline text-primary focus:ring-primary"
              />
              Recordar sesión
            </label>

            <button
              type="button"
              class="font-body text-sm text-highlight hover:underline"
            >
              ¿Recuperar contraseña?
            </button>
          </div>

          <p
            v-if="errorMessage"
            class="font-body text-sm text-error"
            role="alert"
          >
            {{ errorMessage }}
          </p>

          <BaseButton type="submit" :disabled="submitting">
            {{ submitting ? "Iniciando sesión..." : "Entrar" }}
          </BaseButton>
        </form>

        <RouterLink
          to="/"
          class="mt-8 flex items-center justify-center gap-2 font-body text-sm text-highlight hover:underline"
        >
          <span aria-hidden="true">←</span>
          Volver al inicio
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
