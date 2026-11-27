<script setup>
import { computed } from 'vue'

const props = defineProps({
  kosarica: { type: Array, required: true },
  formatCijena: { type: Function, required: true },
})

const emit = defineEmits(['ponisti-odabir'])

const brojPizza = computed(() => props.kosarica.reduce((broj, stavka) => broj + stavka.kolicina, 0))

const ukupno = computed(() =>
  props.kosarica.reduce((iznos, stavka) => iznos + stavka.cijena * stavka.kolicina, 0),
)
</script>

<template>
  <footer
    class="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5"
  >
    <div aria-live="polite" aria-atomic="true">
      <p class="text-sm text-stone-500">Broj pizza: {{ brojPizza }}</p>
      <p class="mt-1 text-xl font-bold">Ukupno: {{ formatCijena(ukupno) }}</p>
    </div>

    <button
      type="button"
      :disabled="brojPizza === 0"
      class="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
      @click="emit('ponisti-odabir')"
    >
      Poništi odabir
    </button>
  </footer>
</template>
