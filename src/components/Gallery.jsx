import React, { useEffect, useState } from "react";

const CatImages = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchCatImages = async () => {
      try {
        const apiKey =
          "live_IbHQ5segCge7o5LjzJ7pBwmGmjdDereOWEUDoPQJD04bHYTgfB8sDzgJhTFDHzK2";
        const limit = 10;

        const response = await fetch(
          `https://api.thecatapi.com/v1/images/search?limit=${limit}&api_key=${apiKey}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cat images");
        }

        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching cat images:", error.message);
      }
    };

    fetchCatImages();
  }, []);

  const fetchCatInfo = async (imageId) => {
    try {
      const apiKey =
        "live_IbHQ5segCge7o5LjzJ7pBwmGmjdDereOWEUDoPQJD04bHYTgfB8sDzgJhTFDHzK2";

      const response = await fetch(
        `https://api.thecatapi.com/v1/images/${imageId}?api_key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cat info");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching cat info:", error.message);
      return null;
    }
  };

  const handleNextClick = async () => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);

    const imageId = images[currentImageIndex].id;
    const catInfo = await fetchCatInfo(imageId);

    if (catInfo && catInfo.breeds && catInfo.breeds.length > 0) {
      setGallery((prevGallery) => [...prevGallery, catInfo.breeds[0]]);
    }
  };

  return (
    <div>
      <h2>Cat Images</h2>
      <button onClick={handleNextClick}>Next Cat</button>
      {images.length > 0 && (
        <div>
          <img
            src={images[currentImageIndex].url}
            alt={`Cat ${images[currentImageIndex].id}`}
          />
          {gallery.length > 0 && (
            <div>
              <h3>Cat Info</h3>
              <p>Breed: {gallery[currentImageIndex]?.name || "Unknown"}</p>
              <p>
                Temperament:{" "}
                {gallery[currentImageIndex]?.temperament || "Unknown"}
              </p>
              <p>Origin: {gallery[currentImageIndex]?.origin || "Unknown"}</p>
              <p>
                Life Span: {gallery[currentImageIndex]?.life_span || "Unknown"}
              </p>
              <p>
                Wikipedia:{" "}
                <a
                  href={gallery[currentImageIndex]?.wikipedia_url}
                  target='_blank'
                  rel='noopener noreferrer'>
                  {gallery[currentImageIndex]?.name || "Unknown"} on Wikipedia
                </a>
              </p>
            </div>
          )}
        </div>
      )}

      <div>
        <h2>Gallery</h2>
        <div className='gallery'>
          {gallery.map((catInfo, index) => (
            <div key={index}>
              <img src={catInfo.url} alt={`Cat ${catInfo.id}`} />
              <h4>{catInfo.breeds?.[0]?.name || "Unknown"}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatImages;
