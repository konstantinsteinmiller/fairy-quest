<script setup lang="ts">
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
</script>

<template lang="pug">
  .container
    h1(class="text-2xl") Hello from Pug
    p Indentation-based templates are back!

  p Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias beatae doloremque dolores error explicabo incidunt laboriosam maxime modi nam, natus nobis omnis quia velit veniam voluptates. Excepturi impedit sed temporibus.

  h1 {{ t('hello') }}
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