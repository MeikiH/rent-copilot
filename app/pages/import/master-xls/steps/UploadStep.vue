<template>
  <div>
    <Icon code="mdi:file-excel" class="text-6xl text-neutral mx-auto" :class="importData.file ? 'animate-bounce text-success' : ''" />

    <h3 class="text-xl font-medium text-base-content mb-4 text-center">
      <span v-if="!importData.file">Téléchargement de fichier</span>
      <span v-else>Fichier sélectionné</span>
    </h3>

    <div class="w-full md:w-1/2 mx-auto space-y-2 text-center">
      <div v-if="importData.file" role="alert" class="flex items-center bg-success/10 border border-success text-success font-medium rounded-lg px-4 py-3">
        <p class="w-full">{{ importData.file.name }}</p>
        <Icon code="mdi:trash-can-outline" class="text-error text-xl cursor-pointer" @click="onClearFile" />
      </div>
      <div v-else class="border-2 border-dashed border-base-300 rounded-lg p-8 max-w-md mx-auto">
        <p class="text-base-content/70 mb-4">Cliquez pour sélectionner un fichier Excel</p>
        <input type="file" accept=".xlsx,.xls" @change="onFileSelected" class="file-input file-input-bordered file-input-primary w-full">
      </div>
    </div>
    <pre class="my-4 bg-black text-white p-4">{{ importData.fileData }}</pre>
  </div>
</template>

<script setup lang="ts">
import XLSX from '@e965/xlsx'

interface Props {
  importData: any
}

defineProps<Props>()

const emit = defineEmits<{
  fileUploaded: [file: File, fileData: any]
  fileClear: []
}>()

/**
 * Function to handle the upload of an XLS file
 * @param {Event} event - Event object
 */
const onFileSelected = async (event: Event) => {
  try { 
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array((e.target as FileReader).result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      // Keep only the first sheet
      const sheetName = workbook.SheetNames[0] as string;
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) return;

      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any;

      // Ensure the sheet has enough rows
      if (jsonData.length < 5) {
        alert(`❌ L'onglet "${sheetName}" doit avoir au moins 5 lignes.`);
        return;
      }

      // Extract entity names and attribute names
      const entityNames = jsonData[1]; // Row 2
      const attributeNames = jsonData[2]; // Row 3

      // Initialize the output structure
      const entries = [] as any[];
      let entry = {} as any;

      // Process rows starting from row 5
      jsonData.slice(4).forEach((row: any[]) => {
        row.forEach((value, index) => {
          const entityName = entityNames[index];
          const attributeName = attributeNames[index];

          if (!entityName || !attributeName) return;

          // of attribute name doesn't exist on entry, create it 
          if (!entry[entityName]) entry[entityName] = {};

          // Check if the value is a date serial number and convert it
          if (typeof value === "number" && attributeName.toLowerCase().includes("date")) {
            value = XLSX.SSF.format("dd/mm/yyyy", value); // Convert to DD/MM/YYYY format
          }

          entry[entityName] = { ...entry[entityName], [attributeName]: value };
        });

        entries.push(entry);
      });

      emit('fileUploaded', file, entries);
    };

    reader.readAsArrayBuffer(file);

  } catch (error) {
    alert('❌ Erreur lors de la lecture du fichier XLS.');
    console.error(error);
  }
}

const onClearFile = () => {
  emit('fileClear');
}
</script>