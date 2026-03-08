<template lang="pug">
  Modal(:is-open="isOpen")
    h2.text-3xl.font-black.uppercase.italic.mb-6.text-outline.text-blue-300 {{ t('difficulty') }}

    div.flex.flex-col.gap-4
      button.diff-btn(
        v-for="d in ['easy', 'medium', 'hard']"
        :key="d"
        :class="[difficulty === d ? 'bg-blue-600 ring-2 ring-white' : 'bg-slate-700']"
        @click="setDifficulty(d)"
      ) {{ t(d) }}

      hr.border-slate-600.my-2

      button.w-full.py-3.px-6.rounded-full.font-bold.uppercase.tracking-widest.transition-all(
        @click="emit('close')"
        class="bg-white text-black hover:scale-105 active:scale-95 shadow-lg"
      ) {{ t('close') }}
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Modal from '@/components/molecules/Modal'
import { useMatch } from '@/use/useMatch'

defineProps<{
  isOpen: boolean
}>()
const emit = defineEmits(['close'])

const { t } = useI18n()
const { difficulty } = useMatch()
const setDifficulty = (d) => {
  difficulty.value = d
}
</script>

<style lang="sass" scoped>
.diff-btn
  @apply py-3 px-6 rounded-lg uppercase font-bold transition-all hover:brightness-125
</style>

<i18n>
en:
  difficulty: "AI Difficulty"
  easy: "Novice"
  medium: "Squire"
  hard: "Master"
  close: "Save & Close"
de:
  difficulty: "KI Schwierigkeit"
  easy: "Anfänger"
  medium: "Knappe"
  hard: "Meister"
  close: "Speichern & Schließen"
</i18n>