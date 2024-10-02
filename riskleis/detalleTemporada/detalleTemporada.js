window.onload = function() {
    const navbar = document.querySelector('.contenedor-navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scroll');
        } else {
            navbar.classList.remove('scroll');
        }
    });

    // Verificar si la página ya se ha refrescado
    if (!sessionStorage.getItem('hasRefreshed')) {
        // Refrescar automáticamente la página una vez al cargar
        setTimeout(() => {
            sessionStorage.setItem('hasRefreshed', 'true'); // Marcar que se ha refrescado
            location.reload();
        }, 2000); // 2000 ms = 1 segundo
    }
};

const { createApp, ref } = Vue;

createApp({
    setup() {
        const apiKey = 'f8c72830b3e50f4fdd3857dea8cb5d97';
        const imgPATH = ref('');
        const tieneImagen = ref(false);
        const topPeliculas = ref([]);
        const backdrops = ref([]);
        const temporadas = ref([]);
        const serieTitulo = ref('');
        const serieDescripcion = ref('');
        const seriesId = 124364; // Cambia esto por el ID de la serie
        const estrellasInvitadas = ref([]);

        const obtenerTopPeliculas = () => {
            const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=es-ES&page=1`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.results && data.results.length > 0) {
                        topPeliculas.value = data.results.slice(0, 3);
                    } else {
                        console.error('No se encontraron películas.');
                    }
                })
                .catch(error => console.error('Error:', error));
        };

        const obtenerDetallesSerie = () => {
            const url = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&language=es-ES`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    serieTitulo.value = data.name;
                    serieDescripcion.value = data.overview;

                    if (data.backdrop_path) {
                        backdrops.value.push(`https://image.tmdb.org/t/p/w1280${data.backdrop_path}`);
                    }
                })
                .catch(error => console.error('Error al obtener detalles de la serie:', error));
        };

        const obtenerTemporadas = () => {
            const url = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&language=es-ES`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const seasons = data.seasons;
                    seasons.sort((a, b) => a.season_number - b.season_number); // Ordenar las temporadas

                    // Uso de Promise.all para esperar a que se carguen todos los episodios
                    const seasonPromises = seasons.map(temporada => {
                        return cargarEpisodios(temporada);
                    });

                    Promise.all(seasonPromises).then(seasonsWithEpisodes => {
                        temporadas.value = seasonsWithEpisodes;
                    });
                })
                .catch(error => console.error('Error al obtener temporadas:', error));
        };

        const cargarEpisodios = (temporada) => {
            const episodios = new Array(temporada.episode_count).fill(null);
            const episodePromises = [];

            for (let i = 1; i <= temporada.episode_count; i++) {
                const promise = fetch(`https://api.themoviedb.org/3/tv/${seriesId}/season/${temporada.season_number}/episode/${i}/images?api_key=${apiKey}&language=es-ES&include_image_language=en,null`)
                    .then(response => response.json())
                    .then(episodeData => {
                        const imagenEpisodio = episodeData.stills.length > 0 ? `https://image.tmdb.org/t/p/w500${episodeData.stills[0].file_path}` : 'default.png';
                        episodios[i - 1] = {
                            id: i,
                            imagen: imagenEpisodio
                        };
                    })
                    .catch(error => console.error('Error al obtener imagen del episodio:', error));
                episodePromises.push(promise);
            }

            return Promise.all(episodePromises).then(() => {
                const temporadaTitulo = temporada.season_number === 0 ? 'Especiales' : `Temporada ${temporada.season_number}`;
                return {
                    titulo: temporadaTitulo,
                    numero: temporada.season_number,
                    episodios
                };
            });
        };

        const seleccionarEpisodio = (episodioId, temporadaNumero) => {
            const url = `https://api.themoviedb.org/3/tv/${seriesId}/season/${temporadaNumero}/episode/${episodioId}/credits?api_key=${apiKey}&language=en-US`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    estrellasInvitadas.value = data.guest_stars;
                    const modal = new bootstrap.Modal(document.getElementById('modalEstrellas'));
                    modal.show();
                })
                .catch(error => console.error('Error al obtener estrellas invitadas:', error));
        };

        obtenerTopPeliculas();
        obtenerDetallesSerie();
        obtenerTemporadas();

        return {
            imgPATH,
            tieneImagen,
            topPeliculas,
            backdrops,
            temporadas,
            serieTitulo,
            serieDescripcion,
            estrellasInvitadas,
            seleccionarEpisodio
        };
    }
}).mount('#app');
