# QuickBite SPA - Restaurant Ordering Website

A mobile-first, single-page application (SPA) for quick restaurant food ordering with minimal taps. Built for fast, frictionless ordering experience optimized for mobile devices.

## Features

- **Mobile-First Design**: Optimized for mobile with large touch targets and single-column layout
- **Quick Ordering**: Add items to cart in ≤3 taps
- **Menu in Malayalam**: Local language support for menu items
- **Payment Options**: UPI instant payment or cash at counter
- **Optional WhatsApp Notifications**: Get updates when order is ready
- **Device Fingerprinting**: Session tracking for continuity and basic fraud detection
- **Admin Dashboard**: Live order management interface
- **Persistent Cart**: Cart state saved across sessions

## Tech Stack

### Frontend (Client)
- React 19 + Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- FingerprintJS for device fingerprinting

### Backend (Server)
- Node.js + Express
- CORS and body-parser for API handling
- SQLite/PostgreSQL for data storage (configurable)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd dosha_kada
   ```

2. **Install dependencies for both client and server:**

   **Server:**
   ```bash
   cd server
   npm install
   ```

   **Client:**
   ```bash
   cd ../client
   npm install
   ```

3. **Set up the menu data:**
   - Menu items are loaded from `item.txt` (Malayalam menu with prices)
   - Server reads menu data from `server/data/menu.json`

4. **Configure environment variables (if needed):**
   - UPI merchant details for payment integration
   - Database connection settings

## Usage

### Development

1. **Start the server:**
   ```bash
   cd server
   node index.js
   ```
   Server runs on `http://localhost:3000` (or configured port)

2. **Start the client:**
   ```bash
   cd client
   npm run dev
   ```
   Client runs on `http://localhost:5173` (Vite dev server)

### Production Build

1. **Build the client:**
   ```bash
   cd client
   npm run build
   ```

2. **Serve the built client and run server in production mode**

## API Endpoints

- `POST /orders` - Create new order
- `GET /orders/{id}` - Get order status
- `GET /menu` - Get menu items
- Admin endpoints for order management

## Key Workflows

### Customer Flow
1. Browse menu (Malayalam)
2. Add items to cart (tap to add)
3. View cart (floating cart icon)
4. Checkout: Enter name/phone, select payment
5. UPI: Opens UPI app with pre-filled amount
6. Cash: Pay at counter with order ID
7. Optional: WhatsApp notification opt-in

### Admin Flow
- View live incoming orders
- Mark orders as cooking/ready/completed
- Monitor order status

## Configuration

- **UPI Integration**: Update UPI merchant ID in client code
- **WhatsApp**: Configure restaurant phone number for notifications
- **Menu**: Update `item.txt` and regenerate `menu.json`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test on mobile devices
5. Submit pull request

## License

ISC License

## Performance Goals

- Page TTI < 1.5s on 4G
- ≤3 taps to complete order
- Mobile-first responsive design

---

Built for fast, local restaurant ordering with minimal friction.
