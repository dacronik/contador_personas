<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useApiService } from '../stores/apiService.js'

// Reactive Values
const count = ref(0);
const apiService = useApiService();
// Computed Properties
// Methods
const sumar = async () => {
    const response = await apiService.enviarComando('manual-add');
    if (response.success) {
        count.value++;
    } else {
        console.error(response.message);
    }
}
const restar = async () => {
    if (count.value > 0) {
        const response = await apiService.enviarComando('manual-sub');
        if (response.success) {
            count.value--;
        } else {
            console.error(response.message);
        }
    }
};
// Watchers

// Lifecycle hooks
onMounted(() => {
    //apiService.conectarSocketIO();
    console.log(apiService.getContadorManual)
})
onBeforeUnmount(() => {
    apiService.desconectarSocketIO();
})

</script>

<template>
    <div class="flex justify-center items-center h-screen bg-gradient-to-br from-red-400 to-blue-400">
        <div class="bg-gray-200 p-6 rounded-lg">
            <h2 class=" text-2xl mb-4">Contador Manual de Personas</h2>
            <div class=" flex justify-center mt-4">
                <p :class="{ 'text-red-500': count === 0, 'text-green-500': count > 0 }" class=" text-4xl font-bold">{{ count
                }}</p>
            </div>
            <div class="flex justify-center mt-4">
                <button @click="sumar"
                    class="px-6 py-2 mr-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Sumar</button>
                <button @click="restar"
                    class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Restar</button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>