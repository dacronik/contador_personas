<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import { useApiService } from '../stores/apiService.js'

// Reactive Values
const count = ref(0);
const apiService = useApiService();
// Computed Properties
// Methods
const sumar = async () =>{
    const response = await apiService.enviarComando('manual-add');
    if (response.success){
        count.value++;
    }else{
        console.error(response.message);
    }
}
const restar = async () =>{
    if (count.value > 0){
        const response = await apiService.enviarComando('manual-sub');
        if(response.success){
            count.value--;
        }else {
            console.error(response.message);
        }
    }
};
// Watchers

// Lifecycle hooks
onMounted(() =>{
    //apiService.conectarSocketIO();
    console.log(apiService.getContadorManual)
})
onBeforeUnmount(() => {
    apiService.desconectarSocketIO();
})

</script>

<template>
    <div>
        <h2>Contador Manual de Personas</h2>
        <p>Contador: {{ count }}</p>
        <button @click="sumar">Sumar</button>
        <button @click="restar">Restar</button>
    </div>
</template>

<style scoped>
    
</style>