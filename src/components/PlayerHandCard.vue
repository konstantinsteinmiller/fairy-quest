<template lang="pug">
  div.flex.flex-col.gap-2
    h3.text-center.text-blue-300 Player
    div.flex.flex-col.gap-2
      div(
        v-for="card in cards"
        :key="card.id"
        draggable="true"
        @dragstart="emit('dragstart', $event, card)"
        class="cursor-grab active:cursor-grabbing transform transition-transform hover:-translate-x-2"
      )
        FairyCardDisplay(:card="card")
</template>

<script setup lang="ts">
import type {FairyCard} from '@/types/game'
import FairyCardDisplay from '@/components/FairyCardDisplay'

defineProps<{ cards: FairyCard[] }>()
const emit = defineEmits(['dragstart'])
</script>