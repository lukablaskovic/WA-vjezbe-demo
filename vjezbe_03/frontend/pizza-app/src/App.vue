<script setup>
import Header from './components/Header.vue'
import PizzaCard from './components/PizzaCard.vue'
import Footer from './components/Footer.vue'

import { computed, ref, onMounted } from 'vue'

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

const kosarica = computed(() => {
  const stavke = []

  for (const pizza of pizze.value) {
    for (const velicina of velicine) {
      const kolicina = dohvatiKolicinu(pizza.id, velicina)
      if (kolicina === 0) continue

      stavke.push({
        pizzaId: pizza.id,
        naziv: pizza.naziv,
        velicina,
        kolicina,
        cijena: pizza.cijene?.[velicina] ?? 0,
      })
    }
  }

  return stavke
})
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
        <PizzaCard
          v-for="pizza in pizze"
          :key="pizza.id"
          :pizza="pizza"
          :velicine="velicine"
          :kolicine="odabir[pizza.id]"
          :format-cijena="formatCijena"
          @promijeni-kolicinu="promijeniKolicinu"
        />
      </section>

      <!-- Empty state -->
      <p v-if="pizze.length === 0" class="py-12 text-center text-stone-500">
        Trenutačno nema dostupnih pizza.
      </p>

      <Footer :kosarica="kosarica" :format-cijena="formatCijena" @ponisti-odabir="ponistiOdabir" />
    </div>
  </main>
</template>
