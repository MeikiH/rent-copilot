<template>
  <div class="form-control">
    
    <fieldset class="fieldset p-0">
      <legend class="fieldset-legend text-sm text-left">{{ label }}</legend>
        
      <select 
        :value="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement)?.value)"
        class="select select-bordered w-full"
        :class="selectClasses"
        :required="required"
        :disabled="disabled"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option 
          v-for="option in options" 
          :key="option.value" 
          :value="option.value"
          :class="getOptionClasses(option.variant)"
        >
          {{ option.label }}
        </option>
      </select>
      
      <!-- DaisyUI Validator -->
      <div v-if="error" class="label -mt-1">
        <span class="label-text-alt text-error">{{ error }}</span>
      </div>
      
      <div v-if="helper && !error" class="label -mt-1">
        <span class="label-text-alt">{{ helper }}</span>
      </div>

    </fieldset>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
  label?: string
  placeholder?: string
  options: any[]
  error?: string
  helper?: string
  required?: boolean
  disabled?: boolean
  variant?: 'default' | 'error' | 'success' | 'warning' | 'primary'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  required: false,
  disabled: false,
  options: () => []
})

defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const selectClasses = computed(() => ({
  'select-error': props.variant === 'error' || !!props.error,
  'select-success': props.variant === 'success',
  'select-warning': props.variant === 'warning',
  'select-primary': props.variant === 'primary',
  'select-disabled': props.disabled
}))

const getOptionClasses = (variant?: string) => {
  if (!variant) return ''
  
  return {
    'text-error': variant === 'error',
    'text-success': variant === 'success',
    'text-warning': variant === 'warning',
    'text-primary': variant === 'primary'
  }
}
</script>