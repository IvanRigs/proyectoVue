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

        const obtenerTendencias = () => {
            const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    tendencias.value = data.results || [];
                })
                .catch(error => console.error('Error al obtener tendencias:', error));
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
                    if (data && data.avatar && data.avatar.gravatar && data.avatar.gravatar.hash) {
                        imgPATH.value = `https://secure.gravatar.com/avatar/${data.avatar.gravatar.hash}.jpg?s=64`;
                        tieneImagen.value = true;
                    } else {
                        tieneImagen.value = false;
                    }
                })
                .catch(error => console.error('Error al obtener el perfil del usuario:', error));
        };

        obtenerTopPeliculas();
        obtenerTendencias();


        return {
            topPeliculas,
            backdrops,
            imgPATH,
            tieneImagen,
            tendencias,
            populares,
            series
        }
    }
}).mount('#app');
