import { describe, it, expect } from 'vitest'
import { useBattleRules, type RuleContext } from '@/use/useBattleRules'
import type { BoardSlot, GameCard } from '@/types/game'

describe('Battle Rules Engine', () => {
  const { evaluateMatchRules } = useBattleRules()

  const createBoard = (): BoardSlot[][] =>
    Array.from({ length: 3 }, (_, y) =>
      Array.from({ length: 3 }, (_, x) => ({ x, y, card: null }))
    )

  it('Plus Rule: Captures when sums match', () => {
    const board = createBoard()

    // NPC Card Top: Bottom value is 4
    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 4, left: 1 } } as GameCard
    // NPC Card Left: Right value is 6
    board[1][0].card = { owner: 'npc', values: { top: 1, right: 6, bottom: 1, left: 1 } } as GameCard

    const attacker = {
      owner: 'player',
      values: { top: 6, right: 1, bottom: 1, left: 4 }
    } as GameCard

    // Sums: Top (6+4=10), Left (4+6=10). Match!
    evaluateMatchRules(['plus'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('player')
    expect(board[1][0].card?.owner).toBe('player')
  })

  it('Plus Rule: Unhappy Case - Should NOT capture when sums do NOT match', () => {
    const board = createBoard()

    // NPC Card Top: Bottom value is 4
    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 4, left: 1 } } as GameCard
    // NPC Card Left: Right value is 5 (instead of 6)
    board[1][0].card = { owner: 'npc', values: { top: 1, right: 5, bottom: 1, left: 1 } } as GameCard

    const attacker = {
      owner: 'player',
      values: { top: 6, right: 1, bottom: 1, left: 4 }
    } as GameCard

    // Sums: Top (6+4=10), Left (4+5=9). 10 !== 9. No Plus capture.
    evaluateMatchRules(['plus'], { x: 1, y: 1, board, attacker })

    // Owners should remain 'npc'
    expect(board[0][1].card?.owner).toBe('npc')
    expect(board[1][0].card?.owner).toBe('npc')
  })

  it('Plus Rule: Should NOT capture if only ONE side matches a sum', () => {
    const board = createBoard()

    // Only one neighbor
    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 4, left: 1 } } as GameCard

    const attacker = {
      owner: 'player',
      values: { top: 6, right: 1, bottom: 1, left: 4 }
    } as GameCard

    // Even if sum is 10, the Plus rule requires at least two sides to have the same sum.
    evaluateMatchRules(['plus'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('npc')
  })

  it('Mixed Rules: Should capture via Standard even if Plus fails', () => {
    const board = createBoard()

    // NPC Card Top: Bottom value is 4
    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 4, left: 1 } } as GameCard
    // NPC Card Left: Right value is 5
    board[1][0].card = { owner: 'npc', values: { top: 1, right: 5, bottom: 1, left: 1 } } as GameCard

    const attacker = {
      owner: 'player',
      values: { top: 10, right: 1, bottom: 1, left: 1 }
    } as GameCard

    /**
     * Rules Assessment:
     * Plus: Sum Top (10+4=14), Sum Left (1+5=6). 14 !== 6. NO.
     * Standard: Atk Top (10) > Def Bottom (4). YES.
     */
    evaluateMatchRules(['standard', 'plus'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('player') // Captured by Standard
    expect(board[1][0].card?.owner).toBe('npc')    // Remained NPC
  })
})