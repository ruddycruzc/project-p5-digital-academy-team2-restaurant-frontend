<script setup>
import logo from "../assets/images/branding/logo-Goxu.png";

const links = [
  {
    label: "Política de privacidad",
    to: "https://factoriaf5.org/politica-de-privacidad/",
    external: true,
  },
  { label: "Aviso legal", to: "/" },
];

const developers = [
  { name: "Andrea", github: "https://github.com/AndreaVaGo" },
  { name: "Gema", github: "https://github.com/gmp395" },
  { name: "Iker", github: "https://github.com/ikerardi-dev" },
  { name: "Jenny", github: "https://github.com/Jennydev-25" },
  { name: "Juan", github: "https://github.com/JuanIsidroMenendez" },
  { name: "Ruddy", github: "https://github.com/ruddycruzc" },
];
</script>

<template>
  <footer
    class="border-t border-primary/30 bg-linear-to-r from-black/90 via-black/60 to-primary/15 px-5 py-5 text-inverse-on-surface shadow-[0_-4px_20px_rgba(194,24,91,0.15)] md:px-6 md:py-6"
  >
    <div
      class="grid w-full grid-cols-1 gap-6 text-center md:grid-cols-3 md:gap-8 md:text-left"
    >
      <div
        class="flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-start md:gap-4"
      >
        <img :src="logo" alt="Goxu" class="h-20 w-auto shrink-0" />
        <p class="font-body text-sm text-inverse-on-surface/80">
          Cocina asturiana con sabor, tradición y alma.
          <br />
          Autenticidad gastronómica en cada plato.
        </p>
      </div>

      <div class="md:pl-10">
        <h2
          class="font-ui text-label-caps font-semibold uppercase tracking-caps text-primary"
        >
          Enlaces
        </h2>

        <ul
          class="mt-2 flex flex-col items-center gap-2 font-body text-sm md:items-start"
        >
          <li v-for="link in links" :key="link.label">
            <a
              v-if="link.external"
              :href="link.to"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block origin-center transition duration-300 hover:scale-105 md:origin-left"
            >
              {{ link.label }}
            </a>

            <RouterLink
              v-else
              :to="link.to"
              class="inline-block origin-center transition duration-300 hover:scale-105 md:origin-left"
            >
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <div>
        <h2
          class="font-ui text-label-caps font-semibold uppercase tracking-caps text-primary"
        >
          Desarrollado por
        </h2>

        <ul
          class="mt-2 grid grid-cols-3 place-items-center gap-x-4 gap-y-2 font-body text-sm md:place-items-start"
        >
          <li v-for="dev in developers" :key="dev.name">
            <a
              :href="dev.github"
              target="_blank"
              rel="noopener"
              :class="[
                'group flex origin-center items-center gap-2 transition duration-300 hover:scale-105 hover:text-highlight md:origin-left',
                dev.name === 'Iker' ? 'opacity-40' : '',
              ]"
            >
              <span
                class="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 transition-colors duration-300 group-hover:bg-primary/25"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-3.5 w-3.5 fill-current"
                  aria-hidden="true"
                >
                  <path
                    d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55v-2.02c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.42.36.79 1.08.79 2.17v3.21c0 .3.21.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"
                  />
                </svg>
              </span>

              {{ dev.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <p class="mt-3 font-body text-xs text-inverse-on-surface/70">
      © 2026 Goxu. Todos los derechos reservados.
    </p>
  </footer>
</template>
