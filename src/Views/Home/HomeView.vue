<script setup>
import { computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import HeroSection from "../../components/HeroSection.vue";
import SpecialtiesSection from "../../components/SpecialtiesSection.vue";
import EventsSection from "../../components/EventsSection.vue";
import ContactForm from "../../components/ContactForm.vue";
import { useProducts } from "@/composables/useProducts";
import { useEvents } from "@/composables/useEvents";

const { products, cargarProductos } = useProducts();

const dishes = computed(() =>
  products.value.filter((p) => p.featured),
);

const { events: allEvents, cargarEventos } = useEvents();

const events = computed(() => {
  const now = new Date();

  return allEvents.value.filter(
    (e) => e.featured && new Date(e.eventDate) > now,
  );
});

const observers = [];

onMounted(async () => {
  await Promise.all([
    cargarProductos(),
    cargarEventos(),
  ]);

  await nextTick();

  const sections = document.querySelectorAll(".home-reveal");

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px",
  };

  sections.forEach((section) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          // Solo necesitamos animarlo una vez.
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    observer.observe(section);
    observers.push(observer);
  });
});

onBeforeUnmount(() => {
  observers.forEach((observer) => observer.disconnect());
});
</script>

<template>
  <main
    class="home flex w-full flex-col animate-[fade-in-up_0.6s_ease-out]"
  >
    <div class="atmosphere-wrapper relative">

      <!-- HERO -->
      <section class="home-reveal hero-reveal">
        <HeroSection />
      </section>

      <!-- ESPECIALIDADES -->
      <section class="home-reveal section-reveal">
        <SpecialtiesSection :dishes="dishes" />
      </section>

      <!-- EVENTOS -->
      <section class="home-reveal section-reveal section-delay">
        <EventsSection :events="events" />
      </section>

      <!-- CONTACTO -->
      <section class="home-reveal section-reveal">
        <ContactForm />
      </section>

    </div>
  </main>
</template>

<style scoped>
.atmosphere-wrapper {
  background-image: url("/home-img/home-background.png");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 150% auto;
  background-position: 88% center;
}


@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.home-reveal {
  opacity: 0;
  transform: translateY(35px);
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}

.home-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}


.hero-reveal {
  transform: translateY(20px);
  transition-duration: 0.9s;
}



.section-reveal {
  transition-duration: 0.8s;
}

.section-delay {
  transition-delay: 0.08s;
}

@media (max-width: 767px) {
  .atmosphere-wrapper {
    background-image: url("/home-img/home-background.png");
    background-repeat: no-repeat;
    background-size: auto 100%;
    background-position: 78% top;
    overflow: clip;
  }

  .home-reveal {
    transform: translateY(25px);
    transition-duration: 0.7s;
  }
}


@media (prefers-reduced-motion: reduce) {
  .home,
  .home-reveal {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
</style>