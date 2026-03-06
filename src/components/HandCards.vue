<script setup lang="ts">
import type {FairyCard} from '@/types/game'

defineProps<{
  cards: FairyCard[]
  isPlayer?: boolean
}>()

const emit = defineEmits<{
  (e: 'dragstart', event: DragEvent, card: FairyCard): void
}>()
</script>