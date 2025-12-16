<template>
  <div class="min-h-screen">
    <StepperContainer 
      :steps="importSteps"
      title="Import Master Excel > Wipimo"
      @step-changed="onStepChanged"
      @finished="onImportFinished"
    >
      <template #default="{ currentStep, sortedSteps }">
        
        <!-- Step 0: Upload Excel File -->
        <div v-if="currentStep === 'upload'">
          <div class="text-6xl mb-4">
            <Icon code="mdi:file-excel" class="text-success mx-auto" />
          </div>
          <h3 class="text-xl font-medium text-base-content mb-4 text-center">Téléchargement de fichier</h3>
          <div class="border-2 border-dashed border-base-300 rounded-lg p-8 max-w-md mx-auto">
            <p class="text-base-content/70 mb-4">Cliquez pour sélectionner un fichier Excel</p>
            <input 
              type="file" 
              accept=".xlsx,.xls" 
              @change="onFileSelected"
              class="file-input file-input-bordered file-input-primary w-full"
            >
          </div>
        </div>
        
        <!-- Step 1: Map Columns -->
        <div v-if="currentStep === 'mapping'">
          <div class="text-6xl mb-4">
            <Icon code="mdi:database-settings" class="text-primary mx-auto" />
          </div>
          <h3 class="text-xl font-medium text-base-content mb-4 text-center">Configuration du mapping</h3>
          <div class="alert alert-info max-w-2xl mx-auto">
            <Icon code="mdi:information" />
            <div>
              <p class="font-medium">
                Fichier sélectionné: <strong>{{ selectedFileName || 'Aucun fichier' }}</strong>
              </p>
              <p class="text-sm">Interface de mapping des colonnes à implémenter</p>
            </div>
          </div>
        </div>
        
        <!-- Step 2: Review & Import -->
        <div v-if="currentStep === 'validation'">
          <div class="text-6xl mb-4">
            <Icon code="mdi:check-circle" class="text-success mx-auto" />
          </div>
          <h3 class="text-xl font-medium text-base-content mb-4 text-center">Validation finale</h3>
          <div class="alert alert-success max-w-2xl mx-auto">
            <Icon code="mdi:check-circle" />
            <div>
              <p class="font-medium">
                Prêt à importer <strong>{{ selectedFileName || 'le fichier' }}</strong>
              </p>
              <p class="text-sm">Processus d'import et validation à implémenter</p>
            </div>
          </div>
        </div>
        
      </template>
    </StepperContainer>
  </div>
</template>

<script setup lang="ts">
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
    validationFunction: () => true
  }, 
  { 
    step_order: 1,
    step_slug: 'upload',
    title: 'Upload', 
    description: 'Sélection du fichier Excel',
    validationFunction: () => !!importData.value.file
  },
  { 
    step_order: 2,
    step_slug: 'mapping',
    title: 'Map Columns', 
    description: 'Configuration des mappings',
    validationFunction: () => Object.keys(importData.value.mappings).length > 0 || true // Allow for demo
  },
  { 
    step_order: 3,
    step_slug: 'validation',
    title: 'Review & Import', 
    description: 'Validation et import',
    validationFunction: () => true
  }
]

// Reactive state
const canProceedToNext = ref(false)
const selectedFileName = ref('')
const importData = ref({
  file: null,
  mappings: {},
  validationResults: null
}) as any

// Event handlers
const onStepChanged = (stepSlug: string) => {
  console.log('Step changed to:', stepSlug)
  // StepperContainer now handles validation internally
}

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    importData.value.file = file
    selectedFileName.value = file.name
    canProceedToNext.value = true
  }
}

const onImportFinished = () => {
  console.log('Import finished!')
  // Navigate to success page or show completion message
  alert('Import terminé avec succès!')
  navigateTo('/')
}
</script>