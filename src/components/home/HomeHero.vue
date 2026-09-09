<script setup>
import botellaSidra from '../../assets/images/home/hero/botella-sidra.jpeg'
import goteoSidra from '../../assets/images/home/hero/goteo-sidra.jpeg'
import vasoSidra from '../../assets/images/home/hero/vaso-sidra.jpeg'
</script>

<template>
  <section class="relative h-[250vh] overflow-hidden md:h-[220vh] lg:h-[200vh]">
    <div class="sticky top-0 h-screen overflow-hidden">
      <!-- Hero frames -->
      <div class="absolute inset-0">
        <img
          :src="botellaSidra"
          alt="Botella de sidra"
          class="absolute inset-0 h-full w-full object-cover"
        />

        <img
          :src="goteoSidra"
          alt="Sidra cayendo desde una botella"
          class="absolute inset-0 h-full w-full object-cover opacity-0"
        />

        <img
          :src="vasoSidra"
          alt="Vaso de sidra"
          class="absolute inset-0 h-full w-full object-cover opacity-0"
        />
      </div>

      <!-- Hero content -->
      <div
        class="relative z-10 flex h-full items-center justify-center px-6 text-center md:px-10 lg:px-16"
      >
        <div class="max-w-md md:max-w-xl lg:max-w-2xl">
          <h1
            class="text-4xl font-bold text-white md:text-5xl lg:text-7xl"
          >
            ¡Fartuco de sabor!
          </h1>

          <p
            class="mt-4 text-base text-white md:text-lg lg:text-xl"
          >
            Una experiencia gastronómica que une el mar Cantábrico
            y los Picos de Europa en cada bocado.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>