<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import botellaSidra from "../../assets/images/home/hero/botella-sidra.jpeg";
import goteoSidra from "../../assets/images/home/hero/goteo-sidra.jpeg";
import vasoSidra from "../../assets/images/home/hero/vaso-sidra.jpeg";

//ANIMACIONES AL HACER SCROLL
const scrollProgress = ref(0);

const updateScrollProgress = () => {
  const hero = document.querySelector(".home-hero");

  if (!hero) return;

  const heroTop = hero.offsetTop;
  const heroHeight = hero.offsetHeight;
  const scrollPosition = window.scrollY;

  const progress =
    (scrollPosition - heroTop) / (heroHeight - window.innerHeight);

  scrollProgress.value = Math.min(Math.max(progress, 0), 1);
};

const getOpacity = (frame) => {
  const progress = scrollProgress.value;

  if (frame === 1) {
    return Math.max(0, 1 - progress * 2.5);
  }

  if (frame === 2) {
    return Math.max(0, 1 - Math.abs(progress - 0.5) * 4);
  }

  if (frame === 3) {
    return Math.min(1, Math.max(0, (progress - 0.6) * 2.5));
  }

  return 0;
};

onMounted(() => {
  window.addEventListener("scroll", updateScrollProgress, {
    passive: true,
  });

  updateScrollProgress();
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateScrollProgress);
});
</script>

<template>
  <section
    class="home-hero relative h-[250vh] overflow-hidden md:h-[220vh] lg:h-[200vh]"
  >
    <div class="sticky top-0 h-screen overflow-hidden">
      <!-- Hero animacion -->
      <div class="absolute inset-0">
        <img
          :src="botellaSidra"
          alt="Botella de sidra"
          class="absolute inset-0 h-full w-full object-cover"
          :style="{ opacity: getOpacity(1) }"
        />

        <img
          :src="goteoSidra"
          alt="Sidra cayendo desde una botella"
          class="absolute inset-0 h-full w-full object-cover"
          :style="{ opacity: getOpacity(2) }"
        />

        <img
          :src="vasoSidra"
          alt="Vaso de sidra"
          class="absolute inset-0 h-full w-full object-cover"
          :style="{ opacity: getOpacity(3) }"
        />
      </div>

      <div
        class="pointer-events-none absolute inset-0 z-[5] bg-[var(--color-primary)]/15"
      ></div>

      <!-- Hero texto -->
      <div
        class="relative z-10 flex h-full items-center justify-center px-6 text-center md:px-10 lg:px-16"
      >
        <div class="max-w-md md:max-w-xl lg:max-w-2xl">
          <h1
            class="font-headline text-5xl font-semibold text-[var(--color-on-primary)] md:text-6xl lg:text-8xl"
          >
            ¡Fartuco de sabor!
          </h1>

          <p
            class="mt-4 font-body text-base text-[var(--color-on-primary)] md:text-lg lg:text-xl"
          >
            Una experiencia gastronómica que une el mar Cantábrico y los Picos de Europa en cada bocado.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
