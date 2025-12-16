<template>
  <div class="stepper-container w-full mx-auto">
    <!-- Header -->
    <StepperHeader 
      :title="sortedSteps[currentStepIndex]?.title || title"
      :description="sortedSteps[currentStepIndex]?.description || ''"
      :current-step="currentStepIndex"
      :total-steps="sortedSteps.length"
    />

    <!-- Progress Bar -->
    <ProgressBar 
      :value="progress"
      label="Progression"
      class="w-full md:w-3/4 mx-auto"
      :height="23"
    />

    <!-- Steps Navigation -->
    <StepperHeaderNavigation 
      :steps="sortedSteps"
      :current-step="currentStepIndex"
    />

    <!-- Step Content -->
    <div class="bg-white rounded-lg shadow-sm border min-h-96">
      <div class="p-8">
        <StepperStep 
          :step-order="currentStepIndex"
          :current-step="currentStepIndex"
          :title="sortedSteps[currentStepIndex]?.title"
          :description="sortedSteps[currentStepIndex]?.description"
        >
          <slot 
            :current-step="currentStep" 
            :current-step-index="currentStepIndex"
            :step-data="sortedSteps[currentStepIndex]"
            :can-proceed="canProceed"
            :sorted-steps="sortedSteps"
          />
        </StepperStep>
      </div>
    </div>

    <!-- Navigation -->
    <StepperNavigation
      :current-step="currentStepIndex"
      :total-steps="sortedSteps.length"
      :can-proceed="canProceed"
      :current-step-title="sortedSteps[currentStepIndex]?.title"
      @previous="previousStep"
      @next="nextStep"
      @finish="$emit('finished')"
    />
  </div>
</template>

<script setup lang="ts">
export interface Step {
  step_order: number
  step_slug: string
  title: string
  description?: string
  component?: string
  validationFunction?: () => boolean
}

interface Props {
  steps: Step[]
  title?: string
  initialStep?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialStep: 0,
  title: 'Stepper'
})

const emit = defineEmits<{
  stepChanged: [step: string]
  finished: []
}>()

// Sort steps by step_order to ensure proper order
const sortedSteps = computed(() => 
  [...props.steps].sort((a, b) => a.step_order - b.step_order)
)

const currentStepIndex = ref(props.initialStep)

const currentStep = computed(() => 
  sortedSteps.value[currentStepIndex.value]?.step_slug || ''
)

const progress = computed(() => {
  return ((currentStepIndex.value + 1) / sortedSteps.value.length) * 100
})

const canProceed = computed(() => {
  const currentStepData = sortedSteps.value[currentStepIndex.value]
  if (!currentStepData?.validationFunction) return true
  return currentStepData.validationFunction()
})

const nextStep = () => {
  if (currentStepIndex.value < sortedSteps.value.length - 1) {
    currentStepIndex.value++
    emit('stepChanged', currentStep.value)
  }
}

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
    emit('stepChanged', currentStep.value)
  }
}
</script>