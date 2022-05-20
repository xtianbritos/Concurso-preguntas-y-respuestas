
let puntos = 0;
let pregunta;
let contador= 0;
let opcionElegida;
let ronda = 1;
let categoriaElegida;
let premio = 0;
let Usuario ={};
let miUsuario;


// Chequeo si ya exista un registro de usuario en LocalStorage

if (JSON.parse(localStorage.getItem("Usuario") == null)) {
    // Si no existe creo el registro
    Usuario.Puntaje = puntos;
    localStorage.setItem('Usuario', JSON.stringify(Usuario));
}


// Función para ahorrar escribir document.getElementById(id) muchas veces
function select_id(id) {
    return document.getElementById(id);
}


// Escribo el puntaje actual del usuario
select_id("puntaje").innerHTML= JSON.parse(localStorage.getItem("Usuario")).Puntaje;


// Función que desordena la base de datos de preguntas y respuestas 
function desordenarBase(){
    base_preguntas.peliculas.sort(()=>Math.random()-0.5);
    base_preguntas.historia.sort(()=>Math.random()-0.5);
    base_preguntas.ciencia.sort(()=>Math.random()-0.5);
    base_preguntas.geografia.sort(()=>Math.random()-0.5);
    base_preguntas.deportes.sort(()=>Math.random()-0.5);
    mostrarPreguntas(categoriaElegida, 0);
}

// Función que muestra solamente las preguntas y categorías en cada ronda
function mostrarPreguntas(base, n) {
    pregunta = base[n];
    select_id("pregunta").innerHTML = pregunta.pregunta;
    select_id("categoria").innerHTML = pregunta.categoría;
    desordenarRespuestas(pregunta);
}


// Función que desordena aleatóriamente las preguntas en cada ronda
function desordenarRespuestas(pregunta){
    let posibles_respuestas = [pregunta.respuesta, pregunta.incorrecta1, pregunta.incorrecta2, pregunta.incorrecta3, pregunta.incorrecta4];
    posibles_respuestas.sort(()=>Math.random()-0.5);

    select_id("opcion1").innerHTML = posibles_respuestas[0];
    select_id("opcion2").innerHTML = posibles_respuestas[1];
    select_id("opcion3").innerHTML = posibles_respuestas[2];
    select_id("opcion4").innerHTML = posibles_respuestas[3];
}


// Función que reemplaza la selección e categorías por el juego en sí, y establece el premio de la ronda 1
function iniciarJuego(){
    premio = 10;
    select_id("container").innerHTML = `<div class="container_juego">
        <div class="encabezado">
            <div class="categoria" id="categoria">Categoría</div>
            <div class="pregunta" id="pregunta">Pregunta</div>
        </div>
        
        <div class="opcion" id="opcion1">Opción 1</div>
        <div class="opcion" id="opcion2">Opción 2</div>
        <div class="opcion" id="opcion3">Opción 3</div>
        <div class="opcion" id="opcion4">Opción 4</div>
        <h3>Premio: <span id="premio"></span> puntos</h3>
        <a href="index.html" class="boton rojo">Abandonar partida</a>
    `;

    // Si se hace click para abandonar la partida
    document.querySelector(".rojo").addEventListener("click", ()=> {
        // Actualizo el puntaje sumándole los premios ganados hasta el momento
        miUsuario = JSON.parse(localStorage.getItem("Usuario"));
        miUsuario.Puntaje += puntos;
        localStorage.setItem('Usuario', JSON.stringify(miUsuario));
        // Se reinicia el valor del premio
        premio = 0;
    });
}


// Función que se ejecuta si la respuesta es incorrecta, mostrando un mensaje
function respIncorrecta(){
    select_id("header").innerHTML = `<div class="mensaje">
            <h1 id="error">¡Respuesta incorrecta!</h1>
            <h2>Tu puntaje es: <span id="puntaje"></span></h2>
            <a href="index.html" class="boton">Volver a intentarlo</a>
        </div>
    `;
    // Muestro el puntaje sin cambio ya que se perdió lo acumulado en las rodnas previas
    select_id("puntaje").innerHTML = JSON.parse(localStorage.getItem("Usuario")).Puntaje;
    // Oculto el juego
    select_id("container").innerHTML = "";
}


//Funcion que se ejecuta cuando se responde todas las preguntas correctamente 
function ganarJuego(){
    
    // Actualizo el puntaje
    miUsuario = JSON.parse(localStorage.getItem("Usuario"));
    miUsuario.Puntaje += puntos;
    localStorage.setItem('Usuario', JSON.stringify(miUsuario));  
    
    // Muestro el mensaje de felicitaciones y el puntaje
    select_id("header").innerHTML = `<div class="mensaje">
            <h1 id="correcto">¡Felicitaciones!</h1>
            <h2>Tu puntaje es: <span id="puntaje"></span></h2>
            <a href="index.html" class="boton">Elegír categoría</a>
        </div>
    `;

    select_id("puntaje").innerHTML= miUsuario.Puntaje;
    select_id("container").innerHTML = "";
    puntos = 0;
}


// Función que realiza todo lo necesario para iniciar el juego una vez se elije una categoría
function catSeleccionada(){
    iniciarJuego();        
    desordenarBase();
    select_id("ronda").innerHTML = ronda;
    select_id("premio").innerHTML = premio;
}

// -----------------------------------------Escuchadores de eventos------------------------------------------------


// Cuando se hace click a una categoría se inicia el juego
document.addEventListener("click", (e)=>{

    if (e.composedPath()[1].id == "peliculas" || e.composedPath()[0].id == "peliculas"){
        categoriaElegida = base_preguntas.peliculas;
        catSeleccionada();
    }
    if (e.composedPath()[1].id == "geografia" || e.composedPath()[0].id == "geografia"){
        categoriaElegida = base_preguntas.geografia;
        catSeleccionada();
    }
    if (e.composedPath()[1].id == "historia" || e.composedPath()[0].id == "historia"){
        categoriaElegida = base_preguntas.historia;
        catSeleccionada();
    }
    if (e.composedPath()[1].id == "ciencia" || e.composedPath()[0].id == "ciencia"){
        categoriaElegida = base_preguntas.ciencia;
        catSeleccionada();
    }
    if (e.composedPath()[1].id == "deportes" || e.composedPath()[0].id == "deportes"){
        categoriaElegida = base_preguntas.deportes;
        catSeleccionada();
    }
})


// Cuando se hace click a una respuesta
document.addEventListener("click", (e)=>{
    if (e.target.classList == "opcion"){

        opcionElegida = e.target.innerHTML;

        // Si la respuesta es correcta se aumenta la ronda, se suma el premio al acomulado y se aumenta el premio 
        if (opcionElegida == categoriaElegida[contador].respuesta) {
            e.target.classList.toggle("acierto"); // Pinto de verde la respuesta correcta
            contador += 1;
            ronda += 1;
            puntos += premio;
            premio += 10;
            select_id("ronda").innerHTML = ronda;
            select_id("premio").innerHTML = premio;

            // Si se han contestado menos de 5 preguntas se muestra la siguiente
            if (contador<5){
                setTimeout(()=>{ // Se espera para cargar la sigiente pregunta para que se vea el acierto
                    e.target.classList.toggle("acierto"); // Vuelvo a pintar de blanco la opción
                    mostrarPreguntas(categoriaElegida, contador);
                }, 350);
            }
            // Sino se muestra el mensaje de felicitaciones y se resetean el contador y la ronda
            else {
                ganarJuego();
                contador = 0;
                ronda = 1;
            }
        }
        // Si la respuesta es incorrecta se muestra el mensaje de error y se reinicia el valor del premio
        else {
            respIncorrecta();
            premio = 0;
        }
    }

})
