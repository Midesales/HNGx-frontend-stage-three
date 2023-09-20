This Image Gallery App is a web application that allows users to view, search, and organize images. Users can search for images based on keywords, view a curated list of images, and perform drag-and-drop actions to arrange images within the gallery.

Technologies Used

React: A JavaScript library for building user interfaces.
React Router: A routing library for React applications.
Axios: A promise-based HTTP client for making API requests.
React Beautiful DND: A library for adding drag-and-drop functionality to React applications.
Pexels API: An API for accessing a vast collection of high-quality images.


Features

Image Search: Users can search for images by entering keywords in the search bar. The application fetches images from the Pexels API based on the search query.

Curated Image List: The app displays a curated list of images when users first visit the page. These images are sourced from the Pexels API.

User Authentication: Users can log in and log out using the provided authentication system. The username is displayed when logged in. User can only log in with:

Username: user@example.com Password: 1Password

Any username and password apart from the above will throw an error

Drag-and-Drop: Users can arrange images within the gallery using drag-and-drop functionality. Images can be moved to different positions within the gallery.

Load More: Users can load more images by clicking the "Load more" button, which fetches additional images from the API


Installation

Clone this repository to your local machine

Navigate to the project directory

Install the project dependencies using npm or yarn

Start the development server

The app will be accessible at http://localhost:3000 in your web browser