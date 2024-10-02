const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const personData = ref(null);
    const errorMessage = ref("");
    const apiKey = "f8c72830b3e50f4fdd3857dea8cb5d97";

    onMounted(() => {
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMjY1ZDNmNzNmODhhNTg5MGNmNWQxZTc0NjVmN2JmMiIsIm5iZiI6MTcyNzg3ODMwNy4yOTY4ODMsInN1YiI6IjY2ZjJmNzMzNmMzYjdhOGQ2NDhlNDRlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.beGrkjeCebKVB7hzS2ekWuO4nGOS1V2RPtnYn1Y_mf8", // Añade tu token de autorización aquí
        },
        redirect: "follow",
      };

      fetch("https://api.themoviedb.org/3/person/414", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("Datos recibidos del artista:", result); // Añadir un log para ver los datos en la consola
          personData.value = result;
        })
        .catch((error) => {
          console.error("Error al obtener los datos:", error); // Muestra el error en la consola
          errorMessage.value = "Error al obtener los datos: " + error;
        });
    });

    return {
      personData,
      errorMessage,
    };
  },
}).mount("#app");
