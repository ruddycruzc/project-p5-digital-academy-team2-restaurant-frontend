import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../composables/useAuth";
import Home from "../Views/Home/HomeView.vue";
import LoginView from "../Views/Auth/LoginView.vue";
import RegisterView from "../Views/Auth/RegisterView.vue";
import CartView from "../Views/Cart/CartView.vue";
import MyAccountView from "../Views/Account/MyAccountView.vue";
import CustomerProfileView from "../Views/Account/CustomerProfileView.vue";
import AdminLayout from "../layouts/AdminLayout.vue";
import AdminDashboardView from "../Views/Admin/Dashboard/AdminDashboardView.vue";
import AdminProductsView from "../Views/Admin/Products/AdminProductsView.vue";
import AdminOrdersView from "../Views/Admin/Orders/AdminOrdersView.vue";
import AdminBillingView from "../Views/Admin/Billing/AdminBillingView.vue";
import AdminWelcomeView from "../Views/Welcome/AdminWelcomeView.vue";
import ProductDetailView from "../Views/Menu/ProductDetailView.vue";
import ReservationView from "../Views/Reservation/ReservationView.vue";
import CartaView from "../Views/Menu/CartaView.vue";
import KitchenDashboardView from "../Views/Kitchen/KitchenDashboardView.vue";
import SpecialOffersView from "../Views/SpecialOffers/SpecialOffersView.vue";
import EventsCalendarView from "../Views/Events/EventsCalendarView.vue";
import PaymentView from "../Views/Payment/PaymentView.vue";
import DeliveryLayout from "../layouts/DeliveryLayout.vue";
import DeliveryDashboardView from "../Views/Delivery/DeliveryDashboardView.vue";
import DeliveryOrdersView from "../Views/Delivery/DeliveryOrdersView.vue";
import PublicLayout from "../layouts/PublicLayout.vue";
import NotFoundView from "../Views/NotFound/NotFoundView.vue";
import OrderTrackingView from "../Views/OrderTracking/OrderTrackingView.vue";

const routes = [
  {
    path: "/",
    component: PublicLayout,
    children: [
      {
        path: "",
        name: "home",
        component: Home,
        alias: "/home",
      },
      {
        path: "login",
        name: "login",
        component: LoginView,
      },
      {
        path: "register",
        name: "register",
        component: RegisterView,
      },
      {
        path: "cart",
        name: "cart",
        component: CartView,
      },
      {
        path: "account",
        name: "account",
        component: MyAccountView,
        meta: { roles: ["CUSTOMER"] },
      },
      {
        path: "account/profile",
        name: "customer-profile",
        component: CustomerProfileView,
        meta: { roles: ["CUSTOMER"] },
      },
      {
        path: "product/:id",
        name: "product-detail",
        component: ProductDetailView,
      },
      {
        path: "carta",
        name: "carta",
        component: CartaView,
      },
      {
        path: "ofertas-eventos",
        name: "special-offers",
        component: SpecialOffersView,
      },
      {
        path: "calendario-eventos",
        name: "events-calendar",
        component: EventsCalendarView,
      },
      {
        path: "payment",
        name: "payment",
        component: PaymentView,
      },
      {
        path: "rastreo",
        name: "order-tracking",
        component: OrderTrackingView,
        meta: { roles: ["CUSTOMER"] },
      },
      {
        path: "reservation",
        name: "reservation",
        component: ReservationView,
      },
      {
        /*
          Ruta catch-all: atrapa cualquier dirección que no coincida con otra ruta.
          Vue Router prioriza las rutas más específicas, así que esta solo se usa
          cuando ninguna otra encaja. Al ser hija de PublicLayout, muestra cabecera y pie.
          No lleva meta.roles, así que el guardia de navegación la deja pasar sin sesión.
        */
        path: ":pathMatch(.*)*",
        name: "not-found",
        component: NotFoundView,
      },
    ],
  },
  {
    path: "/admin/welcome",
    name: "admin-welcome",
    component: AdminWelcomeView,
    meta: { roles: ["ADMIN"] },
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { roles: ["ADMIN"] },
    children: [
      { path: "", name: "admin-dashboard", component: AdminDashboardView },
      {
        path: "productos",
        name: "admin-products",
        component: AdminProductsView,
      },
      { path: "pedidos", name: "admin-orders", component: AdminOrdersView },
      {
        path: "facturacion",
        name: "admin-billing",
        component: AdminBillingView,
      },
    ],
  },
  {
    path: "/cocina",
    name: "kitchen-dashboard",
    component: KitchenDashboardView,
    meta: { roles: ["KITCHEN"] },
  },
  {
    path: "/motorista",
    component: DeliveryLayout,
    meta: { roles: ["DELIVERY"] },
    children: [
      {
        path: "",
        name: "delivery-dashboard",
        component: DeliveryDashboardView,
      },
      {
        path: "entregas",
        name: "delivery-orders",
        component: DeliveryOrdersView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const requiredRoles = to.meta.roles;

  if (!requiredRoles) {
    return true;
  }

  const { loadUser } = useAuth();

  try {
    const user = await loadUser();

    if (!user) {
      return {
        name: "login",
        query: { redirect: to.fullPath },
      };
    }

    const hasRequiredRole = user.roles?.some((role) =>
      requiredRoles.includes(role),
    );

    if (!hasRequiredRole) {
      return { name: "home" };
    }

    return true;
  } catch (error) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }
});

export default router;
