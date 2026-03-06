<template lang="pug">
  div.min-h-screen.bg-slate-900.text-white.p-8.flex.flex-col.items-center.justify-center.gap-8
    h1.text-3xl.font-bold.text-purple-400 Fairy Card Battle

    // Status Bar
    div.flex.gap-10.items-center.bg-slate-800.p-4.rounded-xl.shadow-lg
      div(:class="{'text-blue-400 font-bold scale-110': turn === 'player'}") Player Turn
      div.text-2xl VS
      div(:class="{'text-red-400 font-bold scale-110': turn === 'npc'}") NPC Turn

    div.flex.gap-12.items-start
      // NPC Hand
      EnemyHandCard(:cards="npcHand")

      // 3x3 Board
      div.grid.grid-cols-3.gap-2.bg-slate-700.p-2.rounded-lg.shadow-2xl
        template(v-for="(row, y) in board" :key="y")
          div.flex.gap-2(v-for="(slot, x) in row" :key="x")
            div.w-32.h-44.bg-slate-800.rounded-md.border-2.border-dashed.border-slate-600.relative(
              @dragover.prevent
              @drop="onDrop($event, x, y)"
              :class="{'border-purple-500 bg-slate-700': !slot.card}"
            )
              transition(name="flip")
                FairyCardDisplay(v-if="slot.card" :card="slot.card")

      // Player Hand
      PlayerHandCard(:cards="playerHand" @dragstart="handleDragStart")

    button.mt-4.px-6.py-2.bg-purple-600.rounded-full(@click="resetGame") Reset Game
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import type {FairyCard, BoardSlot} from '@/types/game'
import PlayerHandCard from '@/components/PlayerHandCard'
import EnemyHandCard from '@/components/EnemyHandCard'
import FairyCardDisplay from '@/components/FairyCardDisplay'

const turn = ref<'player' | 'npc'>('player')
const playerHand = ref<FairyCard[]>([])
const npcHand = ref<FairyCard[]>([])
const board = ref<BoardSlot[][]>([])

// Initialize 3x3 board
const initBoard = () => {
  board.value = Array.from({length: 3}, (_, y) =>
    Array.from({length: 3}, (_, x) => ({x, y, card: null}))
  )
}

const generateRandomCard = (owner: 'player' | 'npc'): FairyCard => ({
  id: Math.random().toString(36).substring(2, 9),
  name: 'Fairy',
  values: {
    top: Math.floor(Math.random() * 10) + 1,
    right: Math.floor(Math.random() * 10) + 1,
    bottom: Math.floor(Math.random() * 10) + 1,
    left: Math.floor(Math.random() * 10) + 1
  },
  owner
})

const resetGame = () => {
  initBoard()
  playerHand.value = Array.from({length: 5}, () => generateRandomCard('player'))
  npcHand.value = Array.from({length: 5}, () => generateRandomCard('npc'))
  turn.value = 'player'
}

// Battle Logic
const evaluateCapture = (x: number, y: number) => {
  const currentCard = board.value[y][x].card
  if (!currentCard) return

  const neighbors = [
    {dx: 0, dy: -1, curSide: 'top', oppSide: 'bottom'},
    {dx: 1, dy: 0, curSide: 'right', oppSide: 'left'},
    {dx: 0, dy: 1, curSide: 'bottom', oppSide: 'top'},
    {dx: -1, dy: 0, curSide: 'left', oppSide: 'right'}
  ]

  neighbors.forEach(({dx, dy, curSide, oppSide}) => {
    const nx = x + dx
    const ny = y + dy

    if (ny >= 0 && ny < 3 && nx >= 0 && nx < 3) {
      const targetSlot = board.value[ny][nx]
      if (targetSlot.card && targetSlot.card.owner !== currentCard.owner) {
        const attackerVal = (currentCard.values as any)[curSide]
        const defenderVal = (targetSlot.card.values as any)[oppSide]

        if (attackerVal > defenderVal) {
          targetSlot.card.owner = currentCard.owner
        }
      }
    }
  })
}

// Interaction
const handleDragStart = (event: DragEvent, card: FairyCard) => {
  if (turn.value !== 'player') return
  event.dataTransfer?.setData('cardId', card.id)
}

const onDrop = (event: DragEvent, x: number, y: number) => {
  if (turn.value !== 'player' || board.value[y][x].card) return

  const cardId = event.dataTransfer?.getData('cardId')
  const cardIndex = playerHand.value.findIndex(c => c.id === cardId)

  if (cardIndex !== -1) {
    const card = playerHand.value.splice(cardIndex, 1)[0]
    board.value[y][x].card = card
    evaluateCapture(x, y)
    turn.value = 'npc'
  }
}

// NPC AI Logic
const npcMove = () => {
  if (turn.value !== 'npc') return

  setTimeout(() => {
    // Find empty slots
    const emptySlots: { x: number, y: number }[] = []
    board.value.forEach((row, y) => {
      row.forEach((slot, x) => {
        if (!slot.card) emptySlots.push({x, y})
      })
    })

    if (emptySlots.length > 0 && npcHand.value.length > 0) {
      const randomSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)]
      const card = npcHand.value.splice(0, 1)[0]
      board.value[randomSlot.y][randomSlot.x].card = card
      evaluateCapture(randomSlot.x, randomSlot.y)
      turn.value = 'player'
    }
  }, 1000)
}

watch(turn, (newTurn) => {
  if (newTurn === 'npc') npcMove()
})

onMounted(resetGame)
</script>

<style lang="scss">
.flip-enter-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.flip-enter-from {
  transform: rotateY(180deg);
  opacity: 0;
}
</style>