<script>
import { orderService } from './services/api'

export default {
  name: 'App',
  data() {
    return {
      customerNumber: '',
      invoiceNumber: '',
      error: '',
      loading: false,
      orderData: null
    }
  },
  methods: {
    validateInputs() {
      if (!this.customerNumber.trim() || !this.invoiceNumber.trim()) {
        this.error = 'Please enter both customer number and invoice number.'
        return false
      }
      return true
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
    },
    async searchOrder() {
      if (!this.validateInputs()) return

      this.loading = true
      this.error = ''
      this.orderData = null

      try {
        const response = await orderService.getOrderStatus(this.customerNumber, this.invoiceNumber)
        
        if (response.data && response.data.status === 'success') {
          this.orderData = response.data.data
        } else {
          this.error = response.data.message || 'No order information found.'
        }
      } catch (error) {
        console.error('Error searching order:', error)
        if (error.response) {
          switch (error.response.status) {
            case 404:
              this.error = 'Order not found.'
              break
            case 400:
              this.error = 'Invalid input data.'
              break
            default:
              this.error = 'An error occurred while searching for the order. Please try again.'
          }
        } else if (error.request) {
          this.error = 'Unable to connect to the server. Please check your internet connection.'
        } else {
          this.error = 'An error occurred while searching for the order. Please try again.'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-primary text-white py-6 px-4 sticky top-0 z-50 shadow-md">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl font-bold tracking-wider mb-2">HALCÓN</h1>
        <span class="text-lg opacity-90">Construction Materials</span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 container mx-auto px-4 py-8 max-w-4xl">
      <!-- Search Form -->
      <div class="section-card">
        <h2 class="text-2xl text-center text-primary font-bold mb-6">
          Track Your Order Status
        </h2>
        
        <div class="space-y-4">
          <div>
            <label for="customerNumber" class="info-label block mb-2">
              Customer Number
            </label>
            <input 
              type="text" 
              id="customerNumber" 
              v-model="customerNumber" 
              placeholder="Example: 13"
              :disabled="loading"
              class="input-field"
            >
          </div>

          <div>
            <label for="invoiceNumber" class="info-label block mb-2">
              Invoice Number
            </label>
            <input 
              type="text" 
              id="invoiceNumber" 
              v-model="invoiceNumber" 
              placeholder="Example: INV-003"
              :disabled="loading"
              class="input-field"
            >
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <button 
            @click="searchOrder" 
            :disabled="loading"
            class="btn-primary w-full"
          >
            <span v-if="loading">Searching...</span>
            <span v-else>Track Order</span>
          </button>
        </div>
      </div>

      <!-- Results -->
      <div v-if="orderData" class="mt-8 space-y-6">
        <!-- Customer Information -->
        <section class="section-card">
          <h3 class="section-title">Customer Information</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <span class="info-label block">Customer:</span>
              <span class="info-value">{{ orderData.customer.name }}</span>
            </div>
            <div>
              <span class="info-label block">Number:</span>
              <span class="info-value">{{ orderData.customer.number }}</span>
            </div>
            <div>
              <span class="info-label block">Company:</span>
              <span class="info-value">{{ orderData.customer.company }}</span>
            </div>
            <div class="md:col-span-2">
              <span class="info-label block">Tax Information:</span>
              <span class="info-value">{{ orderData.customer.fiscal_data }}</span>
            </div>
            <div class="md:col-span-2">
              <span class="info-label block">Delivery Address:</span>
              <span class="info-value">{{ orderData.customer.delivery_address }}</span>
            </div>
          </div>
        </section>

        <!-- Order Information -->
        <section class="section-card">
          <h3 class="section-title">Order Details</h3>
          <div class="flex justify-center mb-6">
            <div :class="{
              'status-badge': true,
              'bg-yellow-500': orderData.order.status === 'ORDERED',
              'bg-orange-500': orderData.order.status === 'IN_PROCESS',
              'bg-blue-500': orderData.order.status === 'IN_ROUTE',
              'bg-green-500': orderData.order.status === 'DELIVERED'
            }">
              {{ orderData.order.status_description }}
            </div>
          </div>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <span class="info-label block">Invoice:</span>
              <span class="info-value">{{ orderData.order.invoice_number }}</span>
            </div>
            <div>
              <span class="info-label block">Order Date:</span>
              <span class="info-value">{{ formatDate(orderData.order.order_date) }}</span>
            </div>
            <div>
              <span class="info-label block">Total Amount:</span>
              <span class="info-value font-semibold text-primary">
                {{ formatCurrency(orderData.order.total_amount) }}
              </span>
            </div>
            <div v-if="orderData.order.notes" class="md:col-span-2">
              <span class="info-label block">Notes:</span>
              <span class="info-value">{{ orderData.order.notes }}</span>
            </div>
          </div>
        </section>

        <!-- Products -->
        <section class="section-card overflow-x-auto">
          <h3 class="section-title">Products</h3>
          <table class="min-w-full">
            <thead>
              <tr class="bg-primary text-white">
                <th class="px-4 py-3 text-left">Product</th>
                <th class="px-4 py-3 text-right">Quantity</th>
                <th class="px-4 py-3 text-right">Unit Price</th>
                <th class="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="(product, index) in orderData.products" 
                  :key="index"
                  class="hover:bg-gray-50">
                <td class="px-4 py-3">{{ product.name }}</td>
                <td class="px-4 py-3 text-right">{{ product.quantity }}</td>
                <td class="px-4 py-3 text-right">{{ formatCurrency(product.unit_price) }}</td>
                <td class="px-4 py-3 text-right font-medium">{{ formatCurrency(product.total_price) }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- Delivery Evidence -->
        <section v-if="orderData.delivery_evidence" class="section-card">
          <h3 class="section-title">Delivery Evidence</h3>
          <div class="grid md:grid-cols-2 gap-6">
            <div v-if="orderData.delivery_evidence.sent_photo_url" class="space-y-3">
              <h4 class="font-medium text-secondary">Shipping Photo</h4>
              <img 
                :src="orderData.delivery_evidence.sent_photo_url" 
                alt="Shipping photo"
                class="w-full rounded-lg shadow-md"
              >
              <p class="text-sm text-gray-600">
                Sent: {{ formatDate(orderData.delivery_evidence.sent_at) }}
              </p>
            </div>
            <div v-if="orderData.delivery_evidence.received_photo_url" class="space-y-3">
              <h4 class="font-medium text-secondary">Reception Photo</h4>
              <img 
                :src="orderData.delivery_evidence.received_photo_url" 
                alt="Reception photo"
                class="w-full rounded-lg shadow-md"
              >
              <p class="text-sm text-gray-600">
                Received: {{ formatDate(orderData.delivery_evidence.received_at) }}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-primary text-white py-4 px-4 text-center">
      <p class="text-sm">© 2024 Halcón Construction Materials. All rights reserved.</p>
    </footer>
  </div>
</template>

<style>
:root {
  --primary-color: #2c3e50;
  --secondary-color: #34495e;
  --accent-color: #3498db;
  --background-color: #f8f9fa;
  --text-color: #2c3e50;
  --border-radius: 8px;
  --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --container-width-desktop: 800px;
  --container-width-tablet: 95%;
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
  font-size: 16px;
}

/* Ajuste de tamaño de fuente base para móviles */
@media (max-width: 480px) {
  body {
    font-size: 14px;
  }
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-md);
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.logo-container h1 {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 2px;
}

@media (max-width: 480px) {
  .logo-container h1 {
    font-size: 2rem;
  }
}

.subtitle {
  font-size: 1rem;
  opacity: 0.9;
}

.main-content {
  flex: 1;
  padding: var(--spacing-lg);
  max-width: var(--container-width-desktop);
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 840px) {
  .main-content {
    max-width: var(--container-width-tablet);
    padding: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: var(--spacing-sm);
  }
}

.search-container {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: var(--spacing-lg);
  transition: transform 0.3s ease;
}

.search-container:hover {
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .search-container {
    padding: var(--spacing-md);
  }
}

.search-container h2 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-lg);
  text-align: center;
  font-size: 1.75rem;
}

@media (max-width: 480px) {
  .search-container h2 {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-md);
  }
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  color: var(--secondary-color);
  font-weight: 500;
}

input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 2px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

input:disabled {
  background-color: #f5f6f7;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  background-color: #fde8e7;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-md);
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid rgba(231, 76, 60, 0.2);
}

.search-button {
  width: 100%;
  padding: var(--spacing-md);
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.search-button:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-button:active:not(:disabled) {
  transform: translateY(0);
}

.search-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

.result-container {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .result-container {
    padding: var(--spacing-md);
  }
}

.result-container h3 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
  text-align: center;
  font-size: 1.5rem;
}

.status-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.status-indicator {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  min-width: 150px;
  text-align: center;
  transition: all 0.3s ease;
}

.ordered {
  background-color: #f1c40f;
  color: #000;
}

.in_process {
  background-color: #e67e22;
  color: white;
}

.in_route {
  background-color: #3498db;
  color: white;
}

.delivered {
  background-color: #2ecc71;
  color: white;
}

.delivery-image {
  max-width: 100%;
  border-radius: var(--border-radius);
  margin-top: var(--spacing-md);
  box-shadow: var(--box-shadow);
  transition: transform 0.3s ease;
}

.delivery-image:hover {
  transform: scale(1.02);
}

.footer {
  background-color: var(--primary-color);
  color: white;
  text-align: center;
  padding: var(--spacing-md);
  margin-top: auto;
}

@media (max-width: 480px) {
  .footer {
    padding: var(--spacing-sm);
    font-size: 0.9rem;
  }
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Nuevos estilos para las secciones de información */
.info-section {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: var(--spacing-md);
}

.info-section h3 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 2px solid var(--accent-color);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.label {
  color: var(--secondary-color);
  font-weight: 500;
  font-size: 0.9rem;
}

.value {
  font-size: 1.1rem;
}

/* Estilos para la tabla de productos */
.products-grid {
  border: 1px solid #eee;
  border-radius: var(--border-radius);
  overflow: hidden;
}

.product-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--spacing-sm);
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-sm);
  font-weight: 500;
}

.product-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-bottom: 1px solid #eee;
}

.product-row:last-child {
  border-bottom: none;
}

/* Estilos para la evidencia de entrega */
.evidence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.evidence-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.evidence-item h4 {
  color: var(--secondary-color);
  margin-bottom: var(--spacing-xs);
}

.evidence-item img {
  max-width: 100%;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.evidence-item p {
  color: var(--secondary-color);
  font-size: 0.9rem;
}

/* Mejoras responsive para móviles */
@media (max-width: 480px) {
  .product-header,
  .product-row {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    font-size: 0.9rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .evidence-grid {
    grid-template-columns: 1fr;
  }

  .info-section {
    padding: var(--spacing-md);
  }

  .value {
    font-size: 1rem;
  }
}
</style>
