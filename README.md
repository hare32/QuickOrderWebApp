# Project Description

This project is a web application that allows users to place orders. Users can browse available products, add them to a cart, and then proceed to place orders by providing their contact information. The project consists of a frontend built with React and a backend based on Node.js using Express.js. SQLite is used for data storage.

## Features

- Browsing the list of products
- Filtering products by name and category
- Adding products to the cart
- Placing orders from the cart
- Verifying order data before submission
- Sending orders to the database

## Technologies

- **Frontend:** React, React Bootstrap, React Router
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Additional tools:** JSZip (for handling ZIP files)

## Running the Project

### Backend:

1. Install dependencies: `npm install`
2. Start the server: `npm start`
   - The server will be available at: `http://localhost:3000/`

### Frontend:

1. Go to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the application: `npm start`
   - The application will be available at: `http://localhost:3001/`

## Project Structure

- `/backend` - contains Node.js server files and database configuration
- `/frontend` - contains React.js files for the user interface
- `/frontend/src/components` - React components used in the application
- `/frontend/src/views` - React views corresponding to individual pages of the application
