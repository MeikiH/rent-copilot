<template>
    <Icon :icon="code" />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
defineProps<{ code: string }>();
</script>