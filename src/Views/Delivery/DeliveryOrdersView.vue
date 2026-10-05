<script setup>
import { Truck } from "lucide-vue-next";
import { formatCurrency } from "../../utils/formatCurrency";
import { allOrders } from "../../composables/useDeliveryState";

const columns = "grid-cols-[80px_120px_90px_1fr_100px_110px]";

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

function getStatusLabel(status) {
    const labels = {
        DELIVERED: "Entregado",
        ON_THE_WAY: "En tránsito",
        READY: "Listo",
    };

    return labels[status] || status;
}
</script>

<template>
    <div>
        <header class="mb-8">
            <h1 class="font-headline text-6xl text-primary">
                Mis Entregas
            </h1>

            <p class="font-body text-sm text-outline mt-1">
                Historial de servicios
            </p>
        </header>

        <section class="flex flex-col gap-3">
            <h2
                class="flex items-center gap-2 font-ui text-sm font-semibold uppercase tracking-caps text-outline"
            >
                <Truck
                    class="w-4 h-4"
                    aria-hidden="true"
                />

                Historial de pedidos
            </h2>

            <!-- Cabecera desktop -->
            <div
                :class="columns"
                class="hidden md:grid gap-2 px-3 font-ui text-sm font-semibold uppercase tracking-caps text-primary text-center"
            >
                <span>Pedido</span>
                <span>Fecha</span>
                <span>Hora</span>
                <span>Dirección</span>
                <span>Precio</span>
                <span>Estado</span>
            </div>

            <!-- Pedidos -->
            <div
                v-for="order in allOrders"
                :key="order.id"
                :class="columns"
                class="bg-surface-container-lowest rounded-xl p-3 border border-primary/50 shadow-sm grid grid-cols-2 md:grid gap-2 items-center text-center"
            >
                <!-- Pedido -->
                <span
                    class="font-headline text-3xl font-black text-black"
                >
                    #{{ order.id }}
                </span>

                <!-- Fecha -->
                <span
                    class="font-body text-sm font-bold text-on-surface"
                >
                    {{ formatDate(order.createdAt) }}
                </span>

                <!-- Hora -->
                <span
                    class="font-body text-sm font-bold text-on-surface"
                >
                    {{ formatTime(order.createdAt) }}
                </span>

                <!-- Dirección -->
                <div
                    class="col-span-2 md:col-span-1 flex flex-col items-center"
                >
                    <span
                        class="font-body text-sm font-bold text-on-surface"
                    >
                        {{ order.customerAddress || "Dirección no disponible" }}
                    </span>

                    <span
                        v-if="
                            order.customerPostalCode ||
                            order.customerCity
                        "
                        class="font-body text-xs text-outline"
                    >
                        {{ order.customerPostalCode }}
                        {{ order.customerCity }}
                    </span>
                </div>

                <!-- Precio -->
                <span
                    class="font-body text-sm font-bold text-on-surface"
                >
                    {{ formatCurrency(order.price) }}
                </span>

                <!-- Estado -->
                <span
                    class="justify-self-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-ui text-xs font-semibold uppercase tracking-caps"
                >
                    {{ getStatusLabel(order.status) }}
                </span>
            </div>

            <!-- Sin pedidos -->
            <div
                v-if="!allOrders.length"
                class="rounded-xl border border-primary/30 bg-surface-container-lowest p-8 text-center"
            >
                <p class="font-body text-sm text-outline">
                    No hay pedidos entregados todavía.
                </p>
            </div>
        </section>
    </div>
</template>