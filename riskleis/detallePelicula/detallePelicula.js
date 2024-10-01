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

        const imgPATH = ref('');
        const tieneImagen = ref(false);

        const movie = ref();
        const loading = ref(true);


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

        const showMovie = (movieId) => {
            localStorage.setItem('movieId', movieId);
            location.href = "../detallePelicula/detallePelicula.html";
        }

        const getMovieId = (movieId) => {
            loading.value = true; // Iniciar carga
            fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    movie.value = data;
                })
                .catch(error => console.error('Error fetching movie details:', error))
                .finally(() => {
                    loading.value = false; // Finalizar carga
                });
        };


        obtenerPerfilUsuario();
        getMovieId(localStorage.getItem('movieId'));

        return {
            imgPATH,
            tieneImagen,
            movie,
            loading,
            showMovie
        }
    }
}).mount('#app');
