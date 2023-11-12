//Por alguna razon que desconozo no puedo usar las variables y cosas con importacion de los otros ficheros porque la edicion se ralla, por eso aqui lo tengo que repetir todo

import { db } from "./app.js";
import { datosCliente } from "./nuevocliente.js";

const inputNombreEditar = document.querySelector("#nombre");
const inputEmailEditar = document.querySelector("#email");
const inputTelefonoEditar = document.querySelector("#telefono");
const inputEmpresaEditar = document.querySelector("#empresa");
const agregarCliente = document.querySelector('#formulario input[type="submit"]')
export const snipper = document.querySelector("#spinner");



inputNombreEditar.addEventListener("input", validarEdicion);
inputEmailEditar.addEventListener("input", validarEdicion);
inputTelefonoEditar.addEventListener("input", validarEdicion);
inputEmpresaEditar.addEventListener("input", validarEdicion);
agregarCliente.addEventListener("click", saveChanges) 

//Lanzamos la funcion una vez cargado el DOM, Y oasamos el correo por la url y lo obtenemos con el listener
document.addEventListener('DOMContentLoaded',()=>{
    //Creamos una variable para realizar busqueda de parametros
    const URL = new URLSearchParams(window.location.search);
    //Almacenamos el resultado de la busqueda que en nuestro caso es por el correo
    const emailCliente = URL.get('id');
    console.log(emailCliente);
    editarCliente(emailCliente)
})

function editarCliente(email){
    const request = indexedDB.open('crm', 1);
    request.onsuccess = () => {
        const objectStore = db.transaction('clientes').objectStore('clientes')
        objectStore.openCursor().onsuccess = function(e){
        const cursor = e.target.result
            if(cursor){
                //Hacemos una comparitva de los correos
                const emailcursor = cursor.value.email;
                /*Si el email encontrado en el click coincide con el del
                cursor pondra los valores en el los input para que sean editados*/
                if(email === emailcursor){
                    const {email, nombre, telefono, empresa} = cursor.value
                    inputNombreEditar.value = nombre
                    inputEmailEditar.value = email
                    inputTelefonoEditar.value = telefono
                    inputEmpresaEditar.value = empresa             
                }
            cursor.continue()
            }
        }
  };
  }

function validarEdicion(e) {
    if (e.target.value.trim() === "") {
      warning(`El campo ${e.target.id} es obligatorio`, e.target.parentElement);
      datosCliente[e.target.name] = "";
      checkDatos();
      return; //Para cortar la ejecucion del código si cumple la condición y no limpie el mensaje de error
    }
  
    if (e.target.id === "nombre" && !checkNombre(e.target.value)) {
      warning("El Nombre no es válido", e.target.parentElement);
      datosCliente[e.target.name] = "";
      checkDatos();
      return;
    }
  
    if (e.target.id === "email" && !checkEmail(e.target.value)) {
      warning("El Email no es válido", e.target.parentElement);
      datosCliente[e.target.name] = "";
      checkDatos();
      return;
    }
  
    if (e.target.id === "telefono" && !checkTelefono(e.target.value)) {
      warning("El Teléfono no es válido", e.target.parentElement);
      datosCliente[e.target.name] = "";
      checkDatos();
      return;
    }
  
    if (e.target.id === "empresa" && !checkEmpresa(e.target.value)) {
      warning("La Empresa no es válida", e.target.parentElement);
      datosCliente[e.target.name] = "";
      checkDatos();
      return;
    }
    cleanWarning(e.target.parentElement);
  
    //Vamos sobreescribiendo los datos hasta que esten todos bien y deje enviar el objeto
    datosCliente[e.target.name] = e.target.value;
    checkDatos();
  } 

  //Mensaje básico de error insertado en el HTML
function warning(mensaje, ubielmento) {
    cleanWarning(ubielmento);
    const error = document.createElement("P");
    error.textContent = mensaje;
    error.classList.add("bg-orange-500", "text-white", 
    "text-center", "p-2","font-semibold", "rounded-md");
    ubielmento.appendChild(error);
  }
  
  //Funcion para quitar warnings
  function cleanWarning(ubielmento) {
    //Seleccionamos el warning y lo almacenamos
    const alert = ubielmento.querySelector(".bg-orange-500");
    if (alert) {
      alert.remove();
    }; 
  }; 
  
  //Validación del nombre con pattern
  function checkNombre(nombre) {
    //Utilzamos una expresión regular
    const regex = /^[A-Za-z\s'-]+$/;
    //La testeamos
    const resultado = regex.test(nombre);
    //Retornamos el resultado del testeo
    return resultado;
  };
  
  //Validación del email con pattern
  function checkEmail(email)  {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    const resultado = regex.test(email);
    return resultado;
  };
  
  //Validacion del telefono con pattern
  function checkTelefono(telefono) {
    const regex = /^(6|7|8|9)\d{8}$/;
    const resultado = regex.test(telefono);
    return resultado
  };
  
  //Validacion del telefono con pattern
  function checkEmpresa(telefono) {
    //Es una limitación muy básica y poco limitada ya que no especifica caracteristicas en el nombre de empresa
    const regex = /^[A-Za-z0-9\s\-,.&'()]*$/;
    const resultado = regex.test(telefono);
    return resultado;
  };
  
  function checkDatos() {
    const values = Object.values(datosCliente);
    if(values.includes("")){
      agregarCliente.classList.remove("bg-teal-500");
      agregarCliente.classList.add("bg-gray-500");
      agregarCliente.disabled = true;
      agregarCliente.value="Rellena los Datos"
    } else {
      agregarCliente.classList.remove("bg-gray-500");
      agregarCliente.classList.add("bg-teal-500");
      agregarCliente.disabled = false;
      agregarCliente.value="Agregar Cliente"
    }
  }
  

function saveChanges(e) {
    e.preventDefault();
    snipper.classList.remove("hidden");
    //Pasamos el resultado de el agregado desde addClient
    editClient(datosCliente);

    datosCliente.email = "";
    datosCliente.nombre = "";
    datosCliente.telefono = "";
    datosCliente.empresa = "";
    formulario.reset();
    checkDatos();
  }


function editClient() {

} 