<template>
    <button class="btn">
        <Icon v-if="icon && iconPosition !== 'right'" :code="icon" class="mr-2" />
        <slot />
        <Icon v-if="icon && iconPosition === 'right'" :code="icon" class="ml-2" />
    </button>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string
  iconPosition?: string
}>();
</script>