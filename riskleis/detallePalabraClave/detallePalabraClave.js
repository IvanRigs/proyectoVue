// Código JavaScript completo
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
        const topPeliculas = ref([]); // Para las películas que se mostrarán en el banner
        const backdropsBanner = ref([]); // Backdrops solo para el banner
        const backdrops = ref([]); // Backdrops para el contenido general
        const imgPATH = ref('');
        const tieneImagen = ref(false);
        const contenido = ref([]); // Contenido general (películas de misterio)
        const tipo = ref('movie'); // 'movie' para películas y 'tv' para series
        
        const generoEspecifico = ref(9648); // ID del género "Misterio"
        const generos = ref([]);
        const opcionesVisibles = ref(false);

        // Obtener géneros basado en el tipo (películas o series)
        const obtenerGeneros = () => {
            const url = `https://api.themoviedb.org/3/genre/${tipo.value}/list?api_key=${apiKey}&language=es-ES`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    generos.value = data.genres || [];
                    const generoTerror = generos.value.find(g => g.id === 9648); //misterio
                    generoEspecifico.value = generoTerror ? generoTerror.id : null;
                })
                .catch(error => console.error('Error al obtener géneros:', error));
        };

        // Obtener todas las películas o series del género específico (en este caso, terror)
        const obtenerContenido = () => {
            contenido.value = [];
            backdrops.value = [];

            const url = `https://api.themoviedb.org/3/discover/${tipo.value}?api_key=${apiKey}&language=es-ES&page=1&with_genres=${generoEspecifico.value}`;
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error al obtener datos: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    contenido.value = data.results || [];
                    contenido.value.forEach(item => {
                        if (item.backdrop_path) {
                            const backdropUrl = `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`;
                            backdrops.value.push(backdropUrl);
                        }
                    });
                })
                .catch(error => console.error('Error al obtener contenido:', error));
        };

        // Obtener películas mejor valoradas para el banner
        const obtenerTopPeliculas = () => {
            const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=es-ES&page=1`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.results && data.results.length > 0) {
                        topPeliculas.value = data.results.slice(0, 3); // Solo las primeras 3 películas
                        topPeliculas.value.forEach((pelicula) => {
                            if (pelicula.backdrop_path) {
                                const backdropUrl = `https://image.tmdb.org/t/p/w1280${pelicula.backdrop_path}`;
                                backdropsBanner.value.push(backdropUrl); // Guardar backdrops para el banner
                            }
                        });
                    } else {
                        console.error('No se encontraron películas.');
                    }
                })
                .catch(error => console.error('Error al obtener Top Películas:', error));
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
                    if (data && data.avatar && data.avatar.gravatar && data.avatar.gravatar.hash) {
                        imgPATH.value = `https://secure.gravatar.com/avatar/${data.avatar.gravatar.hash}.jpg?s=64`;
                        tieneImagen.value = true;
                    } else {
                        tieneImagen.value = false;
                    }
                })
                .catch(error => console.error('Error al obtener el perfil del usuario:', error));
        };

        const mostrarDetalles = (movieId) => {
            console.log(`Mostrar detalles de la ${tipo.value === 'movie' ? 'película' : 'serie'} con ID: ${movieId}`);
        };

        const obtenerNombreGenero = (id) => {
            const genero = generos.value.find(g => g.id === id);
            return genero ? genero.name : 'Desconocido';
        };

        // Cambiar entre películas y series y recargar géneros y contenido
        const cambiarTipo = (nuevoTipo) => {
            tipo.value = nuevoTipo;
            obtenerGeneros(); // Obtener géneros del nuevo tipo (películas o series)
            obtenerContenido(); // Recargar contenido según el tipo y género
        };

        const mostrarOpciones = () => {
            opcionesVisibles.value = true;
        };

        const ocultarOpciones = () => {
            opcionesVisibles.value = false;
        };

        // Llamadas iniciales
        obtenerGeneros();
        obtenerContenido(); // Obtener todas las películas del género de terror
        obtenerTopPeliculas(); // Obtener las películas mejor valoradas para el banner
        obtenerPerfilUsuario();

        return {
            topPeliculas, // Películas para el banner
            backdropsBanner, // Backdrops solo para el banner
            backdrops, // Backdrops para el contenido general
            imgPATH,
            tieneImagen,
            contenido,
            tipo,
            generoEspecifico,
            generos,
            obtenerNombreGenero,
            mostrarDetalles,
            cambiarTipo,
            mostrarOpciones,
            ocultarOpciones,
            opcionesVisibles
        };
    }
}).mount('#app');
