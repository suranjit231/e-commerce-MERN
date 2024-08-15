# E-commerce Website

This is a full-featured e-commerce website built using the MERN stack. It includes user authentication, product listing, cart management, order processing, product reviews, and an admin interface for managing products.

## Features

- **User Authentication**: Secure login and signup using JWT tokens.
- **Product Listing**: Browse all products with filtering and search capabilities.
- **Product Details**: View detailed information about each product.
- **Cart Management**: Add products to the cart, update quantities, and remove items.
- **Order Processing**: Complete purchases and view order history.
- **Product Reviews**: Users can leave reviews and ratings for products.
- **Admin Interface**: Admins can add new products and manage existing ones.

## Tech Stack

- **Frontend**: React, Redux
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Project Configuration

### Clone the Repository

```sh
git clone <repository-url>
```
### Backend configuration
1. Open another terminal and navigate to the backend directory:
- **cd backend**
2. Install dependencies:
- **npm install**
3. Configure your database URL, JWT secret, and port in the .env file:
```
PORT=3200
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
4. Check the file present in backend/src/config/connectMongodb.js to create an admin when the server starts running. Read the comments and uncomment whatever instruction is given.
5. Start the backend:
- **node server.js**

### Client configuration
1. Navigate to the client directory:
- **cd client**
2. Install the required dependencies:
- **npm install**
4. Configure the backend URL in the authReducer.js file. ( client -> src-> redux -> authReducer.js )
5. Start the client:
- **npm start**

### INITIAl SETUP
1. As soon as the app starts running, you will be redirected to the home page of the application.

2. Click on the login icon, then sign in with your admin credentials found in backend/src/config/connectMongodb.js.
Add some products as an admin.

3. Logout from the admin account and login as a regular user to explore the app, add products to the cart, and complete purchases.

