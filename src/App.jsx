import { useState } from "react";
import "./App.css";
import APIForm from "./components/APIForm";
import Gallery from "./components/Gallery";

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [inputs, setInputs] = useState({
    url: "",
    format: "",
    no_ads: "",
    no_cookie_banners: "",
    width: "",
    height: "",
  });

  const [currentImage, setCurrentImage] = useState(null);
  const [prevImages, setPrevImages] = useState([]);

  const submitForm = async () => {
    let defaultValues = {
      format: "jpeg",
      no_ads: "true",
      no_cookie_banners: "true",
      width: "1920",
      height: "1080",
    };

    if (inputs.url === "" || inputs.url.trim() === "") {
      alert("You forgot to submit a URL!");
      return;
    }

    const updatedInputs = { ...inputs };

    for (const [key, value] of Object.entries(updatedInputs)) {
      if (value === "") {
        updatedInputs[key] = defaultValues[key];
      }
    }

    const query = makeQuery(updatedInputs);
    await callAPI(query);
  };

  const makeQuery = (inputs) => {
    let wait_until = "network_idle";
    let response_type = "json";
    let fail_on_status = "400%2C404%2C500-511";
    let url_starter = "https://";
    let encodedURL = encodeURIComponent(inputs.url);
    return `${url_starter}api.apiflash.com/v1/urltoimage?access_key=${API_KEY}&url=${encodedURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;
  };
  const reset = () => {
    setInputs({
      url: "",
      format: "",
      no_ads: "",
      no_cookie_banners: "",
      width: "",
      height: "",
    });
  };

  const callAPI = async (query) => {
    try {
      const response = await fetch(query);
      const json = await response.json();

      if (json.url == null) {
        alert("Oops! Something went wrong with that query, let's try again!");
      } else {
        setCurrentImage(json.url);
        setPrevImages((images) => [...images, json.url]);
        reset();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Oops! Something went wrong. Please try again later.");
    }
  };

  return (
    <div className='whole-page'>
      <h1>Build Your Own Screenshot! 📸</h1>
      <APIForm
        inputs={inputs}
        handleChange={(e) =>
          setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.trim(),
          }))
        }
        onSubmit={submitForm}
      />
      {currentImage ? (
        <img
          className='screenshot'
          src={currentImage}
          alt='Screenshot returned'
        />
      ) : (
        <div> </div>
      )}
      <div className='container'>
        <h3> Current Query Status: </h3>
        <p>
          https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY
          <br></br>
          &url={inputs.url} <br></br>
          &format={inputs.format} <br></br>
          &width={inputs.width}
          <br></br>
          &height={inputs.height}
          <br></br>
          &no_cookie_banners={inputs.no_cookie_banners}
          <br></br>
          &no_ads={inputs.no_ads}
          <br></br>
        </p>
      </div>
      <div className='container'>
        <Gallery images={prevImages} />
      </div>
      <br></br>
      <br />
    </div>
  );
}

export default App;
