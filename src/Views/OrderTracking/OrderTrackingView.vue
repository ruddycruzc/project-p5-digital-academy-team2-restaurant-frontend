<script setup>
import { onMounted, ref } from "vue";
import {
    ClipboardList,
    UtensilsCrossed,
    CheckCircle2,
    Bike,
    Home,
} from "lucide-vue-next";
import { useRoute } from "vue-router";
import { getOrderTracking } from "../../services/orderTrackingService";

const route = useRoute();

const tracking = ref([]);
const loading = ref(true);
const error = ref("");

const statusConfig = {
    PENDING: {
        label: "Pedido recibido",
        icon: ClipboardList,
    },
    IN_KITCHEN: {
        label: "En cocina",
        icon: UtensilsCrossed,
    },
    READY: {
        label: "Pedido listo",
        icon: CheckCircle2,
    },
    ON_THE_WAY: {
        label: "En camino",
        icon: Bike,
    },
    DELIVERED: {
        label: "Entregado",
        icon: Home,
    },
};

function getStatusConfig(status) {
    return (
        statusConfig[status] || {
            label: status,
            icon: ClipboardList,
        }
    );
}

function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("es-ES");
}

function formatTime(date) {
    if (!date) return "—";

    return new Date(date).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

async function loadTracking() {
    const orderId = route.query.orderId;

    if (!orderId) {
        error.value = "No se ha encontrado el pedido.";
        loading.value = false;
        return;
    }

    try {
        tracking.value = await getOrderTracking(orderId);
    } catch (err) {
        console.error(
            "No se ha podido cargar el seguimiento:",
            err,
        );

        error.value =
            "No se ha podido cargar el seguimiento del pedido.";
    } finally {
        loading.value = false;
    }
}

onMounted(loadTracking);
</script>

<template>
    <main class="min-h-screen bg-outline-variant/50 px-4 py-10 sm:px-6 lg:px-8">
        <section class="mx-auto w-full max-w-3xl">
            <header class="mb-8">
                <p
                    class="font-ui text-xs font-semibold uppercase tracking-caps text-highlight"
                >
                    Seguimiento
                </p>

                <h1
                    class="font-headline text-4xl text-primary sm:text-5xl"
                >
                    Estado de tu pedido
                </h1>

                <p class="mt-2 font-body text-sm text-outline">
                    Consulta el progreso de tu pedido.
                </p>
            </header>

            <div
                v-if="loading"
                class="rounded-xl border border-primary/30 bg-surface-container-lowest p-8 text-center"
            >
                <p class="font-body text-sm text-outline">
                    Cargando seguimiento...
                </p>
            </div>

            <div
                v-else-if="error"
                class="rounded-xl border border-error/40 bg-surface-container-lowest p-8 text-center"
            >
                <p class="font-ui text-sm font-semibold text-error">
                    {{ error }}
                </p>
            </div>

            <div
                v-else-if="tracking.length"
                class="rounded-xl bg-surface-container-lowest p-6 shadow-sm"
            >
                <div
                    v-for="(item, index) in tracking"
                    :key="`${item.status}-${index}`"
                    class="relative flex gap-4"
                >
                    <div class="flex flex-col items-center">
                        <div
                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary"
                        >
                            <component
                                :is="getStatusConfig(item.status).icon"
                                class="h-5 w-5"
                            />
                        </div>

                        <div
                            v-if="index < tracking.length - 1"
                            class="w-0.5 flex-1 bg-primary/20"
                        ></div>
                    </div>

                    <div class="pb-8">
                        <h2
                            class="font-headline text-lg text-on-surface"
                        >
                            {{ getStatusConfig(item.status).label }}
                        </h2>

                        <p class="font-body text-sm text-outline">
                            {{ formatDate(item.changedAt) }}
                            ·
                            {{ formatTime(item.changedAt) }}
                        </p>
                    </div>
                </div>
            </div>

            <div
                v-else
                class="rounded-xl border border-primary/30 bg-surface-container-lowest p-8 text-center"
            >
                <p class="font-body text-sm text-outline">
                    Todavía no hay información de seguimiento para este pedido.
                </p>
            </div>
        </section>
    </main>
</template>

<style scoped>
</style>