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
          :step-index="0"
          :current-step="currentStep"
          title="Upload Excel File"
          description="Sélectionnez et téléchargez votre fichier Excel master"
        >
          <div class="text-center py-16">
            <div class="text-6xl mb-4">
              <Icon code="mdi:file-excel" class="text-success mx-auto" />
            </div>
            <h3 class="text-xl font-medium text-base-content mb-4">Téléchargement de fichier</h3>
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
        </StepperStep>
        
        <!-- Step 1: Map Columns -->
        <StepperStep 
          :step-index="1"
          :current-step="currentStep"
          title="Mapping des Colonnes"
          description="Associez les colonnes Excel aux champs de la base de données"
        >
          <div class="text-center py-16">
            <div class="text-6xl mb-4">
              <Icon code="mdi:database-settings" class="text-primary mx-auto" />
            </div>
            <h3 class="text-xl font-medium text-base-content mb-4">Configuration du mapping</h3>
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
        </StepperStep>
        
        <!-- Step 2: Review & Import -->
        <StepperStep 
          :step-index="2"
          :current-step="currentStep"
          title="Validation & Import"
          description="Vérifiez vos données et confirmez l'importation"
        >
          <div class="text-center py-16">
            <div class="text-6xl mb-4">
              <Icon code="mdi:check-circle" class="text-success mx-auto" />
            </div>
            <h3 class="text-xl font-medium text-base-content mb-4">Validation finale</h3>
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
const importData = ref({
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
      canProceedToNext.value = !!importData.value.file
      break
    case 1:
      canProceedToNext.value = Object.keys(importData.value.mappings).length > 0 || true // Allow for demo
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