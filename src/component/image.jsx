import React, { useState, useEffect, useRef } from "react";
import { UserAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // Import the loading spinner
import background from "../image/bg-image.jpg";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {TouchBackend} from "react-dnd-touch-backend";


const isTouchDevice = () => {
  return "ontouchstart" in window;
};

function Image() {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(true);
  const [query, setQuery] = useState("");
  const { user, logout } = UserAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const Navigate = useNavigate();

  const perPage = 12; // Number of images per page

  const API_KEY = "XFpfo4MQTUIjvzx0S5rUBCiqhg3GLp30gi1RyFud4x6gtb8H80cZ5bmp";

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

  // SEARCHING IMAGES
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
            // If no results are found, show "Search failed" error message curated images are displayed
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

  // LOGGING OUT
  const handleLogout = async (e) => {
    try {
      await logout();
      Navigate("/");
      console.log("You are logged out");
    } catch (error) {
      console.log(error.message);
    }
  };

  // LOADING MORE IMAGES
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

  const type = "Image"; // Unique identifier for the draggable element type

  const ImageItem = ({ image, index }) => {
    const ref = useRef(null);

    const [, drop] = useDrop({
      accept: type,
      hover(item) {
        // Handle hover logic
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;
        // If the dragged element is hovered in the same place, then do nothing
        if (dragIndex === hoverIndex) {
          return;
        }
        // If it is dragged around other elements, then move the image and set the state with position changes
        moveImage(dragIndex, hoverIndex);
        /*
          Update the index for the dragged item directly to avoid flickering
          when the image was half dragged into the next
        */
        item.index = hoverIndex;
      },
    });

    const [{ isDragging }, drag] = useDrag(() => ({
      type: type, // Use the same type
      item: { id: image.id, index },
      collect: (monitor) => {
        return {
          isDragging: monitor.isDragging(),
        };
      },
    }));

    drag(drop(ref));

    

    return (
      <div
        ref={ref}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className="group relative"
      >
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
  };

  const moveImage = (fromIndex, toIndex) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    setImages(updatedImages);
  };

  const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

  return (
    <div className="relative">
      <div
        style={{ backgroundImage: `url(${background})` }}
        className="h-fit bg-center object-fill  text-white p-4"
      >
        <div className="flex justify-between gap-4 p-1 lg:p-4 items-center">
          <h2 className="font-medium text-sm lg:font-bold lg:text-4xl">
            Gallery
          </h2>
          <div className="flex justify-end gap-2 p-4 items-center">
            <p className="text-sm lg:text-lg lg:font-bold">
              {user && user.email}
            </p>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-blue-600 lg:text-lg p-2 font-bold"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center mt-6">
          <input
            type="text"
            placeholder="Search anything"
            className="p-2 rounded-lg  text-black"
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
            className="p-2 rounded-lg  font-bold border-blue-600 bg-blue-600 text-white"
          >
            Search
          </button>
        </div>
        <div className="flex justify-center font-bold text-lg p-4">
          <p>{errorMessage}</p>
        </div>
      </div>

      <div>
        {isFetching ? (
          <div className="flex justify-center items-center w-full p-4">
            {" "}
            {/* Render loading spinner */}
            <ClipLoader loading={isFetching} size={150} />
          </div>
        ) : (
          <DndProvider backend={backendForDND}>
            <div className="grid place-content-center md:grid-cols-3 lg:grid-cols-4 gap-3 p-14">
              {images.map((image, index) => (
                <ImageItem key={image.id} image={image} index={index} />
              ))}
            </div>
          </DndProvider>
        )}
      </div>
      <div className="flex justify-center items-center p-4">
        <button
          onClick={loadMoreImages}
          className="p-2 font-bold text-white bg-blue-600 rounded-lg"
        >
          Load more
        </button>
      </div>
      <footer className="flex justify-center bottom-0 w-full p-4 font-bold">
        <p>&copy; Adeagbo Ayomide</p>
      </footer>
    </div>
  );
}

export default Image;
