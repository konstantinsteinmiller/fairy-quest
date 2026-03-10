<template lang="pug">
  div.relative.w-screen.h-screen.bg-slate-900.overflow-hidden.flex.items-center.justify-center
    //- 1. Backgrounds
    //- Oak texture fills the entire screen
    img.absolute.inset-0.w-full.h-full.object-cover.select-none(
      src="/images/bg/oak_700x686.webp"
      alt="table-image"
    )
    //- Map stays contained within the screen, keeping its proportions
    img.absolute.inset-0.w-full.h-full.object-contain.select-none(
      src="/images/bg/campaign_map_800x710.webp"
      alt="campaign-map"
    )

    //- 2. The Interactive Node Layer
    //- Fixed: We use the exact ratio of the map image (800/710) to ensure points never drift
    div.relative.node-layer-container(
      :style="{ aspectRatio: '800 / 710' }"
      class="max-w-full max-h-full"
      :class="isLandscape ? 'h-full w-auto' : 'w-full h-auto'"
    )
      //- The Stations (Nodes)
      button.absolute.transform.transition-all.duration-300(
        v-for="node in campaignNodes"
        :key="node.id"
        :style="{ left: node.position.x + '%', top: node.position.y + '%' }"
        @click="node.unlocked && (selectedNodeId = node.id)"
        :class="[\
          '-translate-x-1/2 -translate-y-1/2',\
          node.unlocked ? 'scale-100 hover:scale-110 cursor-pointer' : 'scale-75 opacity-50 cursor-not-allowed grayscale',\
          selectedNodeId === node.id ? 'z-30' : 'z-10'\
        ]"
      )
        //- Node Visual - Shrunken for mobile (w-9 h-9)
        div.relative.w-9.h-9.rounded-full.bg-slate-800.flex.items-center.justify-center.shadow-2xl.border-2(
          class="sm:w-12 sm:h-12 sm:border-4 md:w-16 md:h-16"
          :class="node.completed ? 'border-green-400' : 'border-yellow-500'"
        )
          //- Status Icons
          span.text-base(v-if="node.completed" class="sm:text-xl") ✅
          span.text-base(v-else-if="!node.unlocked" class="sm:text-xl") 🔒
          span.text-base.animate-pulse(v-else class="sm:text-xl") ⚔️

          //- Pulsing Ring
          div.absolute.inset-0.rounded-full.animate-ping.bg-yellow-400.opacity-20(v-if="node.unlocked && !node.completed")

    //- 3. UI Overlays
    //- Changed from inset-0 to a specific bottom-left container to ensure clickability
    div.fixed.bottom-0.left-0.z-40.p-6(
      style="padding-bottom: calc(1.5rem + env(safe-area-inset-bottom)); padding-left: calc(1.5rem + env(safe-area-inset-left));"
    )
      FButton(
        type="secondary"
        size="md"
        @click="router.push({ name: 'deck' })"
      ) ◀ {{ t('back') }}

    //- 4. Popover
    NodePopup(
      v-if="activeNode"
      :node="activeNode"
      @close="selectedNodeId = null"
      @start="startBattle"
    )
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCampaign } from '@/use/useCampaign'
import NodePopup from '@/components/organisms/NodePopup'
import FButton from '@/components/atoms/FButton'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { isCampaignMatch } from '@/use/useMatch'

const { t } = useI18n()
const router = useRouter()
const { campaignNodes, selectedNodeId, activeNode } = useCampaign()

isCampaignMatch.value = true

const isLandscape = ref(window.innerWidth > window.innerHeight)
const updateOrientation = () => {
  isLandscape.value = window.innerWidth > window.innerHeight
}

onMounted(() => {
  window.addEventListener('resize', updateOrientation)
  updateOrientation()
})

onUnmounted(() => window.removeEventListener('resize', updateOrientation))

const startBattle = () => {
  router.push({ name: 'match' })
}
</script>

<style lang="sass" scoped>
.node-layer-container
  pointer-events: none

  button
    pointer-events: auto

// Redundant but safe for older browsers
.aspect-square
  aspect-ratio: auto
</style>