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
        const imgPATH = ref(''); // Ruta de la imagen de perfil
        const tieneImagen = ref(false); // Indica si hay imagen de perfil
        const topPeliculas = ref([]); // Películas mejor valoradas
        const backdrops = ref([]); // Fondos de la serie
        const temporadas = ref([]); // Temporadas de la serie
        const serieTitulo = ref(''); // Título de la serie
        const serieDescripcion = ref(''); // Descripción de la serie
        const seriesId = 194764; // CAMBIA ESTO AL ID DE LA SERIE
        const estrellasInvitadas = ref([]); // Estrellas invitadas

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
                    serieTitulo.value = data.name; // Obtener el título de la serie
                    serieDescripcion.value = data.overview; // Obtener la descripción de la serie
                    // Si hay una imagen de fondo, añadirla
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

                    // Para cada temporada, obtener los episodios
                    seasons.forEach(temporada => {
                        const episodios = new Array(temporada.episode_count).fill(null); // Arreglo para los episodios
                        let episodiosCargados = 0; // Contador para saber cuándo todos los episodios están cargados

                        for (let i = 1; i <= temporada.episode_count; i++) {
                            fetch(`https://api.themoviedb.org/3/tv/${seriesId}/season/${temporada.season_number}/episode/${i}/images?api_key=${apiKey}&language=es-ES&include_image_language=en,null`)
                                .then(response => response.json())
                                .then(episodeData => {
                                    const imagenEpisodio = episodeData.stills.length > 0 ? `https://image.tmdb.org/t/p/w500${episodeData.stills[0].file_path}` : 'default.png';

                                    // Almacenar el episodio en el índice correcto
                                    episodios[i - 1] = {
                                        id: i,
                                        imagen: imagenEpisodio
                                    };

                                    episodiosCargados++; // Incrementamos el contador

                                    // Cuando se hayan obtenido todos los episodios, añadir la temporada a la lista
                                    if (episodiosCargados === temporada.episode_count) {
                                        temporadas.value.push({
                                            numero: temporada.season_number,
                                            episodios: episodios.filter(ep => ep !== null) // Filtrar episodios nulos
                                        });
                                    }
                                })
                                .catch(error => console.error('Error al obtener los episodios:', error));
                        }
                    });
                })
                .catch(error => console.error('Error al obtener las temporadas:', error));
        };

        const obtenerEstrellasInvitadas = (temporadaNumero) => {
            const url = `https://api.themoviedb.org/3/tv/${seriesId}/season/${temporadaNumero}/aggregate_credits?language=en-US`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    estrellasInvitadas.value = data.guest_stars || [];
                    // Mostrar el modal
                    const modal = new bootstrap.Modal(document.getElementById('modalEstrellas'));
                    modal.show();
                })
                .catch(error => console.error('Error al obtener las estrellas invitadas:', error));
        };

        const seleccionarEpisodio = (episodioId, temporadaNumero) => {
            obtenerEstrellasInvitadas(temporadaNumero); // Obtener estrellas invitadas de la temporada
        };

        obtenerTopPeliculas(); // Llamar a la función para obtener las películas al iniciar
        obtenerDetallesSerie(); // Llamar a la función para obtener detalles de la serie
        obtenerTemporadas(); // Llamar a la función para obtener las temporadas al iniciar

        return { imgPATH, tieneImagen, topPeliculas, backdrops, temporadas, serieTitulo, serieDescripcion, seleccionarEpisodio, estrellasInvitadas };
    }
}).mount('#app');
