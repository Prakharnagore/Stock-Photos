import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";
// "https://api.unsplash.com/photos/?client_id=i_ywvnK7cJzDbIJ3lJ6ht3DlwaPYX3qSSm8ZmihfsZ0";
const clientID = `?client_id=i_ywvnK7cJzDbIJ3lJ6ht3DlwaPYX3qSSm8ZmihfsZ0`;
// const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const fetchImages = async () => {
    setLoading(true);
    let urlPage = `&page=${page}`;
    let urlQuery = `&query=${query}`;
    let url;
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.results);
      setPhotos((oldPhotos) => {
        if (query && page === 1) {
          return data.results;
        } else if (query) {
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data];
        }
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line
  }, [page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchImages();
    setPage(1);
  };

  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      //   console.log(`innerHeight ${window.innerHeight}`);
      //  console.log(`scrollY ${window.scrollY}`);
      // console.log(`body height ${document.body.scrollHeight}`);
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight
      ) {
        setPage((oldPage) => {
          return oldPage + 1;
        });
      }
    });
    return () => window.removeEventListener("scroll", event);
    // eslint-disable-next-line
  }, []);

  return (
    <main>
      <section className="search">
        <form action="" className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search Photos By name"
            className="form-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((image, index) => {
            return <Photo key={image.id} {...image} />;
          })}
        </div>
        {loading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
