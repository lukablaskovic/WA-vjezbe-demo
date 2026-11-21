<script setup>
import { computed, ref, onMounted } from 'vue'
import Header from './components/Header.vue'

import { getPizze, getPizzaByNaziv } from './api/pizze.js'

const pizze = ref([]) // vue.js varijabla

onMounted(async () => {
  // dohvati pizze sa backenda kada učitam stranicu (onMounted)
  // kada učitam stranicu, pošalji HTTP GET zahtjev na /pizze

  pizze.value = await getPizze()
  console.log('Dohvaćene pizze:', pizze.value)
})

const odabir = ref({})

const velicine = ['mala', 'srednja', 'jumbo']

const valuta = new Intl.NumberFormat('hr-HR', {
  style: 'currency',
  currency: 'EUR',
})

const formatCijena = (cijena) => valuta.format(cijena)

function dohvatiKolicinu(pizzaId, velicina) {
  return odabir.value[pizzaId]?.[velicina] ?? 0
}

function brojOdabranih(pizzaId) {
  return velicine.reduce((sum, velicina) => sum + dohvatiKolicinu(pizzaId, velicina), 0)
}

const brojPizza = computed(() =>
  pizze.value.reduce((sum, pizza) => sum + brojOdabranih(pizza.id), 0),
)

const ukupno = computed(() =>
  pizze.value.reduce(
    (sum, pizza) =>
      sum +
      velicine.reduce(
        (subtotal, velicina) =>
          subtotal + (pizza.cijene?.[velicina] ?? 0) * dohvatiKolicinu(pizza.id, velicina),
        0,
      ),
    0,
  ),
)

function promijeniKolicinu(pizzaId, velicina, promjena) {
  if (!odabir.value[pizzaId]) {
    odabir.value[pizzaId] = {
      mala: 0,
      srednja: 0,
      jumbo: 0,
    }
  }

  const trenutna = odabir.value[pizzaId][velicina]

  odabir.value[pizzaId][velicina] = Math.max(0, Math.min(99, trenutna + promjena))
}

function ponistiOdabir() {
  odabir.value = {}
}
</script>

<template>
  <Header />

  <main
    lang="hr"
    class="min-h-dvh bg-stone-50 px-4 py-10 font-sans text-stone-900 sm:px-8 sm:py-16"
  >
    <div class="mx-auto max-w-5xl">
      <header class="mb-8">
        <p class="mb-2 text-xs font-bold tracking-widest text-orange-700 uppercase">Pizza meni</p>
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Odaberi svoju pizzu</h1>
        <p class="mt-3 text-sm text-stone-600">
          Odaberi veličinu i količinu svojih omiljenih pizza.
        </p>
      </header>

      <section
        aria-label="Ponuda pizza"
        class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="pizza in pizze"
          :key="pizza.id"
          :aria-labelledby="`pizza-${pizza.id}`"
          class="flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-colors"
          :class="
            brojOdabranih(pizza.id) > 0
              ? 'border-orange-500 ring-1 ring-orange-500'
              : 'border-stone-200'
          "
        >
          <!-- Pizza image -->
          <div class="relative aspect-video overflow-hidden rounded-xl bg-stone-100">
            <img
              v-if="pizza.image_url"
              :src="pizza.image_url"
              :alt="pizza.naziv"
              class="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />

            <div
              v-else
              class="absolute inset-0 flex items-center justify-center text-sm text-stone-400"
            >
              Slika pizze
            </div>

            <span
              v-if="brojOdabranih(pizza.id) > 0"
              class="absolute top-2 right-2 rounded-full bg-orange-600 px-2.5 py-1 text-xs font-semibold text-white"
            >
              Odabrano: {{ brojOdabranih(pizza.id) }}
            </span>
          </div>

          <!-- Pizza information -->
          <div class="pt-4">
            <h2 :id="`pizza-${pizza.id}`" class="text-lg font-semibold">
              {{ pizza.naziv }}
            </h2>

            <p class="mt-1 text-sm text-stone-600">
              {{ pizza.opis }}
            </p>

            <p class="mt-2 text-xs text-stone-500">
              <span class="font-semibold">Sastojci:</span>
              {{ pizza.sastojci?.join(', ') }}
            </p>
          </div>

          <!-- Pizza sizes and quantities -->
          <div class="mt-4 space-y-3 border-t border-stone-100 pt-4">
            <div
              v-for="velicina in velicine"
              :key="velicina"
              class="flex items-center justify-between gap-2"
            >
              <div>
                <p class="text-sm font-medium capitalize">
                  {{ velicina }}
                </p>

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
                  :disabled="dohvatiKolicinu(pizza.id, velicina) === 0"
                  class="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-white text-xl shadow-sm transition hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:cursor-not-allowed disabled:opacity-35"
                  @click="promijeniKolicinu(pizza.id, velicina, -1)"
                >
                  −
                </button>

                <output
                  class="w-8 text-center text-sm font-semibold tabular-nums"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {{ dohvatiKolicinu(pizza.id, velicina) }}
                </output>

                <button
                  type="button"
                  :aria-label="`Povećaj količinu: ${pizza.naziv}, ${velicina}`"
                  :disabled="dohvatiKolicinu(pizza.id, velicina) === 99"
                  class="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-orange-600 text-xl text-white transition hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:cursor-not-allowed disabled:opacity-35"
                  @click="promijeniKolicinu(pizza.id, velicina, 1)"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>

      <!-- Empty state -->
      <p v-if="pizze.length === 0" class="py-12 text-center text-stone-500">
        Trenutačno nema dostupnih pizza.
      </p>

      <!-- Order summary -->
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
