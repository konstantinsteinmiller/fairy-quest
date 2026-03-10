import { ref, computed } from 'vue'
import type { GameCard } from '@/types/game'
import useUser from '@/use/useUser'

export interface CampaignNode {
  id: string
  name: string
  description: string
  npcDeck: string[]
  position: { x: number; y: number }
  unlocked: boolean
  completed: boolean
  unlocks: string[]
}

export const useCampaign = () => {
  const { setSettingValue, userCampaign } = useUser()

  const campaignNodes = ref<CampaignNode[]>([
    {
      id: 'forest-1',
      name: 'Forest Guardian',
      description: 'The woods are thick with ancient magic.',
      npcDeck: ['asha', 'fairy-1', 'wolf-1', 'wolf-1', 'ent-1'],
      position: { x: 20, y: 70 },
      unlocked: true,
      completed: false,
      unlocks: ['mountain-1']
    },
    {
      id: 'mountain-1',
      name: 'Stone Golem',
      description: 'A rocky path leads to a heavy opponent.',
      npcDeck: ['golem-1', 'golem-1', 'rock-1', 'rock-1', 'eagle-1'],
      position: { x: 50, y: 40 },
      unlocked: false,
      completed: false,
      unlocks: ['castle-boss']
    },
    {
      id: 'castle-boss',
      name: 'The Dark Knight',
      description: 'The final challenge awaits inside the keep.',
      npcDeck: ['knight-1', 'knight-1', 'dragon-1', 'dragon-1', 'king-1'],
      position: { x: 80, y: 20 },
      unlocked: false,
      completed: false,
      unlocks: []
    }
  ])

  // Sync with User Storage on initialization
  const syncProgress = () => {
    if (!userCampaign.value || !userCampaign.value.length) {
      setSettingValue('campaign', campaignNodes.value.map(node => ({ id: node.id, completed: node.completed })))
    } else if (userCampaign.value.constructor === Array) {
      userCampaign.value?.forEach((saved: any) => {
        const node = campaignNodes.value.find(n => n.id === saved.id)
        if (node) {
          node.completed = saved.completed
          // If a node is completed, unlock its children
          if (node.completed) {
            node.unlocks.forEach(childId => {
              const child = campaignNodes.value.find(c => c.id === childId)
              if (child) child.unlocked = true
            })
          }
        }
      })
    }
  }

  syncProgress()

  const selectedNodeId = ref<string | null>(null)

  // Dynamic active node based on selection
  const activeNode = computed(() =>
    campaignNodes.value.find(n => n.id === selectedNodeId.value) || null
  )

  const completeNode = (id: string) => {
    const node = campaignNodes.value.find(n => n.id === id)
    if (node) {
      node.completed = true
      node.unlocks.forEach(nextId => {
        const nextNode = campaignNodes.value.find(n => n.id === nextId)
        if (nextNode) nextNode.unlocked = true
      })
      setSettingValue('campaign', campaignNodes.value.map(n => ({ id: n.id, completed: n.completed })))
    }
  }

  return {
    campaignNodes,
    selectedNodeId,
    activeNode,
    completeNode
  }
}