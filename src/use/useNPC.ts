import { watch, type Ref } from 'vue'
import type { GameCard, BoardSlot, GameTurn } from '@/types/game'
import { type Difficulties, DIFFICULTY } from '@/utils/enums'
import type { BattleRuleName } from '@/use/useBattleRules'

export const useNPC = (
  turn: Ref<GameTurn>,
  npcHand: Ref<GameCard[]>,
  board: Ref<BoardSlot[][]>,
  placeCard: (card: GameCard, x: number, y: number) => void,
  difficulty: Ref<Difficulties>,
  activeRules: Ref<BattleRuleName[]> // Added activeRules to context
) => {
  const makeMove = () => {
    if (turn.value !== 'npc' || npcHand.value.length === 0) return

    setTimeout(() => {
      const bestMove = calculateBestMove()
      if (bestMove) {
        const cardToPlace = npcHand.value.find(c => c.instanceId === bestMove.cardInstanceId)
        if (cardToPlace) {
          placeCard(cardToPlace, bestMove.x, bestMove.y)
        }
      }
    }, Math.random() * 500 + 500)
  }

  const calculateBestMove = () => {
    const moves: { cardInstanceId: string; x: number; y: number; score: number }[] = []

    // 1. Generate all possible placements
    npcHand.value.forEach((card) => {
      board.value.forEach((row, y) => {
        row.forEach((slot, x) => {
          if (!slot.card) {
            moves.push({ cardInstanceId: card.instanceId!, x, y, score: 0 })
          }
        })
      })
    })

    if (difficulty.value === DIFFICULTY.EASY) {
      return moves[Math.floor(Math.random() * moves.length)]
    }

    // 2. Evaluate moves for Medium/Hard
    moves.forEach((move) => {
      const card = npcHand.value.find(c => c.instanceId === move.cardInstanceId)!
      let standardCaptures = 0
      let plusCaptures = 0

      const adjacents = [
        { dx: 0, dy: -1, side: 'top' as const, opp: 'bottom' as const },
        { dx: 0, dy: 1, side: 'bottom' as const, opp: 'top' as const },
        { dx: -1, dy: 0, side: 'left' as const, opp: 'right' as const },
        { dx: 1, dy: 0, side: 'right' as const, opp: 'left' as const }
      ]

      // Logic for Plus Rule evaluation
      const sums: Map<number, { x: number; y: number }[]> = new Map()

      adjacents.forEach((adj) => {
        const nx = move.x + adj.dx
        const ny = move.y + adj.dy

        if (ny >= 0 && ny < 3 && nx >= 0 && nx < 3) {
          const target = board.value[ny][nx].card
          if (target) {
            // Standard Rule Logic
            if (activeRules.value.includes('standard') && target.owner === 'player') {
              if (card.values[adj.side] > target.values[adj.opp]) {
                standardCaptures++
              }
            }

            // Plus Rule Preparation Logic
            if (activeRules.value.includes('plus')) {
              const sum = card.values[adj.side] + target.values[adj.opp]
              if (!sums.has(sum)) sums.set(sum, [])
              sums.get(sum)!.push({ x: nx, y: ny })
            }
          }
        }
      })

      // Finalize Plus captures (needs at least 2 matching sums, and at least 1 must be enemy)
      if (activeRules.value.includes('plus')) {
        sums.forEach((positions) => {
          if (positions.length >= 2) {
            positions.forEach(pos => {
              const targetCard = board.value[pos.y][pos.x].card
              if (targetCard && targetCard.owner === 'player') {
                plusCaptures++
              }
            })
          }
        })
      }

      // Combine scores (Plus is usually higher priority in strategy games)
      move.score = standardCaptures + (plusCaptures * 1.1)

      // Hard Mode: Strategic positioning (Corners > Edges > Center)
      if (difficulty.value === DIFFICULTY.HARD) {
        if ((move.x === 0 || move.x === 2) && (move.y === 0 || move.y === 2)) move.score += 0.6
        else if (move.x === 0 || move.x === 2 || move.y === 0 || move.y === 2) move.score += 0.3
        if (move.x === 1 && move.y === 1) move.score -= 0.1
      }
    })

    // Sort by score (descending)
    moves.sort((a, b) => b.score - a.score)
    return moves[0]
  }

  watch(turn, (newTurn) => {
    if (newTurn === 'npc') makeMove()
  }, { immediate: true })
}

export default useNPC