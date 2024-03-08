import React, { useEffect, useState } from "react";

const DogImages = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchDogImages = async () => {
      try {
        const apiKey =
          "live_IbHQ5segCge7o5LjzJ7pBwmGmjdDereOWEUDoPQJD04bHYTgfB8sDzgJhTFDHzK2";
        const limit = 10;

        const response = await fetch(
          `https://api.thedogapi.com/v1/images/search?limit=${limit}&api_key=${apiKey}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dog images");
        }

        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching dog images:", error.message);
      }
    };

    fetchDogImages();
  }, []);

  useEffect(() => {
    console.log("Updated Gallery:", gallery);
  }, [gallery]);

  const fetchDogInfo = async (imageId) => {
    try {
      const apiKey =
        "live_IbHQ5segCge7o5LjzJ7pBwmGmjdDereOWEUDoPQJD04bHYTgfB8sDzgJhTFDHzK2";

      const response = await fetch(
        `https://api.thedogapi.com/v1/images/${imageId}?api_key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dog info");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching dog info:", error.message);
      return null;
    }
  };

  const handleNextClick = async () => {
    try {
      const nextIndex = (currentImageIndex + 1) % images.length;
      setCurrentImageIndex(nextIndex);

      const imageId = images[nextIndex]?.id; // Use optional chaining to handle potential undefined
      const dogInfo = await fetchDogInfo(imageId);

      if (dogInfo && dogInfo.breeds && dogInfo.breeds.length > 0) {
        setGallery((prevGallery) => [
          ...prevGallery,
          {
            ...dogInfo.breeds[0],
            url: images[nextIndex]?.url,
            id: images[nextIndex]?.id,
          },
        ]);
      } else {
        setGallery((prevGallery) => [
          ...prevGallery,
          {
            name: "Unknown",
            temperament: "Unknown",
            origin: "Unknown",
            life_span: "Unknown",
            wikipedia_url: "Unknown",
            url: images[nextIndex]?.url,
            id: images[nextIndex]?.id,
          },
        ]);
      }

      // Log the updated gallery state
      console.log("Updated Gallery:", gallery);
    } catch (error) {
      console.error("Error in handleNextClick:", error.message);
    }
  };

  return (
    <div>
      <h2>Dog Images</h2>
      <button onClick={handleNextClick}>Next Dog</button>
      {images.length > 0 && gallery.length > 0 && (
        <div>
          <img
            src={images[currentImageIndex].url}
            alt={`Dog ${images[currentImageIndex].id}`}
          />
          <div>
            <h3>Dog Info</h3>
            <p>
              Breed: {images[currentImageIndex]?.breeds[0]?.name || "Unknown"}
            </p>
            <p>
              Temperament:{" "}
              {images[currentImageIndex]?.breeds[0]?.temperament || "Unknown"}
            </p>
            <p>
              Origin:{" "}
              {images[currentImageIndex]?.breeds[0]?.origin || "Unknown"}
            </p>
            <p>
              Life Span:{" "}
              {images[currentImageIndex]?.breeds[0]?.life_span || "Unknown"}
            </p>
          </div>
        </div>
      )}

      <div>
        <h2>Gallery</h2>
        <div className='gallery'>
          {gallery.map((dogInfo, index) => (
            <div key={index}>
              {/* Display dog images and information from the gallery */}
              <img src={images[index]?.url} alt={`Dog ${images[index]?.id}`} />
              <h4>{dogInfo.name}</h4>
              <p>Temperament: {dogInfo.temperament}</p>
              <p>Origin: {dogInfo.origin}</p>
              <p>Life Span: {dogInfo.life_span}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DogImages;
