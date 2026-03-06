<template lang="pug">
  div.h-screen.w-screen.bg-slate-900.text-white.overflow-hidden.flex.flex-col.items-center.justify-between.p-1.touch-none(
    class="select-none"
  )
    // Main Game Layout
    div.flex.items-center.justify-center.w-full.h-full.gap-1(
      class="flex-col landscape:flex-row lg:flex-row lg:gap-4"
    )
      // NPC Hand
      div.flex-shrink-0.flex.items-center.justify-center.w-full(
        class="h-auto landscape:w-auto landscape:h-full"
      )
        EnemyHandCard(
          :cards="npcHand"
          :is-active="turn === 'npc'"
        )

      // 3x3 Board - flex-grow removed per request
      div.flex.items-center.justify-center.bg-slate-700.p-1.rounded-lg.shadow-2xl(
        class="max-w-full max-h-full sm:p-2"
      )
        div.grid.grid-cols-3.gap-1(class="sm:gap-2")
          template(v-for="(row, y) in board" :key="y")
            div.contents(v-for="(slot, x) in row" :key="x")
              div.game-slot.bg-slate-800.rounded-md.border-2.border-dashed.border-slate-600.relative.overflow-hidden(
                @dragover.prevent
                @drop="handleDrop($event, x, y)"
                @click="handleSlotTap(x, y)"
                :class="{'border-purple-500 bg-slate-700': !slot.card}"
              )
                FairyCardDisplay(v-if="slot.card" :card="slot.card")

      // Player Hand
      div.flex-shrink-0.flex.items-center.justify-center.w-full(
        class="h-auto landscape:w-auto landscape:h-full"
      )
        PlayerHandCard(
          :cards="playerHand"
          :is-active="turn === 'player'"
          :selected-id="selectedCardId"
          @dragstart="handleDragStart"
          @select="handleTapSelect"
        )

    // Minimalist Floating Reset
    button.absolute.bottom-4.right-4.bg-slate-800.rounded-full(
      @click="resetGame"
      class="p-2 opacity-40 hover:opacity-100 transition-opacity z-50"
    )
      span.text-xl 🔄
</template>

<script setup lang="ts">
import {onMounted} from 'vue'
import {useMatch} from '@/use/useMatch'
import {useNPC} from '@/use/useNPC'
import {useInteraction} from '@/use/useInteraction'
import PlayerHandCard from '@/components/PlayerHandCard'
import EnemyHandCard from '@/components/EnemyHandCard'
import FairyCardDisplay from '@/components/FairyCardDisplay'

const {turn, playerHand, npcHand, board, resetGame, placeCard} = useMatch()
const {
  selectedCardId,
  handleDragStart,
  handleDrop,
  handleTapSelect,
  handleSlotTap
} = useInteraction(playerHand, placeCard)

useNPC(turn, npcHand, board, placeCard)

onMounted(() => {
  resetGame()
})
</script>

<style lang="sass">
:root
  --board-card-size: 31vw
  --hand-card-size: 16vw

  @media (orientation: landscape)
    --board-card-size: 26vh
    --hand-card-size: 14vh

  @media (min-width: 1024px)
    --board-card-size: 160px
    --hand-card-size: 120px

.game-slot
  width: var(--board-card-size)
  height: var(--board-card-size)
  display: flex
  align-items: stretch
  justify-content: stretch

.fairy-card
  width: 100%
  height: 100%

.flex-shrink-0
  .fairy-card
    width: var(--hand-card-size)
    height: var(--hand-card-size)

.touch-none
  touch-action: none

.select-none
  user-select: none
  -webkit-tap-highlight-color: transparent
</style>