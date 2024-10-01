window.onload = function() {
    const navbar = document.querySelector('.contenedor-navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scroll');
        } else {
            navbar.classList.remove('scroll');
        }
    });
};

const { createApp, ref } = Vue;

createApp({
    setup() {
        const apiKey = 'f8c72830b3e50f4fdd3857dea8cb5d97';
        const sessionId = localStorage.getItem('sessionId');
        const topPeliculas = ref([]);
        const backdrops = ref([]);
        const imgPATH = ref('');
        const tieneImagen = ref(false);

        const tendencias = ref([]);
        const populares = ref([]);
        const peliculasGratis = ref([]);
        const series = ref([]);

        const movie = ref();

        const obtenerTendencias = () => {
            const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=es-ES&page=1`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    tendencias.value = data.results || [];
                })
                .catch(error => console.error('Error al obtener tendencias:', error));
        };

        const obtenerPopulares = () => {
            const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=1`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    populares.value = data.results || [];
                })
                .catch(error => console.error('Error al obtener populares:', error));
        };

        const obtenerSeries = () => {
            const url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=es-ES&page=1`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    series.value = data.results || [];
                })
                .catch(error => console.error('Error al obtener series:', error));
        };

        const obtenerPeliculasGratis = () => {
            const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es-ES&watch_region=US&with_watch_monetization_types=free`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    peliculasGratis.value = data.results || [];
                })
                .catch(error => console.error('Error al obtener películas gratis:', error));
        };

        const obtenerTopPeliculas = () => {
            const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=es-ES&page=1`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.results && data.results.length > 0) {
                        topPeliculas.value = data.results.slice(0, 3);
                        topPeliculas.value.forEach((pelicula) => {
                            if (pelicula.backdrop_path) {
                                const backdropUrl = `https://image.tmdb.org/t/p/w1280${pelicula.backdrop_path}`;
                                backdrops.value.push(backdropUrl);
                            }
                        });
                    } else {
                        console.error('No se encontraron películas.');
                    }
                })
                .catch(error => console.error('Error:', error));
        };

        const obtenerPerfilUsuario = () => {
            if (!sessionId) {
                console.error('No se encontró la session_id.');
                return;
            }

            const url = `https://api.themoviedb.org/3/account?session_id=${sessionId}&api_key=${apiKey}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                     console.log(data);
                    if (data && data.avatar && data.avatar.gravatar && data.avatar.gravatar.hash) {
                        imgPATH.value = `https://secure.gravatar.com/avatar/${data.avatar.gravatar.hash}.jpg?s=64`;
                        console.log(imgPATH);
                        tieneImagen.value = true;
                    } else {
                        console.log("dadsa");
                        tieneImagen.value = false;
                    }
                })
                .catch(error => console.error('Error al obtener el perfil del usuario:', error));
        };

        const showMovie = (movieId) => {
            localStorage.setItem('movieId', movieId);
            location.href = "../detallePelicula/detallePelicula.html";
        }

        const getMovieId = (movieId) => {

            fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es-ES`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    movie.value = data;
                    console.log(movie.value)
                })
                .catch(error => console.error('Error fetching movie details:', error));

        }

        obtenerTopPeliculas();
        obtenerTendencias();
        obtenerPerfilUsuario();
        obtenerPopulares();
        obtenerSeries();
        obtenerPeliculasGratis();


        return {
            topPeliculas,
            backdrops,
            imgPATH,
            tieneImagen,
            tendencias,
            populares,
            series,
            peliculasGratis,
            movie,
            showMovie
        }
    }
}).mount('#app');
