<template>
    <span class="loading loading-spinner" :class="`loading-${size ?? 'xl'}`"></span>
</template>

<script setup lang="ts">
defineProps<{ size?: string }>();
</script>