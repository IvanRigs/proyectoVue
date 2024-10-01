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
        const imgPATH = ref('');
        const tieneImagen = ref(false);
        const topPeliculas = ref([]);
        const backdrops = ref([]);
        const temporadas = ref([]); // Aquí guardaremos las temporadas y episodios
        const seriesId = 194764; // CAMBIA ESTO AL ID DE LA SERIE

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

        const obtenerTemporadas = () => {
            const url = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&language=es-ES`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const seasons = data.seasons;

                    // Para cada temporada, obtener los episodios
                    seasons.forEach(temporada => {
                        const episodios = [];
                        const episodeCount = temporada.episode_count;

                        let episodiosCargados = 0; // Contador para saber cuándo todos los episodios están cargados

                        for (let i = 1; i <= episodeCount; i++) {
                            fetch(`https://api.themoviedb.org/3/tv/${seriesId}/season/${temporada.season_number}/episode/${i}/images?api_key=${apiKey}&language=es-ES`)
                                .then(response => response.json())
                                .then(episodeData => {
                                    console.log(`Episodio ${i} Data:`, episodeData); // Verificamos la respuesta
                                    const imagenEpisodio = episodeData.stills.length > 0 ? `https://image.tmdb.org/t/p/w500${episodeData.stills[0].file_path}` : 'default.jpg'; // Cambia 'default.jpg' si no hay imagen

                                    episodios.push({
                                        id: i,
                                        imagen: imagenEpisodio
                                    });

                                    episodiosCargados++; // Incrementamos el contador

                                    // Cuando se hayan obtenido todos los episodios, añadir la temporada a la lista
                                    if (episodiosCargados === episodeCount) {
                                        temporadas.value.push({
                                            numero: temporada.season_number,
                                            episodios: episodios
                                        });
                                    }
                                })
                                .catch(error => console.error('Error al obtener los episodios:', error));
                        }
                    });
                })
                .catch(error => console.error('Error al obtener las temporadas:', error));
        };

        obtenerTopPeliculas(); // Llamar a la función para obtener las películas al iniciar
        obtenerTemporadas(); // Llamar a la función para obtener las temporadas al iniciar

        return { imgPATH, tieneImagen, topPeliculas, backdrops, temporadas };
    }
}).mount('#app');
