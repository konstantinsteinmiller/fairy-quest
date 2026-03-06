<template lang="pug">
  div.relative.w-32.h-44.rounded-xl.shadow-lg.overflow-hidden.border-4.transition-colors.duration-500(
    :class="card.owner === 'player' ? 'border-blue-500 bg-blue-900' : 'border-red-500 bg-red-900'"
  )
    // Value Grid
    div.absolute.inset-0.grid.grid-cols-3.grid-rows-3.p-2.font-black.text-xl.pointer-events-none
      div.col-start-2.text-center.self-start {{ card.values.top }}
      div.row-start-2.col-start-1.flex.items-center {{ card.values.left }}
      div.row-start-2.col-start-3.flex.items-center.justify-end {{ card.values.right }}
      div.row-start-3.col-start-2.text-center.self-end {{ card.values.bottom }}

    // Fairy Art Placeholder
    div.w-full.h-full.flex.items-center.justify-center.bg-black.bg-opacity-20
      span.text-4xl ✨
</template>

<script setup lang="ts">
import type {FairyCard} from '@/types/game'

defineProps<{ card: FairyCard }>()
</script>