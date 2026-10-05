import { ref, computed } from "vue";

export function usePayment() {
  const paymentStatus = ref("idle");
  const paymentAttempts = ref(0);

  const maxAttempts = 3;

  const canRetry = computed(() => {
    return paymentAttempts.value < maxAttempts;
  });

  const startPayment = () => {
    paymentStatus.value = "processing";
  };

  const confirmPayment = () => {
    paymentStatus.value = "confirmed";
  };

  const failPayment = () => {
    paymentAttempts.value++;

    if (paymentAttempts.value >= maxAttempts) {
      paymentStatus.value = "max-attempts";
      return;
    }

    paymentStatus.value = "failed";
  };

  const processPayment = async (paymentRequest) => {
    if (!canRetry.value) {
      paymentStatus.value = "max-attempts";
      return null;
    }

    startPayment();

    try {
      const result = await paymentRequest();

      confirmPayment();

      return result;
    } catch (error) {
      failPayment();

      throw error;
    }
  };

  const retryPayment = () => {
    if (!canRetry.value) {
      paymentStatus.value = "max-attempts";
      return;
    }

    startPayment();
  };

  const resetPayment = () => {
    paymentStatus.value = "idle";
  };

  const cancelPayment = () => {
    paymentStatus.value = "cancelled";
  };

  return {
    paymentStatus,
    paymentAttempts,
    maxAttempts,
    canRetry,
    processPayment,
    retryPayment,
    resetPayment,
    cancelPayment,
  };
}