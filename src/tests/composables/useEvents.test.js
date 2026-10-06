import { describe, it, expect, vi, beforeEach } from "vitest";
import { useEvents } from "../../composables/useEvents";

/*
 * Eventos de ejemplo con el mismo formato que devuelve el back (GET /api/events).
 * Dos en marzo y uno en junio, para poder probar la agrupación por meses.
 */
const eventosDelBack = [
  {
    id: 1,
    title: "Noche de sidra",
    description: "Escanciado en directo",
    image: "/events-img/sidra.png",
    featured: true,
    eventDate: "2026-03-28T20:30:00",
    details: "Plazas limitadas",
    price: 25,
  },
  {
    id: 2,
    title: "Cata de quesos",
    description: "Quesos asturianos",
    image: "/events-img/quesos.png",
    featured: false,
    eventDate: "2026-03-30T19:00:00",
    details: null,
    price: null,
  },
  {
    id: 3,
    title: "Fiesta de verano",
    description: "Música y espicha",
    image: "/events-img/verano.png",
    featured: false,
    eventDate: "2026-06-21T21:00:00",
    details: null,
    price: 15,
  },
];

/*
 * Simula una respuesta correcta del back:
 * fetch devuelve ok: true y los datos que le pasemos.
 */
function mockFetchOk(datos) {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve({ ok: true, json: async () => datos })),
  );
}

beforeEach(() => {
  /*
   * Silencia el console.warn de los casos de error,
   * para que no ensucie la salida de los tests.
   */
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("useEvents", () => {
  it("carga los eventos del back y los adapta al formato de las vistas", async () => {
    mockFetchOk(eventosDelBack);
    const { events, cargarEventos } = useEvents();
    await cargarEventos();

    expect(events.value).toHaveLength(3);
    expect(events.value[0].date).toBe("28 MARZO · 20:30H");
    expect(events.value[0].meta).toEqual(["Plazas limitadas", "25,00 € / persona"]);
  });

  it("muestra 'Entrada gratuita' si el evento no tiene precio", async () => {
    mockFetchOk(eventosDelBack);
    const { events, cargarEventos } = useEvents();
    await cargarEventos();

    expect(events.value[1].meta).toEqual(["Entrada gratuita"]);
  });

  it("agrupa los eventos por mes y año", async () => {
    mockFetchOk(eventosDelBack);
    const { eventsByMonth, cargarEventos } = useEvents();
    await cargarEventos();

    expect(eventsByMonth.value).toHaveLength(2);
    expect(eventsByMonth.value[0].month).toBe("Marzo 2026");
    expect(eventsByMonth.value[0].events).toHaveLength(2);
    expect(eventsByMonth.value[1].month).toBe("Junio 2026");
  });

  it("marca errorCarga si el back responde con error", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false })));
    const { errorCarga, cargando, cargarEventos } = useEvents();
    await cargarEventos();

    expect(errorCarga.value).toBe(true);
    expect(cargando.value).toBe(false);
  });

  it("marca errorCarga si no hay conexión con el back", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("sin backend"))));
    const { errorCarga, cargando, cargarEventos } = useEvents();
    await cargarEventos();

    expect(errorCarga.value).toBe(true);
    expect(cargando.value).toBe(false);
  });

  it("cambia el estado destacado de un evento con toggleFeatured", async () => {
    mockFetchOk(eventosDelBack);
    const { events, cargarEventos, toggleFeatured } = useEvents();
    await cargarEventos();

    toggleFeatured(1);
    expect(events.value[0].featured).toBe(false);
  });
});