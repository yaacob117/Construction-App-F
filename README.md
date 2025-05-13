# Halcón Construction Materials - Order Tracking System

A modern Vue.js application for tracking construction material orders from Halcón Construction Materials company. This web application provides customers with a user-friendly interface to track their orders in real-time.

## Features

- **Order Tracking**: Search orders using customer number and invoice number
- **Detailed Order Information**: 
  - Customer details
  - Order status with visual indicators
  - Product list with quantities and prices
  - Delivery evidence with photos
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Status Updates**: Visual status indicators for different order stages
  - Ordered (Yellow)
  - In Process (Orange)
  - In Route (Blue)
  - Delivered (Green)

## Prerequisites

- Node.js (v14.0 or higher)
- npm (v6.0 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yaacob117/Construction-App-F.git
cd Construction-App-F/Construction-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and configure your API endpoint:
```env
VITE_API_BASE_URL=http://your-api-endpoint
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. Open the application in your web browser
2. Enter your customer number (e.g., "13")
3. Enter your invoice number (e.g., "INV-003")
4. Click "Track Order" to view your order details

The system will display:
- Customer information
- Order details with status
- Product list with prices
- Delivery evidence (if available)

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- Vue.js 3
- Vite
- Tailwind CSS
- Axios

## API Integration

The application integrates with a RESTful API using the following endpoint:
- Order Status: `/api/order-status?customer_number={number}&invoice_number={invoice}`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or create an issue in the GitHub repository.
