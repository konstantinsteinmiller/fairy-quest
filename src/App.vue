<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import GameField from '@/components/GameField'

const {t} = useI18n()
</script>

<template lang="pug">
  GameField
</template>

<style scoped></style>
<style lang="sass">
p
  color: blue
$color: red
</style>

<i18n>
de:
  hello: Willkommen bei I18n
en:
  hello: Welcome to I18n
</i18n>