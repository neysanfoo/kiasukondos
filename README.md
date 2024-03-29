# KiasuKondos

KiasuKondos is a marketplace app for renting and buying houses. It utilizes the datasets at https://data.gov.sg/ to enrich the user experience.

## Features
- User account creation
- Listing houses for sale or rent
- Taking down listings
- Providing detailed information about the listing (Title, address, postal code, property type, sale or rent, description, price, number of bedrooms, number of bathrooms, area of property)
- Editing listings by the owner
- Messaging sellers
- Accepting or rejecting offers
- Providing feedback and ratings (limited to users who have purchased/rented a house)
- Search function with advanced options (location, price, bedrooms, bathrooms, square metres, type of property)
- Filtering and sorting listings based on price or flat size
- Liking listings

## How We Use the data.gov.sg Dataset
- Average pricing based on location, bedrooms, bathrooms, and square footage (and any other parameters).
- Regression analysis to predict market trends for a property.
- Suggested pricing for buyers and sellers for a listing based on the dataset.

## Technology Stack
- Backend: Django Rest Framework
- Frontend: React.js
- Database: SQLite

# Installation

## Requirements
- Python 3.x
- Node.js
- npm

## Backend
1. Clone the repository `git clone git@github.com:neysanfoo/kiasukondos.git`
2. Go to backend directory `cd kiasukondos/backend`
3. Install requirements `pip install -r requirements.txt` (You should do this in a virtual envrionment)
4. Run migrations `python manage.py migrate main` and `python manage.py migrate`
5. Start the server on localhost:8000 `python manage.py runserver`

## Frontend
6. Go to the frontend directory `kiasukondos/frontend`
7. Install requirements `npm i`
8. Start the server on localhost:3000 `npm start`

## Socket
9. Go to the socket directory `kiasukondos/chatsocket`
10. Install requirements `npm i`
11. Start the server on localhost:9000 `npm start`
