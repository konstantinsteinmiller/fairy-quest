import { describe, it, expect } from 'vitest'
import { useBattleRules } from '@/use/useBattleRules'
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

    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 4, left: 1 } } as GameCard
    board[1][0].card = { owner: 'npc', values: { top: 1, right: 5, bottom: 1, left: 1 } } as GameCard

    const attacker = {
      owner: 'player',
      values: { top: 6, right: 1, bottom: 1, left: 4 }
    } as GameCard

    evaluateMatchRules(['plus'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('npc')
    expect(board[1][0].card?.owner).toBe('npc')
  })

  it('Same Rule: Happy Case - Captures when values match on at least 2 sides', () => {
    const board = createBoard()

    // NPC Card Top: Bottom value is 7
    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 7, left: 1 } } as GameCard
    // NPC Card Right: Left value is 3
    board[1][2].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 1, left: 3 } } as GameCard

    const attacker = {
      owner: 'player',
      values: { top: 7, right: 3, bottom: 1, left: 1 }
    } as GameCard

    // Matches: Top (7===7), Right (3===3). Valid Same rule trigger.
    evaluateMatchRules(['same'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('player')
    expect(board[1][2].card?.owner).toBe('player')
  })

  it('Same Rule: Unhappy Case - Should NOT capture if only ONE side matches', () => {
    const board = createBoard()

    // NPC Card Top: Bottom value is 7
    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 7, left: 1 } } as GameCard
    // NPC Card Right: Left value is 5 (instead of 3)
    board[1][2].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 1, left: 5 } } as GameCard

    const attacker = {
      owner: 'player',
      values: { top: 7, right: 3, bottom: 1, left: 1 }
    } as GameCard

    // Match only on Top (7===7). Same rule requires 2+ matches.
    evaluateMatchRules(['same'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('npc')
    expect(board[1][2].card?.owner).toBe('npc')
  })

  it('Same Rule: Unhappy Case - Should NOT capture if values do NOT match', () => {
    const board = createBoard()

    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 8, left: 1 } } as GameCard
    board[1][2].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 1, left: 4 } } as GameCard

    const attacker = {
      owner: 'player',
      values: { top: 7, right: 3, bottom: 1, left: 1 }
    } as GameCard

    evaluateMatchRules(['same'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('npc')
    expect(board[1][2].card?.owner).toBe('npc')
  })

  it('Plus Rule: Should NOT capture if only ONE side matches a sum', () => {
    const board = createBoard()

    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 4, left: 1 } } as GameCard

    const attacker = {
      owner: 'player',
      values: { top: 6, right: 1, bottom: 1, left: 4 }
    } as GameCard

    evaluateMatchRules(['plus'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('npc')
  })

  it('Mixed Rules: Should capture via Standard even if Plus fails', () => {
    const board = createBoard()

    board[0][1].card = { owner: 'npc', values: { top: 1, right: 1, bottom: 4, left: 1 } } as GameCard
    board[1][0].card = { owner: 'npc', values: { top: 1, right: 5, bottom: 1, left: 1 } } as GameCard

    const attacker = {
      owner: 'player',
      values: { top: 10, right: 1, bottom: 1, left: 1 }
    } as GameCard

    evaluateMatchRules(['standard', 'plus'], { x: 1, y: 1, board, attacker })

    expect(board[0][1].card?.owner).toBe('player')
    expect(board[1][0].card?.owner).toBe('npc')
  })
})