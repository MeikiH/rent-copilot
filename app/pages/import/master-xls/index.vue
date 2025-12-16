<template>
  <div class="min-h-screen">
    <StepperContainer 
      :steps="importSteps"
      :can-proceed="canProceedToNext"
      title="Import Master Excel > Wipimo"
      @step-changed="onStepChanged"
      @finished="onImportFinished"
    >
      <template #default="{ currentStep }">
        
        <!-- Step 0: Upload Excel File -->
        <StepperStep 
          v-if="currentStep === 0"
          title="Upload Excel File"
          description="Sélectionnez et téléchargez votre fichier Excel master"
          :is-active="true"
        >
          <div class="text-center py-16">
            <div class="text-6xl mb-4">
              <Icon code="mdi:file-excel" class="text-green-500 mx-auto" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 mb-4">Téléchargement de fichier</h3>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 max-w-md mx-auto">
              <p class="text-gray-600 mb-4">Cliquez pour sélectionner un fichier Excel</p>
              <input 
                type="file" 
                accept=".xlsx,.xls" 
                @change="onFileSelected"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              >
            </div>
          </div>
        </StepperStep>
        
        <!-- Step 1: Map Columns -->
        <StepperStep 
          v-if="currentStep === 1"
          title="Mapping des Colonnes"
          description="Associez les colonnes Excel aux champs de la base de données"
          :is-active="true"
        >
          <div class="text-center py-16">
            <div class="text-6xl mb-4">
              <Icon code="mdi:database-settings" class="text-blue-500 mx-auto" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 mb-4">Configuration du mapping</h3>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <p class="text-blue-700 text-sm mb-4">
                Fichier sélectionné: <strong>{{ selectedFileName || 'Aucun fichier' }}</strong>
              </p>
              <p class="text-blue-600 text-sm">Interface de mapping des colonnes à implémenter</p>
            </div>
          </div>
        </StepperStep>
        
        <!-- Step 2: Review & Import -->
        <StepperStep 
          v-if="currentStep === 2"
          title="Validation & Import"
          description="Vérifiez vos données et confirmez l'importation"
          :is-active="true"
        >
          <div class="text-center py-16">
            <div class="text-6xl mb-4">
              <Icon code="mdi:check-circle" class="text-green-500 mx-auto" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 mb-4">Validation finale</h3>
            <div class="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
              <p class="text-green-700 text-sm mb-4">
                Prêt à importer <strong>{{ selectedFileName || 'le fichier' }}</strong>
              </p>
              <p class="text-green-600 text-sm">Processus d'import et validation à implémenter</p>
            </div>
          </div>
        </StepperStep>
        
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
    title: 'Upload File', 
    description: 'Sélection du fichier Excel' 
  },
  { 
    title: 'Map Columns', 
    description: 'Configuration des mappings' 
  },
  { 
    title: 'Review & Import', 
    description: 'Validation et import' 
  }
]

// Reactive state
const canProceedToNext = ref(false)
const selectedFileName = ref('')
const currentStepData = ref({
  file: null,
  mappings: {},
  validationResults: null
})

// Event handlers
const onStepChanged = (step: number) => {
  console.log('Step changed to:', step)
  
  // Update proceed status based on step requirements
  switch(step) {
    case 0:
      canProceedToNext.value = !!currentStepData.value.file
      break
    case 1:
      canProceedToNext.value = Object.keys(currentStepData.value.mappings).length > 0 || true // Allow for demo
      break
    case 2:
      canProceedToNext.value = true
      break
  }
}

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    currentStepData.value.file = file
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