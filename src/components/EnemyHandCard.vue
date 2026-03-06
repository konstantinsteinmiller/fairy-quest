<template lang="pug">
  div.flex.flex-col.gap-2
    h3.text-center.text-red-300 NPC
    div.flex.flex-col.gap-2
      div(
        v-for="card in cards"
        :key="card.id"
        class="opacity-80 grayscale-[0.5]"
      )
        // Showing back of the card or hidden values for NPC
        div.w-32.h-44.bg-gradient-to-br.from-red-900.to-slate-800.rounded-xl.border-2.border-red-500.flex.items-center.justify-center
          span.text-4xl 🧚
</template>

<script setup lang="ts">
import type {FairyCard} from '@/types/game'

defineProps<{
  cards: FairyCard[]
}>()
</script>