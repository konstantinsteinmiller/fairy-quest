<template lang="pug">
  div.fixed.inset-0.flex.items-center.justify-center.backdrop-blur-sm.p-4(
    v-if="isOpen"
    class="z-[100] bg-black/30 font-[Ribeye]"
  )
    div.relative.p-6.shadow-2xl.text-center.transform.transition-all(
      class="min-w-[280px] max-w-[90vw] sm:p-8 bg-black/80"
    )
      //- Modal frame image  scale-y-[112%] scale-x-[103%]
      img.absolute.inset-0.w-full.h-full.pointer-events-none(
        src="/images/frames/fancy-frame-wide_1024x722.png"
        class="z-0 scale-y-[112%] scale-x-[112%] object-fill"
      )

      //- Content Container - Set to z-10 to stay above the frame
      div.relative.z-10
        //- Result Header
        h2.font-black.uppercase.italic.tracking-tighter.mb-2.text-outline(
          class="text-2xl sm:text-5xl"
          :class="[result === 'win' ? 'text-blue-400' : result === 'lose' ? 'text-red-400' : 'text-slate-300']"
        ) {{ t(result) }}

        //- Score Display
        div.flex.items-center.justify-center.gap-6.my-6
          div.flex.flex-col.items-center
            span.text-2xl 👹
            span.text-3xl.font-bold {{ scores.npc }}
          div.text-2xl.font-italic.text-slate-500 VS
          div.flex.flex-col.items-center
            span.text-2xl 🧚
            span.text-3xl.font-bold {{ scores.player }}

        //- Action Buttons
        div.flex.flex-col.gap-2
          button.w-full.py-3.px-6.rounded-full.font-bold.uppercase.tracking-widest.transition-all(
            @click="emit('reset')"
            class="bg-white text-black hover:scale-105 active:scale-95 shadow-lg"
          ) {{ t('playAgain') }}

          button.w-full.py-3.px-6.rounded-full.font-bold.uppercase.tracking-widest.transition-all(
            @click="emit('reset'); emit('backToMainMenu')"
            class="bg-gray-400 text-black hover:scale-105 active:scale-95 shadow-lg"
          ) {{ t('backToMainMenu') }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  isOpen: boolean
  scores: { player: number; npc: number }
}>()

const emit = defineEmits(['reset', 'backToMainMenu'])

const result = computed(() => {
  if (props.scores.player > props.scores.npc) return 'win'
  if (props.scores.npc > props.scores.player) return 'lose'
  return 'draw'
})
</script>

<style lang="sass" scoped>
.text-outline
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000
</style>

<i18n>
en:
  win: "Victory"
  lose: "Defeat"
  draw: "Draw"
  playAgain: "Play Again"
  backToMainMenu: "Back to Main Menu"
de:
  win: "Sieg"
  lose: "Niederlage"
  draw: "Unentschieden"
  playAgain: "Nochmal spielen"
  backToMainMenu: "Zurück zum Hauptmenü"
</i18n>