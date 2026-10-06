import { describe, it, expect } from "vitest";
import { usePayment } from "../../composables/usePayment";

describe("usePayment", () => {
  it("empieza con el estado inicial correcto", () => {
    const { paymentStatus, paymentAttempts, maxAttempts, canRetry } =
      usePayment();

    expect(paymentStatus.value).toBe("idle");
    expect(paymentAttempts.value).toBe(0);
    expect(maxAttempts).toBe(3);
    expect(canRetry.value).toBe(true);
  });

  it("confirma un pago realizado correctamente", async () => {
    const { paymentStatus, processPayment } = usePayment();

    const paymentRequest = async () => ({
      id: 123,
      status: "PAID",
    });

    const result = await processPayment(paymentRequest);

    expect(result).toEqual({
      id: 123,
      status: "PAID",
    });

    expect(paymentStatus.value).toBe("confirmed");
  });

  it("marca como fallido el primer intento", async () => {
    const { paymentStatus, paymentAttempts } = usePayment();

    const paymentRequest = async () => {
      throw new Error("Payment failed");
    };

    await expect(usePayment().processPayment(paymentRequest)).rejects.toThrow(
      "Payment failed",
    );
  });

  it("incrementa los intentos cuando un pago falla", async () => {
    const { paymentStatus, paymentAttempts, processPayment } = usePayment();

    const paymentRequest = async () => {
      throw new Error("Payment failed");
    };

    await expect(processPayment(paymentRequest)).rejects.toThrow(
      "Payment failed",
    );

    expect(paymentAttempts.value).toBe(1);
    expect(paymentStatus.value).toBe("failed");
  });

  it("permite un segundo intento después de un fallo", async () => {
    const { paymentAttempts, paymentStatus, processPayment } = usePayment();

    const failedRequest = async () => {
      throw new Error("Payment failed");
    };

    await expect(processPayment(failedRequest)).rejects.toThrow(
      "Payment failed",
    );

    const successfulRequest = async () => ({
      id: 456,
      status: "PAID",
    });

    const result = await processPayment(successfulRequest);

    expect(result).toEqual({
      id: 456,
      status: "PAID",
    });

    expect(paymentAttempts.value).toBe(1);
    expect(paymentStatus.value).toBe("confirmed");
  });

  it("bloquea el pago después de tres intentos fallidos", async () => {
    const { paymentAttempts, paymentStatus, canRetry, processPayment } =
      usePayment();

    const failedRequest = async () => {
      throw new Error("Payment failed");
    };

    for (let i = 0; i < 3; i++) {
      await expect(processPayment(failedRequest)).rejects.toThrow(
        "Payment failed",
      );
    }

    expect(paymentAttempts.value).toBe(3);
    expect(paymentStatus.value).toBe("max-attempts");
    expect(canRetry.value).toBe(false);
  });

  it("no ejecuta la petición cuando se ha alcanzado el máximo de intentos", async () => {
    const { processPayment } = usePayment();

    const paymentRequest = async () => {
      throw new Error("Payment failed");
    };

    for (let i = 0; i < 3; i++) {
      await expect(processPayment(paymentRequest)).rejects.toThrow(
        "Payment failed",
      );
    }

    const blockedRequest = async () => ({
      id: 999,
    });

    const result = await processPayment(blockedRequest);

    expect(result).toBeNull();
  });

  it("retryPayment vuelve a poner el pago en processing", async () => {
    const { paymentStatus, paymentAttempts, processPayment, retryPayment } =
      usePayment();

    const failedRequest = async () => {
      throw new Error("Payment failed");
    };

    await expect(processPayment(failedRequest)).rejects.toThrow(
      "Payment failed",
    );

    expect(paymentStatus.value).toBe("failed");
    expect(paymentAttempts.value).toBe(1);

    retryPayment();

    expect(paymentStatus.value).toBe("processing");
    expect(paymentAttempts.value).toBe(1);
  });

  it("no permite retryPayment después del máximo de intentos", async () => {
    const { paymentStatus, processPayment, retryPayment } = usePayment();

    const failedRequest = async () => {
      throw new Error("Payment failed");
    };

    for (let i = 0; i < 3; i++) {
      await expect(processPayment(failedRequest)).rejects.toThrow(
        "Payment failed",
      );
    }

    retryPayment();

    expect(paymentStatus.value).toBe("max-attempts");
  });

  it("cancela el pago", () => {
    const { paymentStatus, cancelPayment } = usePayment();

    cancelPayment();

    expect(paymentStatus.value).toBe("cancelled");
  });

  it("resetea el estado del pago", () => {
    const { paymentStatus, cancelPayment, resetPayment } = usePayment();

    cancelPayment();

    expect(paymentStatus.value).toBe("cancelled");

    resetPayment();

    expect(paymentStatus.value).toBe("idle");
  });
});

function cancelPaymentState(paymentStatus) {
  paymentStatus.value = "cancelled";
}
