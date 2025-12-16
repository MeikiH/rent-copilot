<template>
  <div class="stepper-container w-full mx-auto">
    <!-- Header -->
    <StepperHeader 
      :title="steps[currentStep]?.title || title"
      :current-step="currentStep"
      :total-steps="steps.length"
    />

    <!-- Progress Bar -->
    <ProgressBar 
      :value="progress"
      label="Progression"
      class="w-1/2"
    />

    <!-- Steps Navigation -->
    <StepperHeaderNavigation 
      :steps="steps"
      :current-step="currentStep"
    />

    <!-- Step Content -->
    <div class="bg-white rounded-lg shadow-sm border min-h-96">
      <div class="p-8">
        <slot 
          :current-step="currentStep" 
          :step-data="steps[currentStep]"
          :can-proceed="canProceed"
        />
      </div>
    </div>

    <!-- Navigation -->
    <StepperNavigation
      :current-step="currentStep"
      :total-steps="steps.length"
      :can-proceed="canProceed"
      :current-step-title="steps[currentStep]?.title"
      @previous="previousStep"
      @next="nextStep"
      @finish="$emit('finished')"
    />
  </div>
</template>

<script setup lang="ts">
export interface Step {
  title: string
  description?: string
  component?: string
}

interface Props {
  steps: Step[]
  title?: string
  canProceed?: boolean
  initialStep?: number
}

const props = withDefaults(defineProps<Props>(), {
  canProceed: true,
  initialStep: 0,
  title: 'Stepper'
})

const emit = defineEmits<{
  stepChanged: [step: number]
  finished: []
}>()

const currentStep = ref(props.initialStep)

const progress = computed(() => {
  return ((currentStep.value + 1) / props.steps.length) * 100
})

const nextStep = () => {
  if (currentStep.value < props.steps.length - 1) {
    currentStep.value++
    emit('stepChanged', currentStep.value)
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    emit('stepChanged', currentStep.value)
  }
}
</script>