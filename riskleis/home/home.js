const { createApp, ref } = Vue;

createApp({
    setup() {
        const apiKey = 'f8c72830b3e50f4fdd3857dea8cb5d97';
        const topPeliculas = ref([]);
        const backdrops = ref([]);

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

        obtenerTopPeliculas();

        return {
            topPeliculas,
            backdrops,
        }
    }
}).mount('#app');
