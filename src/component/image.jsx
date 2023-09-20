import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // Import the loading spinner
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"; // Import from react-beautiful-dnd

function Image() {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(true);
  const [query, setQuery] = useState("");
  const { user, logout } = UserAuth();
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

  const searchImages = () => {
    // Reset images and current page when performing a new search
    setImages([]);
    setCurrentPage(1);
    setIsFetching(true);

    // Perform the search by changing the query
    // The useEffect hook will then fetch the new images

    // If query is not empty, perform a search
    if (query) {
      const searchUrl = `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}&page=${currentPage}`;
      fetchImages(searchUrl);
    } else {
      // Otherwise, load curated images
      const apiUrl = `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${currentPage}`;
      fetchImages(apiUrl);
    }
  };

  const changeHandler = (e) => {
    setQuery(e.target.value);
  };

  const handleLogout = async (e) => {
    try {
      await logout();
      Navigate("/");
      console.log("You are logged out");
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadMoreImages = () => {
    // Increment the current page when the "Load more" button is clicked
    setCurrentPage((prevPage) => prevPage + 1);
    setIsFetching(true); // Set fetching state to true to show loading spinner
  };

  

  const onDragEnd = (result) => {
  if (!result.destination) {
    // Dropped outside the list
    return;
  }

  const { source, destination } = result;

  if (source.index !== destination.index) {
    // Clone the images array and create a new one
    const updatedImages = [...images];

    // Get the images at source and destination indices
    const sourceImage = updatedImages[source.index];
    const destinationImage = updatedImages[destination.index];

    // Swap their positions in the array
    updatedImages[source.index] = destinationImage;
    updatedImages[destination.index] = sourceImage;

    // Set the updated images array in the state
    setImages(updatedImages);
  }
};




  return (
    <div className="m-4 h-full">
      <div className="flex justify-between gap-4 p-1 lg:p-4 items-center">
        <h2 className="font-medium text-sm lg:font-bold lg:text-4xl">
          Image Gallery
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
      <div className="flex justify-center items-center">
        <input
          type="text"
          placeholder="Search anything"
          className="p-2 rounded-lg border-2 border-slate-800"
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

      <div>
        {isFetching ? (
          <ClipLoader loading={isFetching} size={150} /> // Render loading spinner
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="image-list" >
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid place-content-center md:grid-cols-3 lg:grid-cols-4 gap-3 p-14"
                >
                  {images.map((image, idx) => {
                      let index;
                      return (
                <Draggable
                  key={image.id}
                  draggableId={image.id.toString()}
                  index={idx}
                  onMouseEnter={(e) =>
                    e.currentTarget
                      .querySelector(".photographer-name")
                      .classList.add("opacity-100")
                  }
                  onMouseLeave={(e) =>
                    e.currentTarget
                      .querySelector(".photographer-name")
                      .classList.remove("opacity-100")
                  }
                >
                  {(provided) => {
                    index = idx; // Assign the index variable for this Draggable
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <img
                          src={image.src.large}
                          alt={image.photographer}
                          className="w-64 h-64 lg:w-80 lg:h-80 object-cover relative"
                        />
                        <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-0 left-2 photographer-name text-orange-500 font-bold">
                          {image.photographer}
                        </p>
                      </div>
                    );
                  }}
                </Draggable>
              );
                  } 
                    
                  )}
                  {provided.placeholder /* Add a placeholder here */}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
      <div className="flex justify-center items-center">
        <button
          onClick={loadMoreImages}
          className="p-2 font-bold text-lg bg-blue-700 rounded-lg"
        >
          Load more
        </button>
      </div>
    </div>
  );
}

export default Image;
