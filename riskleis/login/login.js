const { createApp, ref } = Vue;

createApp({
    setup() {
        let username = ref('');
        let password = ref('');

        return {
            username,
            password
        };
        
    },
    methods: {
        enviarInfo(){
            const options = {
                method: 'POST',
                headers: {
                  accept: 'application/json',
                  'content-type': 'application/json',
                  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWQ4MDQzMTU0MWViYTZiYjQ0MjE2MWZhYTJjMDA3ZCIsIm5iZiI6MTcyNzU2NzcwMS40NTQ0NzgsInN1YiI6IjY2ZjJmNzA0YTgyYjAwNTcwMzI3MDA3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8S2RmXbpNkcuU-lanIeKwMHlqCClG3Liy1_Kwimpto4'
                },
                body: JSON.stringify({
                  username: this.username,
                  password: this.password,
                  request_token: ''
                })
            };
              
            fetch('https://api.themoviedb.org/3/authentication/token/validate_with_login', options)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                alert("Hola y bienvenido "+this.username)
            }).catch(err => console.error(err));
        }
    }
}).mount('#app');