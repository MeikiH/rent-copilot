<template>
  <div>
    <Icon code="mdi:file-excel" class="text-6xl text-success mx-auto"/>
    <p class="w-max mx-auto">{{ importData.file.name }}</p>

    <h3 class="text-xl font-medium text-base-content mb-4 text-center">Validation</h3>

    <div class="w-full md:w-1/2 mx-auto space-y-2 text-center">



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

</script>