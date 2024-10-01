const { createApp, ref } = Vue;

createApp({
    setup(){
        const movieId = ref(136166)
        const detallesSerie = ref({})
        const keywordsSerie = ref({})
        const date = ref([])
        const year = ref('')
        const isLoading = ref(true)
        const isOverview = ref(false)
        const votosPromedio = ref(0)
        const votosPorcentaje = ref('')
        const styleBackg = ref('')

        return {
            movieId,
            isLoading,
            detallesSerie,
            isOverview,
            votosPromedio,
            votosPorcentaje,
            styleBackg,
            keywordsSerie
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
              
              fetch(`https://api.themoviedb.org/3/tv/${this.movieId}?language=es-MX`, options)
                .then(response => response.json())
                .then(response => {
                    let responseString = JSON.parse(JSON.stringify(response))
                    this.detallesSerie = responseString
                    this.isLoading = false
                    console.log(responseString)

                    this.existeOverview()
                    this.progesionVotos()

                    this.date = this.detallesSerie.first_air_date.split("-")
                    this.year = this.date[0]
                })
                .catch(err => console.error(err));
        },
        existeOverview(){
            if (this.detallesSerie.overview!="") this.isOverview = true
            else this.isOverview = false
        },
        progesionVotos(){
            this.votosPromedio = parseInt(this.detallesSerie.vote_average*10)
            this.styleBackg = `background: conic-gradient(#2A83E8 ${this.votosPromedio*3.6}deg, #E3E3E3 0deg)`
        },
        obtenerKeywords(){
            const options = {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWQ4MDQzMTU0MWViYTZiYjQ0MjE2MWZhYTJjMDA3ZCIsIm5iZiI6MTcyNzcyNjIxNS45NjQwNDgsInN1YiI6IjY2ZjJmNzA0YTgyYjAwNTcwMzI3MDA3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmQr04V8eJ7_1v1FmKG371S3Z55B3ahaCrO-z2Vqcbs'
                }
            };
              
            fetch(`https://api.themoviedb.org/3/tv/${this.movieId}/keywords`, options)
            .then(response => response.json())
            .then(response => {
                let responseString = JSON.parse(JSON.stringify(response))
                this.keywordsSerie = responseString.results
                console.log(this.keywordsSerie)
            })
            .catch(err => console.error(err));
        }
    },
    mounted() {
        this.obtenerDetallesPeli()
        this.obtenerKeywords()
        console.log("Componentes montados")
    }
}).mount('#app');