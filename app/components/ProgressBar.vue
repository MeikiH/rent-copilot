<template>
  <div class="progress-bar mb-8" v-bind="$attrs">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-700">{{ label }}</span>
      <span class="text-sm text-gray-500">{{ Math.round(value) }}{{ unit }}</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full" :class="heightClass">
      <div 
        class="rounded-full transition-all duration-300 ease-out"
        :class="[colorClass, heightClass]"
        :style="{ width: `${value}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

interface Props {
  value: number
  label?: string
  unit?: string
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo'
  size?: 'sm' | 'md' | 'lg'
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Progression',
  unit: '%',
  color: 'blue',
  size: 'md',
  max: 100
})

const heightClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-1'
    case 'lg': return 'h-3'
    default: return 'h-2'
  }
})

const colorClass = computed(() => {
  switch (props.color) {
    case 'green': return 'bg-success'
    case 'red': return 'bg-error'
    case 'yellow': return 'bg-warning'
    case 'purple': return 'bg-secondary'
    case 'indigo': return 'bg-accent'
    default: return 'bg-primary'
  }
})
</script>