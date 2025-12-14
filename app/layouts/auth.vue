<template>
    <div class="grid grid-cols-6 min-h-screen *:p-2">
        <div class="col-span-4 bg-primary flex items-center justify-center">
            <div class="max-w-md space-y-8 text-white">
                <h1 class="text-4xl font-bold mb-12 text-center">adhoc copilot</h1>
                
                <div class="space-y-6">
                    <!-- Feature 1 -->
                    <div class="flex items-center space-x-4">
                        <div class="shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <Icon code="heroicons:chart-bar" class="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold">Visualiser vos données à 360°</h3>
                            <p class="text-white/80 text-sm">Une vue complète de toutes vos informations</p>
                        </div>
                    </div>

                    <!-- Feature 2 -->
                    <div class="flex items-center space-x-4">
                        <div class="shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <Icon code="heroicons:cloud-arrow-down" class="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold">Importer en masse des données</h3>
                            <p class="text-white/80 text-sm">Gagnez du temps avec nos imports automatisés</p>
                        </div>
                    </div>

                    <!-- Feature 3 -->
                    <div class="flex items-center space-x-4">
                        <div class="shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <Icon code="heroicons:arrow-path" class="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold">Automatiser vos bascules</h3>
                            <p class="text-white/80 text-sm">Processus fluides et automatisés pour plus d'efficacité</p>
                        </div>
                    </div>
                </div>

                <!-- Decorative element -->
                <div class="mt-12 text-center">
                    <div class="inline-block w-16 h-1 bg-white/40 rounded"></div>
                </div>
            </div>
        </div>
        <div class="col-span-2 bg-base-200 flex items-center justify-center">
            <div>
                <slot />
            </div>
        </div>
    </div>
</template>