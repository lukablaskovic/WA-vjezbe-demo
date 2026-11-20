<script setup>
import { computed, ref } from 'vue'
import Header from './components/Header.vue'

// Prices are stored in cents. Add an image URL to each `slika` field.
const pizze = ref([
  { id: 1, naziv: 'Margherita', cijena: 850, kolicina: 0, slika: '' },
  { id: 2, naziv: 'Capricciosa', cijena: 1050, kolicina: 0, slika: '' },
  { id: 3, naziv: 'Quattro Formaggi', cijena: 1150, kolicina: 0, slika: '' },
  { id: 4, naziv: 'Diavola', cijena: 1100, kolicina: 0, slika: '' },
  { id: 5, naziv: 'Vegetariana', cijena: 950, kolicina: 0, slika: '' },
  { id: 6, naziv: 'Prosciutto', cijena: 1250, kolicina: 0, slika: '' },
])

const valuta = new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR' })
const formatCijena = (centi) => valuta.format(centi / 100)
const ukupno = computed(() =>
  pizze.value.reduce((sum, pizza) => sum + pizza.cijena * pizza.kolicina, 0),
)
const brojPizza = computed(() => pizze.value.reduce((sum, pizza) => sum + pizza.kolicina, 0))

function promijeniKolicinu(pizza, promjena) {
  pizza.kolicina = Math.max(0, Math.min(99, pizza.kolicina + promjena))
}

function ponistiOdabir() {
  pizze.value.forEach((pizza) => {
    pizza.kolicina = 0
  })
}
</script>

<template>
  <!--Ovo je importani Header component-->
  <Header />
  <!--Ovo ispod mi je napravio AI APP.vue template-->
  <main
    lang="hr"
    class="min-h-dvh bg-stone-50 px-4 py-10 font-sans text-stone-900 sm:px-8 sm:py-16"
  >
    <div class="mx-auto max-w-5xl">
      <header class="mb-8">
        <p class="mb-2 text-xs font-bold tracking-widest text-orange-700 uppercase">Pizza meni</p>
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Odaberi svoju pizzu</h1>
        <p class="mt-3 text-sm text-stone-600">Dodaj omiljene pizze i prilagodi količinu.</p>
      </header>

      <section
        aria-label="Ponuda pizza"
        class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="pizza in pizze"
          :key="pizza.id"
          :aria-labelledby="`pizza-${pizza.id}`"
          class="flex aspect-square min-w-0 flex-col overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-colors"
          :class="
            pizza.kolicina > 0 ? 'border-orange-500 ring-1 ring-orange-500' : 'border-stone-200'
          "
        >
          <div class="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-stone-100">
            <img
              v-if="pizza.slika"
              :src="pizza.slika"
              :alt="pizza.naziv"
              class="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div
              v-else
              class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-400"
            >
              <svg
                aria-hidden="true"
                class="size-9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              <span class="text-xs">Slika pizze</span>
            </div>
            <span
              v-if="pizza.kolicina > 0"
              class="absolute top-2 right-2 rounded-full bg-orange-600 px-2.5 py-1 text-xs font-semibold text-white"
            >
              Odabrano: {{ pizza.kolicina }}
            </span>
          </div>

          <div class="shrink-0 pt-4">
            <h2
              :id="`pizza-${pizza.id}`"
              class="truncate text-lg font-semibold"
              :title="pizza.naziv"
            >
              {{ pizza.naziv }}
            </h2>
            <p class="mt-1 text-sm text-stone-500">
              Cijena
              <span class="ml-1 font-semibold text-stone-900">{{
                formatCijena(pizza.cijena)
              }}</span>
            </p>

            <div class="mt-4 flex items-center justify-between gap-2">
              <span :id="`kolicina-${pizza.id}`" class="text-sm text-stone-600">Količina</span>
              <div
                role="group"
                :aria-labelledby="`pizza-${pizza.id} kolicina-${pizza.id}`"
                class="flex items-center gap-1 rounded-xl bg-stone-100 p-1"
              >
                <button
                  type="button"
                  :aria-label="`Smanji količinu: ${pizza.naziv}`"
                  :disabled="pizza.kolicina === 0"
                  class="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-white text-xl shadow-sm transition hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:cursor-not-allowed disabled:opacity-35"
                  @click="promijeniKolicinu(pizza, -1)"
                >
                  −
                </button>
                <output
                  class="w-8 text-center text-sm font-semibold tabular-nums"
                  aria-live="polite"
                  aria-atomic="true"
                  >{{ pizza.kolicina }}</output
                >
                <button
                  type="button"
                  :aria-label="`Povećaj količinu: ${pizza.naziv}`"
                  :disabled="pizza.kolicina === 99"
                  class="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-orange-600 text-xl text-white transition hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:cursor-not-allowed disabled:opacity-35"
                  @click="promijeniKolicinu(pizza, 1)"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>

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
          @click="ponistiOdabir"
        >
          Poništi odabir
        </button>
      </footer>
    </div>
  </main>
</template>
