<template>
  <div class="min-h-screen">
    <StepperContainer 
        :steps="importSteps"
        title="Import Master Excel > Wipimo"
        @step-changed="onStepChanged"
        @finished="onImportFinished"
    >
      <template #default="{ currentStep, sortedSteps }">
        
        <!-- Step: Upload Excel File -->
        <div v-if="currentStep === 'config'" class="text-center space-y-2">
            <Icon code="mdi:gear" class="text-4xl text-neutral mx-auto animate-bounce" />
            <form class="w-full md:w-1/2 mx-auto space-y-2">

                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">

                    <!-- Nom de l'Import -->
                    <FormInput v-model="importData.config.importName" min="3" label="Nom de l'import" helper="Nom de l'import pour suivi" />
            
                    <!-- Type d'Import -->
                    <FormSelect  v-model="importData.config.importType" label="Type d'Import" :options="importTypeOptions"  helper="Type d'import à effectuer" required />

                </div>
                
                <!-- Dates-->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-2">

                    <!-- Date de Reprise -->
                    <FormInput v-model="importData.config.dateReprise" label="Date de reprise" type="date" helper="Date de reprise des données" />

                    <!-- Dernier Jour de Facturation (calculé automatiquement) -->
                    <FormInput v-model="dateDerniereFacturation" disabled label="Dernier Jour de Facturation Loyer" type="date" helper="Date pour les prochains quittancements" />

                    <!-- Jour de Facturation -->
                    <FormInput v-model="importData.config.facturation_jour" label="Jour de facturation" type="number" min="1" max="28" helper="Date à laquelle les loyers sont facturés" />

                </div>

            </form>
        </div>
        
        <!-- Step: Upload Excel File -->
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
        
        <!-- Step: Map Columns -->
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
        
        <!-- Step: Review & Import -->
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
import { config } from 'zod'

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
            &&importTypeOptions.value.some(opt => opt.value === importData.value.config.importType)
            && !!importData.value.config.dateReprise
            && importData.value.config.facturation_jour >= 1 && importData.value.config.facturation_jour <= 28
        )
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