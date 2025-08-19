<template>
  <div class="space-y-2 border-b pb-2">
    <h1 class="text-2xl font-semibold lg:text-3xl">{{ title }}</h1>
    <p class="text-muted-foreground">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})
</script>

<style scoped>

</style>