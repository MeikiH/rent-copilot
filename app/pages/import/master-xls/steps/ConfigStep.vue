<template>
  <div class="text-center space-y-2">
    <Icon code="mdi:gear" class="text-neutral mx-auto animate-bounce" />
    
    <form class="w-full md:w-1/2 mx-auto space-y-2">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <!-- Nom de l'Import -->
        <FormInput :model-value="importData.config.importName" @update:model-value="(value) => $emit('updateConfig', 'importName', value)" min="3" label="Nom de l'import" helper="Nom de l'import pour suivi" />

        <!-- Type d'Import -->
        <FormSelect :model-value="importData.config.importType" @update:model-value="(value) => $emit('updateConfig', 'importType', value)" label="Type d'Import" :options="importTypeOptions" helper="Type d'import à effectuer" required />
      </div>
      
      <!-- Dates-->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
        <!-- Date de Reprise -->
        <FormInput :model-value="importData.config.dateReprise" @update:model-value="(value) => $emit('updateConfig', 'dateReprise', value)" label="Date de reprise" type="date" helper="Date de reprise des données" />

        <!-- Dernier Jour de Facturation (calculé automatiquement) -->
        <FormInput :model-value="dateDerniereFacturation" disabled label="Dernier Jour de Facturation Loyer" type="date" helper="Date pour les prochains quittancements" />

        <!-- Jour de Facturation -->
        <FormInput :model-value="importData.config.facturation_jour" @update:model-value="(value) => $emit('updateConfig', 'facturation_jour', value)" label="Jour de facturation" type="number" min="1" max="28" helper="Date à laquelle les loyers sont facturés" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
interface Props {
  importData: any
  importTypeOptions: any
  dateDerniereFacturation: any
}

defineProps<Props>()

defineEmits<{
  updateConfig: [field: string, value: any]
}>()</script>