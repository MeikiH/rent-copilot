<template>
  <div class="form-control">
    
    <fieldset class="fieldset p-0">
      <legend class="fieldset-legend text-sm text-left" v-if="label">{{ label }}</legend>
        
      <input 
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue',($event.target as HTMLInputElement)?.value)"
        class="input input-bordered w-full"
        :class="inputClasses"
        :required="required"
        :disabled="disabled"
      />
      
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
  modelValue: string
  type?: string
  label?: string
  placeholder?: string
  error?: string
  helper?: string
  required?: boolean
  disabled?: boolean
  variant?: 'default' | 'error' | 'success' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  variant: 'default',
  required: false,
  disabled: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputClasses = computed(() => ({
  'input-error': props.variant === 'error' || !!props.error,
  'input-success': props.variant === 'success',
  'input-warning': props.variant === 'warning',
  'input-disabled': props.disabled
}))
</script>