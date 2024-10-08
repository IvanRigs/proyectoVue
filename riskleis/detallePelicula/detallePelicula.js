window.onload = function () {
  const navbar = document.querySelector(".contenedor-navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      navbar.classList.add("scroll");
    } else {
      navbar.classList.remove("scroll");
    }
  });
};

const { createApp, ref } = Vue;

createApp({
  setup() {
    const apiKey = "f8c72830b3e50f4fdd3857dea8cb5d97";
    const sessionId = localStorage.getItem("sessionId");

    const imgPATH = ref("");
    const tieneImagen = ref(false);

    const movie = JSON.parse(localStorage.getItem("obj"));
    const loading = ref(true);

    const generos = ref([]);
    let plataformas = ref([]);
    const reparto = ref();
    let genreData = ref([]);
    const puntuacionPromedio = ref();

    const rate = ref(0);
    const ratingsUsuario = ref();
    const isRated = ref(false);
    const accountId = ref();
    const mostrarRange = ref(false);

    console.log(movie);

    const fecha =
      movie.release_date == null
        ? new Date(movie.first_air_date).getFullYear()
        : new Date(movie.release_date).getFullYear();

    // Regresar a home
    const goToHome = () => {
      location.href = "../home/home.html";
    };

    const obtenerPlataformas = () => {
      if (!movie || !movie.id) {
        console.error("No se encontró información de la película o serie.");
        return;
      }

      const url =
        movie.name == null
          ? `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${apiKey}`
          : `https://api.themoviedb.org/3/tv/${movie.id}/watch/providers?api_key=${apiKey}`;

      console.log(`Obteniendo plataformas desde: ${url}`);

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const countryCode = "ES";
          const providers = data.results[countryCode];

          // Mostrar plataformas disponibles
          if (providers != null) {
            if (providers.flatrate != null) {
              plataformas.value = providers.flatrate;
            } else if (providers.rent != null) {
              plataformas.value = providers.rent;
            } else if (providers.buy != null) {
              plataformas.value = providers.buy;
            }
          }
        })
        .catch((error) => {
          console.error("Error al obtener las plataformas:", error);
        });
    };

    obtenerPlataformas();

    const obtenerReparto = () => {
      const url =
        movie.name == null
          ? `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}&language=es-ES`
          : `https://api.themoviedb.org/3/tv/${movie.id}/credits?api_key=${apiKey}&language=es-ES`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          reparto.value = data.cast;
          console.log(reparto);
        })
        .catch((error) => console.error("Error al obtener el reparto:", error));
    };

    const showMediaDetails = (obj) => {
      localStorage.setItem("obj", JSON.stringify(obj));
      location.href = "../detallePelicula/detallePelicula.html";
    };
    obtenerReparto();

    // Obtener video de yutub
    const obtenerTrailer = () => {
      if (!movie || !movie.id) {
        console.error("No se encontró información de la película o serie.");
        return;
      }

      const url =
        movie.name == null
          ? `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=es-ES`
          : `https://api.themoviedb.org/3/tv/${movie.id}/videos?api_key=${apiKey}&language=es-ES`;

      console.log(`Obteniendo tráiler desde: ${url}`);

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          let trailers = data.results.filter(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );

          if (trailers.length === 0) {
            trailers = data.results.filter(
              (video) =>
                video.site === "YouTube" &&
                (video.type === "Teaser" ||
                  video.type === "Clip" ||
                  video.type === "Featurette")
            );

            if (trailers.length === 0) {
              alert("No se encontró ningún tráiler o video promocional.");
              return;
            }
          }

          const trailerUrl = `https://www.youtube.com/watch?v=${trailers[0].key}`;
          window.open(trailerUrl, "_blank");
        })
        .catch((error) => {
          console.error("Error al obtener el tráiler:", error);
          alert("Ocurrió un error al intentar obtener el tráiler.");
        });
    };

    // Llamada para obtener la lista de géneros de películas
    const obtenerGenero = () => {
      const url =
        movie.name == null
          ? `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=es-ES`
          : `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=es-ES`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const genres = data.genres;

          const buscarGenero = () => {
            movie.genre_ids.forEach((idGenero) => {
              generos.value.push(
                genres.find((genre) => genre.id === idGenero).name
              );
            });
          };

          buscarGenero();
        })
        .catch((error) =>
          console.error("Error al obtener los géneros:", error)
        );
    };
    obtenerGenero();

    const obtenerPerfilUsuario = () => {
      if (!sessionId) {
        console.error("No se encontró la session_id.");
        return;
      }

      const url = `https://api.themoviedb.org/3/account?session_id=${sessionId}&api_key=${apiKey}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (
            data &&
            data.avatar &&
            data.avatar.gravatar &&
            data.avatar.gravatar.hash
          ) {
            imgPATH.value = `https://secure.gravatar.com/avatar/${data.avatar.gravatar.hash}.jpg?s=64`;
            tieneImagen.value = true;
          } else {
            tieneImagen.value = false;
          }
        })
        .catch((error) =>
          console.error("Error al obtener el perfil del usuario:", error)
        );
    };

    obtenerPerfilUsuario();

    const ocultarImagen = (event) => {
      event.target.style.display = "none";
    };

    const obtenerPeliculasMismoGenero = () => {
      const url =
        movie.name == null
          ? `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es-ES&with_genres=${movie.genre_ids[0]}&page=1`
          : `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=es-ES&with_genres=${movie.genre_ids[0]}&page=1`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          genreData.value = data.results;
          console.log(genreData);
        })
        .catch((error) => {
          console.error(
            "Error al obtener las películas del mismo género:",
            error
          );
        });
    };

    obtenerPeliculasMismoGenero();

    const obtenerPuntuacionPromedio = () => {
      const url =
        movie.name == null
          ? `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=es-ES`
          : `https://api.themoviedb.org/3/tv/${movie.id}?api_key=${apiKey}&language=es-ES`;

      fetch(url)
        .then((response) => response.json())
        .then((movieData) => {
          puntuacionPromedio.value = parseInt(movieData.vote_average * 10);
        })
        .catch((error) => {
          console.error(
            "Error al obtener la puntuación promedio de la película:",
            error
          );
        });
    };

    obtenerPuntuacionPromedio();

    const addRate = (rater) => {
      rater = rater === "0" ? "0.5" : rater;

      if (!localStorage.getItem("sessionId")) {
        alert("Debes iniciar sesión para calificar una película.");
        return;
      }

      const url =
        movie.name == null
          ? `https://api.themoviedb.org/3/movie/${movie.id}/rating?api_key=${apiKey}&session_id=${sessionId}`
          : `https://api.themoviedb.org/3/tv/${movie.id}/rating?api_key=${apiKey}&session_id=${sessionId}`;

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: rater }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              const errorMessage =
                errorData.status_message ||
                "Error desconocido al enviar la calificación.";
              throw new Error(`Error en la solicitud: ${errorMessage}`);
            });
          }
          return response.json();
        })
        .then((data) => {
          rate.value = rater * 10;
          mostrarRange.value = !mostrarRange.value;
        })
        .catch((error) => {
          console.error("Error al enviar la calificación:", error.message);
          alert(`Hubo un problema al enviar tu calificación: ${error.message}`);
        });
    };

    // const obtenerCalificacionUsuario = () => {
    //     const url = movie.name == null
    //         ? `https://api.themoviedb.org/3/movie/${movie.id}/rating?api_key=${apiKey}&session_id=${sessionId}`
    //         : `https://api.themoviedb.org/3/tv/${movie.id}/rating?api_key=${apiKey}&session_id=${sessionId}`;

    //     fetch(url)
    //         .then(response => {
    //             if (!response.ok) {
    //                 console.error(`Error ${response.status}: ${response.statusText}`);
    //                 rate.value = '-1';
    //                 throw new Error('Error al obtener la calificación');
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             console.log('Calificación del usuario:', data);
    //             rate.value = data;
    //         })
    //         .catch(error => {
    //             console.error('Error al obtener la calificación del usuario:', error);
    //         });
    // };

    const verificarSession = () => {
      const url = `https://api.themoviedb.org/3/account?session_id=${sessionId}&api_key=${apiKey}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          accountId.value = data.id;
          console.log(accountId);
        })
        .catch((error) => {
          console.error("Error al verificar la sesión:", error);
        });
    };

    verificarSession();

    const obtenerSeriesValoradasUsuario = () => {
      const url =
        movie.name == null
          ? `https://api.themoviedb.org/3/account/${accountId}/rated/movies?api_key=${apiKey}&session_id=${sessionId}`
          : `https://api.themoviedb.org/3/account/${accountId}/rated/tv?api_key=${apiKey}&session_id=${sessionId}`;

      fetch(url)
        .then((response) => response.json())
        .then((response) => {
          ratingsUsuario.value = JSON.parse(JSON.stringify(response)).results;
          estaValorada();
        })
        .catch((err) => console.error(err));
    };

    const estaValorada = () => {
      ratingsUsuario.value.forEach((item) => {
        if (item.id == movie.id) {
          isRated.value = true;
          rate.value = item.rating * 10;
        }
      });
    };

    obtenerSeriesValoradasUsuario();

    const rateMenu = () => {
      mostrarRange.value = !mostrarRange.value;
    };

    const goToActor = (actor) => {
      localStorage.setItem("artistaId", actor);
      location.href = "../detalleArtista/detalleArtista.html";
    };

    return {
      imgPATH,
      tieneImagen,
      movie,
      loading,
      fecha,
      generos,
      plataformas,
      reparto,
      genreData,
      puntuacionPromedio,
      rate,
      goToHome,
      obtenerGenero,
      obtenerTrailer,
      ocultarImagen,
      showMediaDetails,
      rateMenu,
      mostrarRange,
      addRate,
      goToActor,
    };
  },
}).mount("#app");
