import { ref } from "vue";
import {
  getReadyOrders,
  getOrdersOnTheWay,
  getDeliveredOrders,
  startDelivery,
  completeDelivery,
} from "../services/deliveryService";
import { getCustomerProfile } from "../services/profileService";

export const currentService = ref(null);
export const availableService = ref(null);
export const allOrders = ref([]);

export const loading = ref(false);
export const error = ref(null);

const profileCache = new Map();

async function getProfile(userId) {
  if (!userId) return null;

  if (profileCache.has(userId)) {
    return profileCache.get(userId);
  }

  try {
    const profile = await getCustomerProfile(userId);

    profileCache.set(userId, profile);

    return profile;
  } catch (err) {
    console.error(`No se ha podido cargar el perfil ${userId}:`, err);
    return null;
  }
}

async function adaptOrder(order) {
  const profile = await getProfile(order.userId);

  return {
    id: order.id,
    price: Number(order.total),
    customerName: order.userName,
    customerAddress: profile?.address || "",
    customerPostalCode: profile?.postalCode || "",
    customerCity: profile?.city || "",
    customerPhone: profile?.phone || "",
    status: order.status,
    paid: order.paid,
    createdAt: order.createdAt,
    tableNumber: order.tableNumber,
    userId: order.userId,
    items: order.items ?? [],
  };
}

export async function loadDeliveryState() {
  loading.value = true;
  error.value = null;

  try {
    const [readyOrders, onTheWayOrders, deliveredOrders] =
      await Promise.all([
        getReadyOrders(),
        getOrdersOnTheWay(),
        getDeliveredOrders(),
      ]);

    availableService.value = readyOrders.length
      ? await adaptOrder(readyOrders[0])
      : null;

    currentService.value = onTheWayOrders.length
      ? await adaptOrder(onTheWayOrders[0])
      : null;

    allOrders.value = await Promise.all(
      deliveredOrders.map(adaptOrder),
    );
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
}

export async function acceptOrder() {
  if (!availableService.value) return;

  loading.value = true;
  error.value = null;

  try {
    const updatedOrder = await startDelivery(availableService.value.id);

    currentService.value = await adaptOrder(updatedOrder);
    availableService.value = null;
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
}

export async function deliverOrder() {
  if (!currentService.value) return;

  loading.value = true;
  error.value = null;

  try {
    const updatedOrder = await completeDelivery(currentService.value.id);

    const deliveredOrder = await adaptOrder(updatedOrder);

    allOrders.value.unshift(deliveredOrder);
    currentService.value = null;
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
}

export function rejectOrder() {
  availableService.value = null;
}