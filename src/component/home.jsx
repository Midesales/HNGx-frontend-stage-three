import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // Import the loading spinner
import background from "../image/bg-image.jpg";
import axios from "axios";


function Home() {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(true);
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const Navigate = useNavigate();

  const perPage = 12; // Number of images per page

  const API_KEY = process.env.REACT_APP_API_KEY;

  // Function to fetch images
  const fetchImages = (url) => {
    axios
      .get(url, {
        headers: {
          Authorization: API_KEY,
        },
      })
      .then((response) => {
        if (response.data.photos) {
          // Append the new images to the existing images array
          setImages((prevImages) => [...prevImages, ...response.data.photos]);
          setIsFetching(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
        setIsFetching(false);
      });
  };

  useEffect(() => {
    // Load initial images when the component mounts
    const apiUrl = `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${currentPage}`;
    fetchImages(apiUrl);
  }, [currentPage]);

  //SEARCHING IMAGES
  const searchImages = () => {
    // Reset images and current page when performing a new search
    setImages([]);
    setCurrentPage(1);
    setIsFetching(true);

    if (query === "") {
      // Show "Enter a value" error message
      setErrorMessage("Enter a value");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    } else {
      // If query is not empty, perform a search
      const searchUrl = `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}&page=${currentPage}`;

      axios
        .get(searchUrl, {
          headers: {
            Authorization: API_KEY,
          },
        })
        .then((response) => {
          if (response.data.photos.length === 0) {
            // If no results are found, show "Search failed" error message curated images are display
            setImages([]); // Clear images
            setErrorMessage("Search failed");

            setTimeout(() => {
              setErrorMessage("");
            }, 3000);
          } else {
            // Append the new images to the existing images array
            setImages((prevImages) => [...prevImages, ...response.data.photos]);
            setIsFetching(false);
          }
        })
        .catch((error) => {
          console.error("Error searching images:", error);
          setIsFetching(false);
        });
    }
  };

  const changeHandler = (e) => {
    setQuery(e.target.value);
  };

  //LOGGING OUT
  const handleLogin = async (e) => {
    try {
      Navigate("/Login");
    } catch (error) {
      console.log(error.message);
    }
  };

  //LOADING MORE IMAGES
  const loadMoreImages = () => {
    // Increment the current page when the "Load more" button is clicked
    setCurrentPage((prevPage) => prevPage + 1);
    setIsFetching(true); // Set fetching state to true to show loading spinner

    if (query === "") {
      // If there's no query, load more curated images
      const apiUrl = `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${currentPage}`;

      axios
        .get(apiUrl, {
          headers: {
            Authorization: API_KEY,
          },
        })
        .then((response) => {
          if (response.data.photos) {
            // Append the new images to the existing images array
            setImages((prevImages) => [...prevImages, ...response.data.photos]);
            setIsFetching(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching curated images:", error);
          setIsFetching(false);
        });
    } else {
      // If there's a query, load more search images
      const searchUrl = `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}&page=${currentPage}`;

      axios
        .get(searchUrl, {
          headers: {
            Authorization: API_KEY,
          },
        })
        .then((response) => {
          if (response.data.photos) {
            // Append the new images to the existing images array
            setImages((prevImages) => [...prevImages, ...response.data.photos]);
            setIsFetching(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching search images:", error);
          setIsFetching(false);
        });
    }
  };

  

  return (
    <div className="relative">
      <div
        style={{ backgroundImage: `url(${background})` }}
        className="h-64 bg-center object-cover  text-white p-4"
      >
        <div className="flex justify-between gap-4 p-1 lg:p-4 items-center">
          <h2 className="font-medium text-lg lg:font-bold lg:text-4xl">
            Gallery
          </h2>
          <div className="flex justify-end gap-2 p-4 items-center">
            <button
              onClick={handleLogin}
              className="rounded-lg bg-blue-600 lg:text-lg p-2 font-bold"
            >
              Login
            </button>
          </div>
        </div>
        <div className="text-center font-bold">
          <p>Welcome to Mide's Gallery!</p>
          <p>Log in to use drag and drop</p>
        </div>

        <div className="flex justify-center items-center mt-6">
          <input
            type="text"
            placeholder="Search anything"
            className="p-2 rounded-lg border-2 text-black border-slate-800"
            name="query"
            value={query}
            onChange={changeHandler}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchImages();
              }
            }}
          />
          <button
            onClick={searchImages}
            className="px-2 rounded-lg border-2 bg-blue-800 text-white"
          >
            Search
          </button>
        </div>
        <div className=" text-center font-bold text-lg py-4">
          <p>{errorMessage}</p>
        </div>
      </div>

      <div>
        {isFetching ? (
          <ClipLoader loading={isFetching} size={150} /> // Render loading spinner
        ) : (
          <div className="grid place-content-center md:grid-cols-3 lg:grid-cols-4 gap-3 p-14">
            {images.map((image, idx) => {
              return (
                <div key={image.id} className="group relative">
                  <img
                    src={image.src.large}
                    alt={image.photographer}
                    className="w-64 h-64 lg:w-80 lg:h-80 object-cover"
                  />
                  <p className="opacity-0 group-hover:opacity-100 absolute bottom-2 text-white left-2 p-2 bg-slate-800 font-bold">
                    {image.photographer}
                  </p>
                </div>
              );
            })}
            ;
          </div>
        )}
      </div>
      <div className="flex justify-center items-center p-4">
        <button
          onClick={loadMoreImages}
          className="p-2 font-bold text-lg bg-blue-700 rounded-lg"
        >
          Load more
        </button>
      </div>
      <footer className="flex justify-center  bottom-0 w-full p-4 font-bold">
        <p>&copy; Adeagbo Ayomide</p>
      </footer>
    </div>
  );
}

export default Home;
