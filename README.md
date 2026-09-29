# Movie Explorer

A React web app to search movies, view details and save favorites, using the TMDb API.

**Live demo:** [https://movie-explorer-gold-two.vercel.app/](https://movie-explorer-gold-two.vercel.app/)

## Features
- Login page with validation (demo login, session kept in localStorage)
- Search movies by title, results in a poster grid (title, year, rating)
- Infinite scroll for results, with a "Load more" button option
- Trending movies on the home page
- Movie details: overview, genres, cast, rating, YouTube trailer
- Filter by genre, year and minimum rating
- Favorites list saved in localStorage
- Last searched movie saved in localStorage
- Light / dark mode (remembered)
- Friendly error messages with a Retry button
- Responsive, mobile-first layout

## Tech Stack
React (Create React App), Material-UI (MUI), axios, React Router, Context API

## Setup
1. Clone the repo and run `npm install`
2. Get a free API key from https://www.themoviedb.org/settings/api
3. Create a `.env` file in the project root:
