<template lang="pug">
  div.h-screen.w-screen.bg-slate-200.flex.items-center.justify-center.p-4
    div.relative.p-10.flex.flex-col.gap-4.text-center.shadow-2xl(
      class="bg-black/30 min-w-[320px] max-w-lg"
    )
      div.flex.flex-col.gap-4.relative.z-10
        button.menu-btn(@click="emit('play')") {{ t('play') }}
        button.menu-btn.bg-slate-700(@click="showOptions = true") {{ t('options') }}
        button.menu-btn(class="bg-red-900/50" @click="quitGame") {{ t('quit') }}

    OptionsModal(
      :is-open="showOptions"
      @close="showOptions = false"
    )
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import OptionsModal from '@/components/organisms/OptionsModal'

const { t } = useI18n()
const emit = defineEmits(['play'])

const showOptions = ref(false)

const quitGame = () => {
  if (window.confirm(t('confirmQuit'))) window.close()
}
</script>

<style lang="sass" scoped>
.menu-btn
  @apply py-4 px-8 rounded-full bg-white text-black font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95

.text-outline
  text-shadow: 3px 3px 0 #000
</style>

<i18n>
en:
  play: "Enter Battle"
  options: "Options"
  quit: "Abandon"
  confirmQuit: "Do you wish to leave the realm?"
de:
  play: "In die Schlacht"
  options: "Optionen"
  quit: "Aufgeben"
  confirmQuit: "Möchtest du das Reich verlassen?"
</i18n>