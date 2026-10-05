import { ref, computed } from "vue";
import { getCurrentUser } from "../services/authService";
import { getToken, removeToken } from "../utils/authStorage";

const user = ref(null);
const loading = ref(false);

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value);

  const roles = computed(() => user.value?.roles ?? []);
  const isCustomer = computed(() => roles.value.includes("CUSTOMER"));
  const isAdmin = computed(() => roles.value.includes("ADMIN"));
  const isKitchen = computed(() => roles.value.includes("KITCHEN"));
  const isDelivery = computed(() => roles.value.includes("DELIVERY"));

  async function loadUser() {
    const token = getToken();

    if (!token) {
      user.value = null;
      return null;
    }

    loading.value = true;

    try {
      const currentUser = await getCurrentUser();

      user.value = currentUser;

      return currentUser;
    } catch (error) {
      user.value = null;

      if (error.status === 401) {
        removeToken();
      }

      throw error;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    removeToken();
    user.value = null;
  }

  return {
    user,
    loading,
    isAuthenticated,
    roles,
    isCustomer,
    isAdmin,
    isKitchen,
    isDelivery,
    loadUser,
    logout,
  };
}
