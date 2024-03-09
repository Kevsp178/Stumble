import React, { useEffect, useState } from "react";

const DogImages = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [gallery, setGallery] = useState([]);
  const [banList, setBanList] = useState([]);
  const [featureBanList, setFeatureBanList] = useState([]);

  useEffect(() => {
    const fetchDogImages = async () => {
      try {
        const apiKey =
          "live_IbHQ5segCge7o5LjzJ7pBwmGmjdDereOWEUDoPQJD04bHYTgfB8sDzgJhTFDHzK2";
        const limit = 10;

        // Exclude images with banned attributes
        const excludedBreeds = banList
          .map((bannedBreed) => `&exclude_breeds=${bannedBreed}`)
          .join("");
        const response = await fetch(
          `https://api.thedogapi.com/v1/images/search?limit=${limit}&api_key=${apiKey}${excludedBreeds}`
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
  }, [banList]);

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
      console.log("Fetched dog info in fetchDogInfo:", data); // Add this line
      return data;
    } catch (error) {
      console.error("Error fetching dog info in fetchDogInfo:", error.message);
      return null;
    }
  };

  const addToBanList = (breedName) => {
    setBanList((prevBanList) => [...prevBanList, breedName]);
  };

  const addToFeatureBanList = (feature) => {
    if (!featureBanList.some((ban) => ban.name === feature.name)) {
      setFeatureBanList((prevList) => [...prevList, feature]);
      console.log(`Banned feature: ${feature.name}`);
    } else {
      console.log(`${feature.name} is already in the ban list`);
    }
  };

  const clearFeatureBanList = () => {
    setFeatureBanList([]);
    console.log("Feature Ban List cleared");
  };

  const shouldExcludeDog = (dogInfo) => {
    return featureBanList.some((feature) => {
      // Check if the feature is within the banned range
      if (feature.min !== undefined && feature.max !== undefined) {
        const featureValue = parseFloat(dogInfo[feature.name]);
        return featureValue >= feature.min && featureValue <= feature.max;
      }
      // Check if the feature exactly matches the banned value
      return dogInfo[feature.name] === feature.value;
    });
  };

  useEffect(() => {
    console.log("Updated Gallery:", gallery);
  }, [gallery]);

  useEffect(() => {
    console.log("Updated Feature Ban List:", featureBanList);
  }, [featureBanList]);

  const handleNextClick = async () => {
    try {
      console.log("Clicking Next Dog button");

      const nextIndex = (currentImageIndex + 1) % images.length;
      setCurrentImageIndex(nextIndex);

      const imageId = images[nextIndex]?.id;

      if (imageId) {
        console.log("Fetching dog info for imageId:", imageId);
        const dogInfo = await fetchDogInfo(imageId);

        console.log("Fetched dog info:", dogInfo);
        console.log("Current Image Index:", currentImageIndex);
        console.log("Next Index:", nextIndex);
        console.log("Current Image ID:", imageId);

        // Check if the dog should be excluded based on the feature ban list
        if (!shouldExcludeDog(dogInfo)) {
          console.log("Dog is not excluded. Adding to gallery.");

          if (dogInfo && dogInfo.breeds && dogInfo.breeds.length > 0) {
            setGallery((prevGallery) => [
              ...prevGallery,
              {
                ...dogInfo.breeds[0],
                url: images[nextIndex]?.url,
                id: imageId,
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
                id: imageId,
              },
            ]);
          }
        } else {
          console.log(`Dog excluded due to feature ban: ${dogInfo.name}`);
          // If the dog is excluded, trigger the next click recursively
          handleNextClick();
        }
      }
    } catch (error) {
      console.error("Error in handleNextClick:", error.message);
    }
  };

  // Add this useEffect to log the updated gallery state
  useEffect(() => {
    console.log("Updated Gallery:", gallery);
  }, [gallery]);

  return (
    <div>
      <h2>Dog Images</h2>
      <button onClick={handleNextClick}>Next Dog</button>

      {/* ... (your existing code) */}

      <div>
        <h2>Gallery</h2>

        {/* Display banned features */}
        {featureBanList.length > 0 && (
          <div>
            <h3>Banned Features</h3>
            <ul>
              {featureBanList.map((feature, index) => (
                <li key={index}>{`${feature.name}: ${feature.value}`}</li>
              ))}
            </ul>
            <button onClick={clearFeatureBanList}>
              Clear Feature Ban List
            </button>
          </div>
        )}

        <div className='gallery'>
          {gallery.map((dogInfo, index) => (
            <div key={index}>
              {/* Display dog images and information from the gallery */}
              <img src={images[index]?.url} alt={`Dog ${images[index]?.id}`} />
              <h4>{dogInfo.name}</h4>
              <p>Temperament: {dogInfo.temperament}</p>
              <p>Life Span: {dogInfo.life_span}</p>
              {/* Add a button to ban the feature */}
              <button
                onClick={() =>
                  addToFeatureBanList({
                    name: "life_span",
                    value: dogInfo.life_span,
                  })
                }
                disabled={featureBanList.some(
                  (ban) => ban.name === "life_span"
                )}>
                {featureBanList.some((ban) => ban.name === "life_span")
                  ? "Life Span Banned"
                  : `Ban Life Span: ${dogInfo.life_span}`}
              </button>
              {/* You can add buttons for other features in a similar way */}
              {/* Add a button to ban the breed */}
              <button onClick={() => addToBanList(dogInfo.name)}>
                Ban Breed
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DogImages;
