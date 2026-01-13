<template>
  <div>
    <Icon code="mdi:file-excel" class="text-6xl text-success mx-auto"/>
    <p class="w-max mx-auto">{{ importData.file.name }}</p>

    <h3 class="text-xl font-medium text-base-content mb-4 text-center">Validation</h3>

    <div class="w-full md:w-1/2 mx-auto space-y-2 text-center">

      <!-- TO COMPLETE -->

    </div>

    <!-- <pre class="my-4 bg-black text-white p-4">hasErrors : {{ hasErrors }}</pre>
    <pre class="my-4 bg-black text-white p-4" v-if="hasErrors">validationReport : {{ validationReport }}</pre>
    <pre class="my-4 bg-black text-white p-4">{{ importData }}</pre> -->

  </div>    
</template>

<script setup lang="ts">
import { getEntity, getEntities } from '~/utils/entityHelpers'

// Define Props
defineProps<{
  importData: any
}>()

// Local data
const validationReport = ref<any[]>([])
const hasErrors = computed(() => validationReport.value.some(report => report.severity === 'error'))

// TO COMPLETE 
// Here we should implement the logic to audit/validate the imported file data based on the v0\components\ImportMASTER.vue generateExtract() function
// We should implement the same validation Report as v1\app\pages\import\master-xls\steps\UploadStep.vue
// But we should implement a kind of LOG / DEBUG console in the page to show row per row the validation progress (like "Validation Ligne 1 démarré", etc... with the timesamps)

</script>