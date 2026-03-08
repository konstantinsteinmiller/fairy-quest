<template lang="pug">
  div.fixed.inset-0.flex.items-center.justify-center.backdrop-blur-sm.p-4(
    v-if="isOpen"
    class="z-[100] bg-black/30"
  )
    div.relative.p-6.shadow-2xl.text-center.transform.transition-all(
      class="min-w-[280px] max-w-[90vw] sm:p-8 bg-black/80"
    )
      //- The reusable fancy frame
      img.absolute.inset-0.w-full.h-full.pointer-events-none(
        src="/images/frames/fancy-frame_512x512.webp"
        class="z-0 scale-y-[112%] scale-x-[108%] object-fill"
      )

      //- Content Slot
      div.relative.z-10
        slot
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()
</script>

<style lang="sass" scoped>
// Global modal text outline style can be shared here
:deep(.text-outline)
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000
</style>