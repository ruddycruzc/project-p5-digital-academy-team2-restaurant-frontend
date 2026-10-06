import { describe, it, expect, vi, beforeEach } from "vitest";
import { useOffers } from "../../composables/useOffers";

/*
 * Ofertas de ejemplo con el mismo formato que devuelve el back (GET /api/offers).
 * Una destacada (featured) y dos de temporada, una de ellas sin precio.
 */
const ofertasDelBack = [
  {
    id: 1,
    title: "Maridaje de Autor",
    description: "Menú degustación con vinos",
    image: "/offers-img/maridaje.png",
    badge: "Exclusivo",
    featured: true,
    price: 85,
  },
  {
    id: 2,
    title: "Menú de temporada",
    description: "Productos de la huerta",
    image: "/offers-img/temporada.png",
    badge: null,
    featured: false,
    price: 30,
  },
  {
    id: 3,
    title: "Visita a la bodega",
    description: "Recorrido guiado",
    image: "/offers-img/bodega.png",
    badge: "Nuevo",
    featured: false,
    price: null,
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

describe("useOffers", () => {
  it("carga las ofertas del back y adapta precio y texto del botón", async () => {
    mockFetchOk(ofertasDelBack);
    const { offers, cargarOfertas } = useOffers();
    await cargarOfertas();

    expect(offers.value).toHaveLength(3);
    expect(offers.value[0].price).toBe("85,00 € / persona");
    expect(offers.value[0].cta).toBe("RESERVA AHORA");
  });

  it("deja el precio a null si la oferta no tiene precio", async () => {
    mockFetchOk(ofertasDelBack);
    const { offers, cargarOfertas } = useOffers();
    await cargarOfertas();

    expect(offers.value[2].price).toBeNull();
  });

  it("separa la oferta destacada de las de temporada", async () => {
    mockFetchOk(ofertasDelBack);
    const { featuredOffer, seasonalOffers, cargarOfertas } = useOffers();
    await cargarOfertas();

    expect(featuredOffer.value.title).toBe("Maridaje de Autor");
    expect(seasonalOffers.value).toHaveLength(2);
    expect(seasonalOffers.value.every((o) => !o.featured)).toBe(true);
  });

  it("marca errorCarga si el back responde con error", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false })));
    const { errorCarga, cargando, cargarOfertas } = useOffers();
    await cargarOfertas();

    expect(errorCarga.value).toBe(true);
    expect(cargando.value).toBe(false);
  });

  it("marca errorCarga si no hay conexión con el back", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("sin backend"))));
    const { errorCarga, cargando, cargarOfertas } = useOffers();
    await cargarOfertas();

    expect(errorCarga.value).toBe(true);
    expect(cargando.value).toBe(false);
  });
});