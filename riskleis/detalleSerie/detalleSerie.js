const { createApp, ref } = Vue;

createApp({
    setup(){
        const sessionId = ref(localStorage.getItem('sessionId'))
        const serieId = ref(231000)
        const urlParams = ref('')
        const obtenerObjeto = JSON.parse(localStorage.getItem('obj'))
        const apiKey = 'f8c72830b3e50f4fdd3857dea8cb5d97';

        const detallesSerie = ref({})
        const keywordsSerie = ref({})
        const ratingsUsuario = ref({})
        const castSerie = ref({})
        const videosSerie = ref({})
        const recomendacionesSerie = ref({})
        const listaTemporadas = ref({})

        const date = ref([])
        const year = ref('')
        const isLoading = ref(true)
        const isOverview = ref(false)
        const isRated = ref(false)
        const isFavorite = ref(false)
        const votosPromedio = ref(0)
        let puntuacion = ref(0)
        const recomPagTotales = ref(0)
        const votosPorcentaje = ref('')
        const styleBackg = ref('')
        
        const imgPATH = ref('');
        const tieneImagen = ref(false);
        const logout = ref(false)
        const estaLogeado = ref(false)

        return {
            serieId,
            isLoading,
            detallesSerie,
            isOverview,
            votosPromedio,
            votosPorcentaje,
            styleBackg,
            keywordsSerie,
            isRated,
            sessionId,
            ratingsUsuario,
            puntuacion,
            isFavorite,
            castSerie,
            videosSerie,
            recomPagTotales,
            recomendacionesSerie,
            serieId,
            urlParams,
            listaTemporadas,
            obtenerObjeto,
            imgPATH,
            tieneImagen,
            logout,
            estaLogeado,
            apiKey
        }
    },
    methods: {
        obtenerDetallesPeli(){
            const options = {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWQ4MDQzMTU0MWViYTZiYjQ0MjE2MWZhYTJjMDA3ZCIsIm5iZiI6MTcyNzcyNjIxNS45NjQwNDgsInN1YiI6IjY2ZjJmNzA0YTgyYjAwNTcwMzI3MDA3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmQr04V8eJ7_1v1FmKG371S3Z55B3ahaCrO-z2Vqcbs'
                }
            };
              
              fetch(`https://api.themoviedb.org/3/tv/${this.serieId}?language=es-MX`, options)
                .then(response => response.json())
                .then(response => {
                    let responseString = JSON.parse(JSON.stringify(response))
                    this.detallesSerie = responseString
                    this.isLoading = false
                    this.listaTemporadas = this.detallesSerie.seasons
                    //console.log(responseString)

                    this.existeOverview()
                    this.progesionVotos()
                    this.obtenerCastSerie()
                    this.obtenerVideos()
                    this.obtenerRecomendaciones()
                    this.obtenerPerfilUsuario()

                    this.date = this.detallesSerie.first_air_date.split("-")
                    this.year = this.date[0]
                })
                .catch(err => console.error(err));
        },
        obtenerCastSerie(){
            const options = {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWQ4MDQzMTU0MWViYTZiYjQ0MjE2MWZhYTJjMDA3ZCIsIm5iZiI6MTcyNzgwMTIxNC4wNjQ4NDEsInN1YiI6IjY2ZjJmNzA0YTgyYjAwNTcwMzI3MDA3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5aUDQI2AenPUrEUVvpmQWGZnt_2XfbsEHQv7lBnGDMM'
                }
              };
              
            fetch(`https://api.themoviedb.org/3/tv/${this.serieId}/credits?language=es-MX`, options)
            .then(response => response.json())
            .then(response => {
                let responseString = JSON.parse(JSON.stringify(response))
                this.castSerie = responseString.cast
            })
            .catch(err => console.error(err));
        },
        obtenerVideos(){
            const options = {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWQ4MDQzMTU0MWViYTZiYjQ0MjE2MWZhYTJjMDA3ZCIsIm5iZiI6MTcyNzgwMTIxNC4wNjQ4NDEsInN1YiI6IjY2ZjJmNzA0YTgyYjAwNTcwMzI3MDA3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5aUDQI2AenPUrEUVvpmQWGZnt_2XfbsEHQv7lBnGDMM'
                }
              };
              
            fetch(`https://api.themoviedb.org/3/tv/${this.serieId}/videos?include_video_language=es-MX&language=en-US`, options)
            .then(response => response.json())
            .then(response => {
                let responseString = JSON.parse(JSON.stringify(response))
                this.videosSerie = responseString.results
            })
            .catch(err => console.error(err));
        },
        obtenerRecomendaciones(){
            const options = {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWQ4MDQzMTU0MWViYTZiYjQ0MjE2MWZhYTJjMDA3ZCIsIm5iZiI6MTcyNzgwMTIxNC4wNjQ4NDEsInN1YiI6IjY2ZjJmNzA0YTgyYjAwNTcwMzI3MDA3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5aUDQI2AenPUrEUVvpmQWGZnt_2XfbsEHQv7lBnGDMM'
                }
              };
              
            fetch(`https://api.themoviedb.org/3/tv/${this.serieId}/recommendations?language=es-MX&page=1`, options)
            .then(response => response.json())
            .then(response => {
                let responseString = JSON.parse(JSON.stringify(response))
                this.recomendacionesSerie = responseString.results
                this.recomPagTotales = responseString.total_pages
            })
            .catch(err => console.error(err));
        },
        existeOverview(){
            if (this.detallesSerie.overview!="") this.isOverview = true
            else this.isOverview = false
        },
        progesionVotos(){
            this.votosPromedio = parseInt(this.detallesSerie.vote_average*10)
            this.styleBackg = `background: conic-gradient(#028c0e ${this.votosPromedio*3.6}deg, #E3E3E3 0deg)`
        },
        obtenerKeywords(){
            const options = {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWQ4MDQzMTU0MWViYTZiYjQ0MjE2MWZhYTJjMDA3ZCIsIm5iZiI6MTcyNzcyNjIxNS45NjQwNDgsInN1YiI6IjY2ZjJmNzA0YTgyYjAwNTcwMzI3MDA3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmQr04V8eJ7_1v1FmKG371S3Z55B3ahaCrO-z2Vqcbs'
                }
            };
              
            fetch(`https://api.themoviedb.org/3/tv/${this.serieId}/keywords`, options)
            .then(response => response.json())
            .then(response => {
                let responseString = JSON.parse(JSON.stringify(response))
                this.keywordsSerie = responseString.results
            })
            .catch(err => console.error(err));
        },
        obtenerSeriesValoradasUsuario(){
            sessionId = localStorage.getItem('sessionId')
            const options = {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWQ4MDQzMTU0MWViYTZiYjQ0MjE2MWZhYTJjMDA3ZCIsIm5iZiI6MTcyNzcyNjIxNS45NjQwNDgsInN1YiI6IjY2ZjJmNzA0YTgyYjAwNTcwMzI3MDA3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmQr04V8eJ7_1v1FmKG371S3Z55B3ahaCrO-z2Vqcbs'
                }
            };
              
            fetch(`https://api.themoviedb.org/3/account/${sessionId.value}/rated/tv?language=es-MX&page=1&sort_by=created_at.asc`, options)
            .then(response => response.json())
            .then(response => {
                let responseString = JSON.parse(JSON.stringify(response))
                ratingsUsuario = responseString.results
                this.estaValorada()
            })
            .catch(err => console.error(err));
        },
        estaValorada(){
            ratingsUsuario.forEach(item => {
                if(item.id==this.serieId){
                    this.isRated = true
                    this.puntuacion = item.rating
                }
            });
        },
        eliminarRating(){
            const options = {
                method: 'DELETE',
                headers: {
                  accept: 'application/json',
                  'Content-Type': 'application/json;charset=utf-8',
                  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWQ4MDQzMTU0MWViYTZiYjQ0MjE2MWZhYTJjMDA3ZCIsIm5iZiI6MTcyNzcyNjIxNS45NjQwNDgsInN1YiI6IjY2ZjJmNzA0YTgyYjAwNTcwMzI3MDA3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmQr04V8eJ7_1v1FmKG371S3Z55B3ahaCrO-z2Vqcbs'
                }
            };
              
            fetch(`https://api.themoviedb.org/3/tv/${this.serieId}/rating?session_id=${this.sessionId}`, options)
            .then(response => response.json())
            .then(response => {
                this.isRated = false
                this.puntuacion = 0
            })
            .catch(err => console.error(err));
        },
        darPuntuacion(){
            if (this.puntuacion!=0){
                const options = {
                    method: 'POST',
                    headers: {
                      accept: 'application/json',
                      'Content-Type': 'application/json;charset=utf-8',
                      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWQ4MDQzMTU0MWViYTZiYjQ0MjE2MWZhYTJjMDA3ZCIsIm5iZiI6MTcyNzcyNjIxNS45NjQwNDgsInN1YiI6IjY2ZjJmNzA0YTgyYjAwNTcwMzI3MDA3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmQr04V8eJ7_1v1FmKG371S3Z55B3ahaCrO-z2Vqcbs'
                    },
                    body: `{"value":${this.puntuacion}}`
                };
                  
                fetch(`https://api.themoviedb.org/3/tv/${this.serieId}/rating?session_id=${this.sessionId}`, options)
                .then(response => response.json())
                .then(response => {
                    this.isRated = true
                    alert("Gracias por votar!")
                })
                .catch(err => console.error(err));
            }else{
                alert("La puntuación debe ser mayor a 0")
            }
        },
        serieFavorita(){
            const options = {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWQ4MDQzMTU0MWViYTZiYjQ0MjE2MWZhYTJjMDA3ZCIsIm5iZiI6MTcyNzcyNjIxNS45NjQwNDgsInN1YiI6IjY2ZjJmNzA0YTgyYjAwNTcwMzI3MDA3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmQr04V8eJ7_1v1FmKG371S3Z55B3ahaCrO-z2Vqcbs'
                }
            };
              
            fetch(`https://api.themoviedb.org/3/tv/${this.serieId}/account_states?session_id=${this.sessionId}`, options)
            .then(response => response.json())
            .then(response => {
                //console.log(response)
            })
            .catch(err => console.error(err));
        },
        goToHome(){
            location.href = "../home/home.html";
        },
        obtenerPerfilUsuario(){
            if (!this.sessionId) {
                console.error('No se encontró la session_id.');
                return;
            }

            const url = `https://api.themoviedb.org/3/account?session_id=${this.sessionId}&api_key=${this.apiKey}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                     console.log(data);
                    if (data && data.avatar && data.avatar.gravatar && data.avatar.gravatar.hash) {
                        this.imgPATH = `https://secure.gravatar.com/avatar/${data.avatar.gravatar.hash}.jpg?s=64`;
                        this.tieneImagen = true;
                    } else {
                        this.tieneImagen = false;
                    }
                })
                .catch(error => console.error('Error al obtener el perfil del usuario:', error));
        },
        verificarSesion(){
            if (this.sessionId!=undefined) this.estaLogeado = true
            else this.estaLogeado = false
        },
        mostrarBotonCerrar(){
            this.logout = !this.logout;
        },
        cerrarSession(){
            localStorage.clear();
            window.location.href = '../index.html';
        }
    },
    mounted() {
        sessionId = localStorage.getItem('sessionId')
        this.urlParams = new URLSearchParams(window.location.search)
        if (this.urlParams!=""){
            this.serieId = this.urlParams.get("id")
        }else if(this.obtenerObjeto.media_type="tv"){
            this.serieId = this.obtenerObjeto.id
        }else{
            alert("Error al obtener los datos")
        }


        this.obtenerDetallesPeli()
        this.obtenerKeywords()
        this.obtenerSeriesValoradasUsuario()
        this.verificarSesion()
    }
}).mount('#app');