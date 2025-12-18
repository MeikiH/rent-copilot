<template>
  <div class="min-h-screen">
    
    <!-- <pre class="my-4 bg-black text-white p-4">{{ importData }}</pre> -->

    <StepperContainer 
        :steps="importSteps"
        title="Import Master Excel > Wipimo"
        @step-changed="onStepChanged"
        @finished="onImportFinished"
    >
      <template #default="{ currentStep }">
        <ConfigStep v-if="currentStep === 'config'" :import-data="importData" :import-type-options="importTypeOptions" :date-derniere-facturation="dateDerniereFacturation" @update-config="onUpdateConfig" />
        
        <UploadStep v-if="currentStep === 'upload'" :import-data="importData" @file-uploaded="onFileUploaded" />
        
        <FileAudit v-if="currentStep === 'audit'" :import-data="importData" />
        
        <ValidationStep v-if="currentStep === 'validation'" :import-data="importData" />
      </template>
    </StepperContainer>
  </div>
</template>

<script setup lang="ts">
import ConfigStep from './steps/ConfigStep.vue'
import UploadStep from './steps/UploadStep.vue'
import FileAudit from './steps/FileAudit.vue'
import ValidationStep from './steps/ValidationStep.vue'

definePageMeta({
    middleware: ['auth'],
    title: 'Import Master Excel > Wipimo'
})

// Define the import steps
const importSteps = [
    { 
        step_order: 0,
        step_slug: 'config',
        title: 'Configuration', 
        description: 'Paramétrer votre import',
        validationFunction: () => (
            importData.value.config.importName.length >= 3
            && importTypeOptions.value.some(opt => opt.value === importData.value.config.importType)
            && !!importData.value.config.dateReprise
            && importData.value.config.facturation_jour >= 1 && importData.value.config.facturation_jour <= 28
        )
    }, 
    { 
        step_order: 1,
        step_slug: 'upload',
        title: 'Upload', 
        description: 'Sélection du fichier Excel',
        validationFunction: () => importData.value.file && importData.value.fileData
    },
    { 
        step_order: 2,
        step_slug: 'audit',
        title: 'Validation', 
        description: 'Validation & formattage des données',
        validationFunction: () => true
    },
    { 
        step_order: 3,
        step_slug: 'validation',
        title: 'Review & Import', 
        description: 'Validation et import',
        validationFunction: () => true
    }
]

// Default configuration

// Import type options
const importTypeOptions = ref([
    { value: 'full', label: 'FULL - Fichier complet', variant: 'success' },
    { value: 'light', label: 'LIGHT - Fichier léger', variant: 'warning' }
])

// Calculate first day of next month using browser timezone
const today = new Date()
const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)

// Format date in local timezone to avoid timezone offset issues
const year = nextMonth.getFullYear()
const month = String(nextMonth.getMonth() + 1).padStart(2, '0')
const day = String(nextMonth.getDate()).padStart(2, '0')
const defaultDateReprise = `${year}-${month}-${day}`

// computed dateDerniereFacturation = defaultDateReprise minus one day
const dateDerniereFacturation = computed(() => {
  if (!importData.value.config.dateReprise) return null
  const repriseDate = new Date(importData.value.config.dateReprise)
  repriseDate.setDate(repriseDate.getDate() - 1)
  return formatDateGeneric(repriseDate)
}) as any
  
const importData = ref({
    config: {
        importName: 'Import MASTER Excel',
        importType: 'full',
        dateReprise: defaultDateReprise,
        facturation_jour: 1,
    },
    file: null,
    fileData: null,
    validationResults: {},
    importResults: {}
}) as any

// Event handlers
const onStepChanged = (stepSlug: string) => {
    console.log('Step changed to:', stepSlug)
    // StepperContainer now handles validation internally
}

// Event handlers for config updates
const onUpdateConfig = (field: string, value: any) => {
  importData.value.config[field] = value
}

// Event handlers for file upload
const onFileUploaded = (file: File | null, fileData: any) => {
  importData.value.file = file
  importData.value.fileData = fileData
}

const onImportFinished = () => {
    console.log('Import finished!')
    // Navigate to success page or show completion message
    alert('Import terminé avec succès!')
    navigateTo('/')
}
</script>