import { describe, it, expect, beforeEach } from "vitest";
import { useReservation } from "../../composables/useReservation";

/*
 * El estado de useReservation se comparte entre usos (está fuera de la función),
 * así que antes de cada test lo devolvemos a sus valores iniciales.
 */
beforeEach(() => {
  const { selectedDate, selectedTime, guests, name, phone, email, specialRequests } =
    useReservation();
  selectedDate.value = null;
  selectedTime.value = null;
  guests.value = 2;
  name.value = "";
  phone.value = "";
  email.value = "";
  specialRequests.value = "";
});

describe("useReservation", () => {
  it("empieza con 2 comensales", () => {
    const { guests } = useReservation();
    expect(guests.value).toBe(2);
  });

  it("suma un comensal con increaseGuests", () => {
    const { guests, increaseGuests } = useReservation();
    increaseGuests();
    expect(guests.value).toBe(3);
  });

  it("no pasa de 12 comensales", () => {
    const { guests, increaseGuests } = useReservation();
    guests.value = 12;
    increaseGuests();
    expect(guests.value).toBe(12);
  });

  it("resta un comensal con decreaseGuests", () => {
    const { guests, decreaseGuests } = useReservation();
    decreaseGuests();
    expect(guests.value).toBe(1);
  });

  it("no baja de 1 comensal", () => {
    const { guests, decreaseGuests } = useReservation();
    guests.value = 1;
    decreaseGuests();
    expect(guests.value).toBe(1);
  });

  it("reúne todos los datos en el objeto reservation", () => {
    const { selectedDate, selectedTime, name, phone, email, reservation } =
      useReservation();
    selectedDate.value = "2026-10-10";
    selectedTime.value = "21:00";
    name.value = "Gema";
    phone.value = "600123456";
    email.value = "gema@ejemplo.com";

    expect(reservation.value).toEqual({
      date: "2026-10-10",
      time: "21:00",
      guests: 2,
      name: "Gema",
      phone: "600123456",
      email: "gema@ejemplo.com",
      specialRequests: "",
    });
  });
});