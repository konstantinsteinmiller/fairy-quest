<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <h1 class="text-green-400 text-2xl">You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>

  <h1>{{ t('hello') }}</h1>
</template>

<style scoped></style>
<style lang="sass">
p
  color: blue
$color: red
</style>

<i18n>
de:
  hello: Welcome to I18n
</i18n>