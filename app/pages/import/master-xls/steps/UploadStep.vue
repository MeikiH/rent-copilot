<template>
  <div>
    <Icon code="mdi:file-excel" class="text-6xl text-neutral mx-auto" :class="importData.file ? 'animate-bounce text-success' : ''" />

    <h3 class="text-xl font-medium text-base-content mb-4 text-center">
      <span v-if="!importData.file">Téléchargement de fichier</span>
      <span v-else>Fichier valide</span>
    </h3>

    <div class="w-full md:w-1/2 mx-auto space-y-2 text-center">

      <div v-if="importData.file && !hasErrors" role="alert" class="flex items-center bg-success/10 border border-success text-success font-medium rounded-lg px-4 py-3">
        <p class="w-full">{{ importData.file.name }}</p>
        <Icon code="mdi:trash-can-outline" class="text-xl cursor-pointer" :class="getTextColorClass(hasErrors ? 'error' : 'success')" @click="onClearFile" />
      </div>

      <div v-else class="border-2 border-dashed border-base-300 rounded-lg p-8 max-w-md mx-auto">
        <p class="text-base-content/70 mb-4">Cliquez pour sélectionner un fichier Excel</p>
        <input type="file" accept=".xlsx,.xls" @change="onFileSelected" class="file-input file-input-bordered file-input-primary w-full">
      </div>

      <div v-if="validationReport.length > 0" class="mt-4">
        <div v-for="(report, index) in validationReport" :key="index" class="alert mb-2" :class="getAlertClass(report.severity)">
          <Icon :code="report.severity === 'error' ? 'mdi:alert-octagon-outline' : 'mdi:alert'" />
          <div>
            <p class="font-medium" v-html="report.message"></p>
          </div>
        </div>

      </div>

    </div>

    <!-- <pre class="my-4 bg-black text-white p-4">hasErrors : {{ hasErrors }}</pre>
    <pre class="my-4 bg-black text-white p-4" v-if="hasErrors">validationReport : {{ validationReport }}</pre>
    <pre class="my-4 bg-black text-white p-4">{{ importData }}</pre> -->

  </div>    
</template>

<script setup lang="ts">
import XLSX from '@e965/xlsx'
import { getEntity, getEntities } from '~/utils/entityHelpers'

// Define Props
defineProps<{
  importData: any
}>()

// Define Emits
const emit = defineEmits<{
  fileUploaded: [file: File | null, fileData: any]
}>()

// Local data
const validationReport = ref<any[]>([])
const hasErrors = computed(() => validationReport.value.some(report => report.severity === 'error'))

/**
 * Function to handle the upload of an XLS file
 */
const onFileSelected = async (event: Event) => {
    validationReport.value = []
    const entries = [] as any[];

    try { 
        let file = (event.target as HTMLInputElement).files?.[0] || undefined;

        // If no file, add error to validation report
        if (!file) {
            validationReport.value.push({
                severity: 'error',
                type: 'invalid_file',
                message: `Le fichier uploadé n'est pas exploitable ou est corrompu`,
            })
        } else {

            const reader = new FileReader();

            reader.onload = (e) => {
                const data = new Uint8Array((e.target as FileReader).result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                // If only one sheet, take the sheet OR find the sheet named import
                const numberOfSheets = workbook.SheetNames.length;
                const sheetName = (numberOfSheets ? workbook.SheetNames[0] : workbook.SheetNames.find(name => name.toLowerCase() === 'import')) as string;
                const sheet = workbook.Sheets[sheetName];

                // ERROR if no sheet found
                if (!sheet) {
                    validationReport.value.push({
                        severity: 'error',
                        type: 'invalid_file',
                        message: numberOfSheets ? `Le fichier uploadé semble vide` : `L'onglet "import" est introuvable dans le fichier.`,
                    })
                } else {
                    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any;

                    // ERROR if less than 5 rows
                    if (jsonData.length < 5) {
                        validationReport.value.push({
                            severity: 'error',
                            type: 'invalid_file',
                            message:  `Le fichier doit contenir au moins 5 lignes (en-têtes et données).`
                        })
                    }

                    // Extract entity names rom the File
                    const allFileEntityNames = jsonData[1] as string[] || null; // Row 2
                    const entityNames = Array.from(new Set(allFileEntityNames.filter(name => name && name.trim() && name !="")));

                    // GET all entity from the config file
                    const requiredEntities = getEntities({ in_master: true, master_required: true })

                    // ERROR if any required entity is missing
                    if (requiredEntities.some(entity => !entityNames.includes(entity.key))) {
                        validationReport.value.push({
                            type: 'missing_entity',
                            entity: null,
                            message: `Une ou plusieurs entités manquantes dans la liste : ${requiredEntities.map(e => e.label).join(', ')}`,
                            severity: 'error'
                        })
                        
                        console.log('Entity Names from file:', entityNames);
                        console.log('Required Entities from config:', requiredEntities);

                        return
                    } 

                    allFileEntityNames.forEach(entityName => {

                        // ERROR if entity name is empty
                        if (!entityName || entityName.trim() === '' || null) {
                            validationReport.value.push({
                                severity: 'error',
                                type: 'empty_entity',
                                message:  `LIGNE 2 : Une cellule d'entité est vide. Veuillez vérifier la ligne 2 du fichier.`,
                            })
                        } else {
                            
                            const entity = getEntity(entityName.trim())
                            
                            if (!entity) {
                                validationReport.value.push({
                                    type: 'invalid_entity',
                                    entity: entityName,
                                    message: `LIGNE 2 : L'entité "${entityName}" n'est pas reconnue. Entités valides: ${getEntities().map(e => e.label).join(', ')}`,
                                    severity: 'error'
                                })
                                
                                console.log(`Entity found for "${entityName}"`, entity);
                            } 

                        }

                    })

                    const attributeNames = jsonData[2]; // Row 3


                    // Initialize the output structure
                    let entry = {} as any;

                    // Process rows starting from row 5
                    const allRows = jsonData.slice(4) // Process rows starting from row 5
                    allRows.forEach((row: any[], rowIndex: number) => {

                        row.forEach((value, index) => {
                            const entityName = allFileEntityNames[index];
                            const attributeName = attributeNames[index];

                            if (!entityName || !attributeName) {
                                validationReport.value.push({
                                        severity: 'error',
                                        type: 'empty_entity',
                                        message:  `LIGNE 2 : Une cellule d'entité est vide. Veuillez vérifier la ligne 2 du fichier.`,
                                })
                            } else {
                                
                                // FORMAT the output JSON structure

                                // If the entity does not exist in the entry, initialize it
                                if (!entry[entityName]) entry[entityName] = {};

                                // Check if the value is a date serial number and convert it to DD/MM/YYYY format (French Format)
                                if (typeof value === "number" && attributeName.toLowerCase().includes("date")) {
                                    value = XLSX.SSF.format("dd/mm/yyyy", value);
                                }

                                entry[entityName] = { ...entry[entityName], [attributeName]: value };

                            }

                        });

                        entries.push(entry);

                    });

                    console.log("Processed entries from XLS file:", entries);

                    // Emit the result after processing is complete
                    if (validationReport.value.length === 0) {
                        emit('fileUploaded', file, entries);
                        console.log("File OK - Processed entries from XLS file:", file, entries);
                    } else {
                        emit('fileUploaded', null, []);
                        console.log("File has errors - Entries not emitted.");
                    }

                }
            
            }

            reader.readAsArrayBuffer(file);
        }

    } catch (error) {

        validationReport.value.push({
            severity: 'error',
            type: 'technical_error',
            message:  `Une erreur technique est survenue lors du traitement du Fichier.`,
        })

        console.error("Error when reading and processing the XLS file:", error);
    }

}

const onClearFile = () => {
    emit('fileUploaded', null, []);
}
</script>