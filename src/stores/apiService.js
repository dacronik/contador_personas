import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
// Función para decodificar la clave de la aplicación
// const decodeAppKey = (encodedKey) => {
//   return atob(encodedKey);
// };

export const useApiService = defineStore('api', {
  state: () => ({
    apiKey:
    'JDJiJDEwJGNQelI0OEJRa2ZMbEZYYXQ2aGpNNU8zYmRBbWtTYS8zV090TjVydDQyMnFzMDBieTI3Y3R5OmNsaWNrZXIzLmRlbW86SUtMQUIwMDU=',
    socket: null,
    contadorManual: 0
  }),
  getters: {
    getContadorManual(state){
        return state.contadorManual;
    }
  },
  actions: {
    async enviarComando(type) {
      const appKey = this.apiKey;

      try {
        const response = await fetch(
          `https://ikcount.com/iklab/ikcount/api/counting/command?appKey=${appKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: type,
              quantity: 1,
              client: 'DEMO001',
              location: 'DEMO001A1L1',
              mac_address: 'DEMO001A1L1Z1MC3',
            }),
          }
        );

        const data = await response.json();
        if (data.cod === 200) {
            console.log(`Comando "${type}" enviado exitosamente`)
          return { success: true, message: 'Comando enviado exitosamente' };
        } else {
          return { success: false, message: data.mssg };
        }
      } catch (error) {
        console.error('Error al enviar comando:', error);
        return { success: false, message: 'Error al enviar comando' };
      }
    },

    //Creando conexión al socket
    conectarSocketIO(){
      const apiKeyCode = '$2b$10$cPzR48BQkfLFXat6hjM5O3bdAmkSa/3OtN5rt422qs00by27cty'
        //const appKey = this.apiKey;
        //const BASE_SOCKET_URL = 'https://ikcount.com';
        // const url = `https://ikcount.com/live?appKey=${encodeURIComponent(apiKeyCode)}`;
        // const socket = io(url,{
        //   transports: ['polling'],
        //   method: 'GET',
        // });
        this.socket = io('https://ikcount.com',{
          path:'/live',
          query:{
            appKey: apiKeyCode
          },
          transports: ['polling'],
          method: 'GET',
        })

        this.socket.on('connect', () => {
          console.log('Conectado al servidor SocketIO')
        })
        this.socket.on('disconnect', () => {
          console.log('Desconectado');
        });
        this.socket.on('WELCOME', (data) => {
          console.log('Evento WELCOME:', data);
        });
    
        this.socket.on('RAW', (data) => {
          console.log('Evento RAW:', data);
        });
    
        this.socket.on('SUMMARY', (data) => {
          console.log('Evento SUMMARY:', data);
        });
    
        this.socket.on('HEARTBEAT', (data) => {
          console.log('Evento HEARTBEAT:', data);
        });
        
        //socket.connected();

        // Escuchar los eventos de actualización del contador manual de personas
        // this.socket.on('contadorManual', (data) =>{
        //     console.log('Actualización del contador manual:' , data)
        //     this.contadorManual = data.count;
        //     // data.forEach(element => {
        //     //     this.contadorManual.push(element)
        //     // });
        // })

        //manejos de errores de conexión
        this.socket.on('connect_error', (error) =>{
            console.error('Error de conexión al SocketIO:', error)
            console.log(error.message);
            
        });
        // this.socket.on('disconnect', () => {
        //   console.log('disconnected');
        //   this.socket.off();
        // });

    },

    //desconectarse del socket
    desconectarSocketIO() {
        if(this.socket){
            this.socket.disconnect();
            console.log('Desconectado del servidor SocketIO');
        }
    }
  },
});
