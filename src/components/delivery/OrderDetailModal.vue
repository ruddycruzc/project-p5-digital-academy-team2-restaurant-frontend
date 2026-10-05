<script setup>
import { MapPin, ShoppingBag } from "lucide-vue-next";
import BaseModal from "../BaseModal.vue";
import { formatCurrency } from "../../utils/formatCurrency";

defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(["close"]);
</script>

<template>
    <BaseModal :open="open" @close="emit('close')">
        <div
            v-if="order"
            class="max-h-[75vh] overflow-y-auto pr-1"
        >
            <span
                class="inline-block bg-primary-container text-on-primary-container font-ui text-xs font-semibold uppercase px-3 py-1 rounded-full mb-2"
            >
                En Tránsito
            </span>

            <div class="flex items-start justify-between gap-4">
                <h2 class="font-headline text-2xl text-on-surface">
                    Pedido {{ order.id }}
                </h2>

                <div class="text-right shrink-0">
                    <p class="font-headline text-xl text-tertiary">
                        {{ formatCurrency(order.price) }}
                    </p>

                    <p class="font-body text-xs text-outline">
                        {{ order.paid ? "Pagado" : "Pendiente de pago" }}
                    </p>
                </div>
            </div>

            <div
                class="bg-surface-container rounded-lg p-3 mt-4 flex flex-col gap-3"
            >
                <div class="flex items-start gap-2">
                    <MapPin
                        class="w-4 h-4 shrink-0 mt-0.5 text-primary"
                        aria-hidden="true"
                    />

                    <div>
                        <p
                            class="font-ui text-xs font-semibold uppercase text-outline"
                        >
                            Destino
                        </p>

                        <p class="font-body text-sm text-on-surface">
                            {{ order.customerName }}
                        </p>

                        <p class="font-body text-sm text-on-surface">
                            {{ order.customerAddress || "Dirección no disponible" }}
                        </p>

                        <p
                            v-if="
                                order.customerPostalCode ||
                                order.customerCity
                            "
                            class="font-body text-sm text-outline"
                        >
                            {{ order.customerPostalCode }}
                            {{ order.customerCity }}
                        </p>

                        <p
                            v-if="order.customerPhone"
                            class="font-body text-sm text-outline mt-1"
                        >
                            Teléfono: {{ order.customerPhone }}
                        </p>
                    </div>
                </div>
            </div>

            <p
                class="font-ui text-xs font-semibold uppercase tracking-caps text-outline mt-4 mb-2"
            >
                Contenido del Pedido
            </p>

            <div
                class="bg-surface-container rounded-lg p-3 flex flex-col gap-2"
            >
                <div
                    v-for="item in order.items"
                    :key="item.id || item.name"
                    class="flex items-center gap-2"
                >
                    <ShoppingBag
                        class="w-4 h-4 shrink-0 text-primary"
                        aria-hidden="true"
                    />

                    <p
                        class="font-body text-sm text-on-surface flex-1"
                    >
                        {{ item.productName }}
                    </p>

                    <span
                        class="bg-primary-container text-on-primary-container font-ui text-xs font-semibold px-2 py-0.5 rounded-full"
                    >
                        x{{ item.quantity }}
                    </span>
                </div>
            </div>

            <button
                type="button"
                @click="emit('close')"
                class="mt-4 w-full rounded-lg bg-primary text-surface-container-lowest font-ui text-sm font-semibold uppercase py-2.5"
            >
                Cerrar
            </button>
        </div>
    </BaseModal>
</template>

<style scoped>
</style>