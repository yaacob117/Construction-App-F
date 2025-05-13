import axios from 'axios'

// Crear una instancia de axios con la configuración base
const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Ajusta esto según la URL de tu backend
    timeout: 5000, // Timeout de 5 segundos
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Servicios de la API
export const orderService = {
    // Obtener el estado de un pedido
    getOrderStatus(customerNumber, invoiceNumber) {
        return api.get('/order-status', {
            params: {
                customer_number: customerNumber,
                invoice_number: invoiceNumber
            }
        })
    }
}

export default api 