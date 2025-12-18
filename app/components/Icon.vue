<template>
    <Icon :icon="code || 'mdi:question-mark-rhombus-outline'" />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
defineProps<{ code: string | undefined }>();
</script>