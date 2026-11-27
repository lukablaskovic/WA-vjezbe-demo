<script setup>
import { computed } from 'vue'

const props = defineProps({
  pizza: { type: Object, required: true },
  velicine: { type: Array, required: true },
  kolicine: { type: Object, default: () => ({}) },
  formatCijena: { type: Function, required: true },
})

const emit = defineEmits(['promijeni-kolicinu'])

function dohvatiKolicinu(velicina) {
  return props.kolicine[velicina] ?? 0
}

const brojOdabranih = computed(() =>
  props.velicine.reduce((sum, velicina) => sum + dohvatiKolicinu(velicina), 0),
)

function promijeniKolicinu(velicina, promjena) {
  emit('promijeni-kolicinu', props.pizza.id, velicina, promjena)
}
</script>

<template>
  <article
    :aria-labelledby="`pizza-${pizza.id}`"
    class="flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-colors"
    :class="brojOdabranih > 0 ? 'border-orange-500 ring-1 ring-orange-500' : 'border-stone-200'"
  >
    <div class="relative aspect-video overflow-hidden rounded-xl bg-stone-100">
      <img
        v-if="pizza.image_url"
        :src="pizza.image_url"
        :alt="pizza.naziv"
        class="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />

      <div v-else class="absolute inset-0 flex items-center justify-center text-sm text-stone-400">
        Slika pizze
      </div>

      <span
        v-if="brojOdabranih > 0"
        class="absolute top-2 right-2 rounded-full bg-orange-600 px-2.5 py-1 text-xs font-semibold text-white"
      >
        Odabrano: {{ brojOdabranih }}
      </span>
    </div>

    <div class="pt-4">
      <h2 :id="`pizza-${pizza.id}`" class="text-lg font-semibold">
        {{ pizza.naziv }}
      </h2>

      <p class="mt-1 text-sm text-stone-600">{{ pizza.opis }}</p>

      <p class="mt-2 text-xs text-stone-500">
        <span class="font-semibold">Sastojci:</span>
        {{ pizza.sastojci?.join(', ') }}
      </p>
    </div>

    <div class="mt-4 space-y-3 border-t border-stone-100 pt-4">
      <div
        v-for="velicina in velicine"
        :key="velicina"
        class="flex items-center justify-between gap-2"
      >
        <div>
          <p class="text-sm font-medium capitalize">{{ velicina }}</p>
          <p class="text-sm font-semibold text-orange-700">
            {{ formatCijena(pizza.cijene[velicina]) }}
          </p>
        </div>

        <div
          role="group"
          :aria-label="`${pizza.naziv} - ${velicina}`"
          class="flex items-center gap-1 rounded-xl bg-stone-100 p-1"
        >
          <button
            type="button"
            :aria-label="`Smanji količinu: ${pizza.naziv}, ${velicina}`"
            :disabled="dohvatiKolicinu(velicina) === 0"
            class="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-white text-xl shadow-sm transition hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:cursor-not-allowed disabled:opacity-35"
            @click="promijeniKolicinu(velicina, -1)"
          >
            −
          </button>

          <output
            class="w-8 text-center text-sm font-semibold tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {{ dohvatiKolicinu(velicina) }}
          </output>

          <button
            type="button"
            :aria-label="`Povećaj količinu: ${pizza.naziv}, ${velicina}`"
            :disabled="dohvatiKolicinu(velicina) === 99"
            class="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-orange-600 text-xl text-white transition hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:cursor-not-allowed disabled:opacity-35"
            @click="promijeniKolicinu(velicina, 1)"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
