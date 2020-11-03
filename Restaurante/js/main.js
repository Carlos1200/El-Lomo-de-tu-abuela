const nombre = document.querySelector('#name');
const email = document.querySelector('input[type="email"]');
const telefono = document.querySelector('#telefono');
const errorDiv = document.getElementById('error');
const hora = document.querySelector('#hora');
const reserva = document.querySelector('#reservacion');
const area = document.querySelector('#areas');
const inputFecha = document.querySelector('input[type="date"]');
const addplatillo = document.querySelector('.platillo');
const addbebida = document.querySelector('.bebida');
const contenidoplatillo = document.querySelector('.adminPlatillos');
const contenidobebida = document.querySelector('.adminBebidas');
let estadoArea = [];
let estadoMesa = [];

$(function() {
    $('.tooltip-carousel').popover();

    $('#carousel-example-generic').on('slide.bs.carousel', function() {
        $('.tooltip-carousel').popover('hide');
        $(this).find('.caraousel-tooltip-item.active').fadeOut(function() {
            $(this).removeClass('active');
        });
    });

    $('#carousel-example-generic').on('slid.bs.carousel', function() {
        var index = $(this).find('.carousel-inner > .item.active').index();
        $(this).find('.caraousel-tooltip-item').eq(index).fadeIn(function() {
            $(this).addClass('active');
        });
    });

    $('.tooltip-carousel').mouseenter(function() {
        $(this).popover('show');
    }).mouseleave(function() {
        $(this).popover('hide');
    });

});



//EVENT LISTEDERS
//eventos para reservar mesa
if (filename() === "reservacion-mesa.html") {
    //Cambiar color de reservacion
    reserva.addEventListener('click', cambiarEstado);

    //Cambiar color de registros seleccionados
    document.querySelector('#registrado').addEventListener('click', reservarMesa);

    //Aumentar o disminuir Zoom
    document.querySelector('#zoom').addEventListener('click', cambiarZoom);

    //Cargar LocalStorage
    document.addEventListener('DOMContentLoaded', () => {
        estadoMesa = JSON.parse(localStorage.getItem('mesa')) || [];


        sincronizarMesa();
    });
}
//eventos para reservar area
if (filename() === "reservacion-area.html") {
    //Cambiar color de Areas
    area.addEventListener('click', cambiarEstadoArea);

    //Cambiar color de registros seleccionados
    document.querySelector('#registrado').addEventListener('click', reservarArea);

    //Aumentar o disminuir Zoom
    document.querySelector('#zoom').addEventListener('click', cambiarZoom);

    //Cargar LocalStorage
    document.addEventListener('DOMContentLoaded', () => {
        estadoArea = JSON.parse(localStorage.getItem('area')) || [];


        sincronizarArea();
    });
}


if (filename() === "Menu.html") {
    document.addEventListener('DOMContentLoaded', () => {
        obtenerDatos();
    });
}

if (filename() === "admin.html") {
    document.addEventListener('DOMContentLoaded', () => {
        obtenerDatos();
    });
    addplatillo.addEventListener('click', () => {
        window.location.href = 'formulario.html?id=0&t=platillo';
    });
    addbebida.addEventListener('click', () => {
        window.location.href = 'formulario.html?id=0&t=bebida';
    });
}
let archivo = filename();
if (archivo.includes("formulario.html")) {
    document.addEventListener('DOMContentLoaded', () => {
        obtenerDatosForm();
    });
    document.querySelector('input[name="url"]').addEventListener('blur', () => {
        document.querySelector('#imgForm').src = document.querySelector('input[name="url"]').value;
    });
    document.querySelector('.btn-lg').addEventListener('click', enviarForm);

}


//Nombre de la pagina
function filename() {
    var rutaAbsoluta = self.location.href;
    var posicionUltimaBarra = rutaAbsoluta.lastIndexOf("/");
    var rutaRelativa = rutaAbsoluta.substring(posicionUltimaBarra + "/".length, rutaAbsoluta.length);
    return rutaRelativa;
}

function obtenerDatos() {
    const url = 'https://restauranteappudb.herokuapp.com/api/menu';
    const urlB = 'https://restauranteappudb.herokuapp.com/api/bebida';
    fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Access-Control-Allow-Origin': '*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            }
        })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            if (filename() === "admin.html") {
                return mostrarAdmin(resultado);
            } else if (filename() === 'Menu.html') {
                return mostrarHTML(resultado);
            }

        });
    fetch(urlB, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Access-Control-Allow-Origin': '*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            }
        })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            if (filename() === "admin.html") {
                return mostrarAdminBebidas(resultado);
            } else if (filename() === 'Menu.html') {
                return mostrarHTMLBebidas(resultado);
            }

        });
}

function mostrarHTML(datos) {
    const contenido = document.querySelector('div .menu');
    let html = '';

    datos.forEach(platillo => {
        const { name, description, price, image } = platillo;

        html += `
            <div class="col-md-6 p-3">
                <img src="${image}" class="img-thumbnail">
                <p class="d-block text-white text-center font-weight-bold mb-0" style="font-size: 3rem;">${name}</p>
                <p class="d-block text-white text-center mb-0" style="font-size: 1.5rem;">Precio: $<span class="font-weight-bold">${price}</span></p>
                <p class="d-block text-white text-center  mb-0" style="font-size: 1.5rem;">${description}</p>
            </div>
        
        `;
    });

    contenido.innerHTML = html;
}

function mostrarAdmin(datos) {
    let html = '';
    limpiarHTML();

    datos.forEach(platillo => {
        const { name, image, id } = platillo;
        //Crear Elementos
        const btnEdit = document.createElement('button');
        const btndelete = document.createElement('button');
        const icoDelete = document.createElement('i');
        const icoEdit = document.createElement('i');
        const divContenido = document.createElement('div');
        const img = document.createElement('img');
        const nombre = document.createElement('h3');
        const divButtons = document.createElement('div');

        //asignar datos
        btndelete.classList.add('btn', 'btn-danger');
        icoDelete.classList.add('fas', 'fa-trash', 'py-2');
        btndelete.setAttribute('data-food', id);
        divButtons.classList.add('d-md-flex', 'justify-content-center');
        nombre.classList.add('text-white', 'text-center', 'mr-3', 'd-block');
        nombre.textContent = name;
        img.classList.add('img-thumbnail');
        img.src = image;
        divContenido.classList.add('col-md-4');
        btnEdit.classList.add('btn', 'btn-warning', 'mr-2');
        icoEdit.classList.add('fas', 'fa-edit', 'py-2');
        btnEdit.setAttribute('data-food', id);

        //unirlos
        btnEdit.appendChild(icoEdit);
        btndelete.appendChild(icoDelete);
        divButtons.appendChild(btnEdit);
        divButtons.appendChild(btndelete);
        divContenido.appendChild(img);
        divContenido.appendChild(nombre);
        divContenido.appendChild(divButtons);
        contenidoplatillo.appendChild(divContenido);

        //Agregar funciones
        btnEdit.onclick = () => {
            EditarPlatillo(id);
        }
        btndelete.onclick = () => {
            borrarPlatillo(id);
        }
    });

}

function mostrarAdminBebidas(datos) {
    let html = '';
    limpiarHTMLBebidas();
    datos.forEach(bebida => {
        const { name, image, id } = bebida;
        //Crear Elementos
        const btnEdit = document.createElement('button');
        const btndelete = document.createElement('button');
        const icoDelete = document.createElement('i');
        const icoEdit = document.createElement('i');
        const divContenido = document.createElement('div');
        const img = document.createElement('img');
        const nombre = document.createElement('h3');
        const divButtons = document.createElement('div');

        //asignar datos
        btndelete.classList.add('btn', 'btn-danger');
        icoDelete.classList.add('fas', 'fa-trash', 'py-2');
        btndelete.setAttribute('data-drink', id);
        divButtons.classList.add('d-md-flex', 'justify-content-center');
        nombre.classList.add('text-white', 'text-center', 'mr-3', 'd-block');
        nombre.textContent = name;
        img.classList.add('img-thumbnail');
        img.src = image;
        divContenido.classList.add('col-md-4');
        btnEdit.classList.add('btn', 'btn-warning', 'mr-2');
        icoEdit.classList.add('fas', 'fa-edit', 'py-2');
        btnEdit.setAttribute('data-drink', id);

        //unirlos
        btnEdit.appendChild(icoEdit);
        btndelete.appendChild(icoDelete);
        divButtons.appendChild(btnEdit);
        divButtons.appendChild(btndelete);
        divContenido.appendChild(img);
        divContenido.appendChild(nombre);
        divContenido.appendChild(divButtons);
        contenidobebida.appendChild(divContenido);

        //Agregar funciones
        btnEdit.onclick = () => {
            EditarBebida(id);
        }
        btndelete.onclick = () => {
            borrarBebida(id);
        }
    });
}

function mostrarHTMLBebidas(datos) {
    const contenidoBeb = document.querySelector('div .bebidas');
    let html = '';
    datos.forEach(bebida => {
        const { name, description, price, image } = bebida;

        html += `
        <div class="col-md-6 p-3">
            <img src="${image}" class="img-thumbnail">
            <p class="d-block text-white text-center font-weight-bold mb-0" style="font-size: 3rem;">${name}</p>
            <p class="d-block text-white text-center mb-0" style="font-size: 1.5rem;">Precio: $<span class="font-weight-bold">${price}</span></p>
            <p class="d-block text-white text-center  mb-0" style="font-size: 1.5rem;">${description}</p>
        </div>
        
        `;
    });

    contenidoBeb.innerHTML = html;
}

//Cambiar color de Reservacion
function cambiarEstado(e) {
    e.preventDefault();
    var contadore = 0;
    if (e.target.classList.contains('mes-Mesa') || e.target.classList.contains('mes-Mesa-circular')) {
        if (e.target.classList.contains('activo')) {
            e.target.classList.remove('activo');
        } else {
            for (var x = 0; x < reserva.children.length; x++) {
                if (reserva.children[x].classList.contains('activo')) {
                    contadore++;
                }
            }
            if (contadore === 0) {
                e.target.classList.add('activo');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'No puede reservar mas de una mesa',
                    text: 'Error'
                });
            }
        }
    }
}

function cambiarEstadoArea(e) {
    e.preventDefault();
    var contador = 0;
    if (e.target.classList.contains('fa-door-open')) {
        if (e.target.classList.contains('activo')) {
            e.target.classList.remove('activo');
        } else {
            for (var x = 0; x < area.children.length; x++) {
                if (area.children[x].classList.contains('activo')) {
                    contador++;
                }
            }
            if (contador === 0) {
                e.target.classList.add('activo');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'No puede reservar mas de una zona',
                    text: 'Error'
                });
            }

        }
    }
}

function verificarEstado(divArea) {
    let contador = 0;
    Array.from(divArea.children).forEach(area => {
        if (area.classList.contains('activo')) {
            contador++;
        }
    });
    if (contador > 0) {
        return true;
    } else {
        return false;
    }
}

function reservarMesa(e) {

    e.preventDefault();

    if (validarCampos() && validarFecha() && verificarEstado(reserva)) {
        Swal.fire({
            title: 'Seguro(a)?',
            text: "Usted va a reservar la mesa",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {



                for (var x = 0; x < reserva.children.length; x++) {
                    if (reserva.children[x].classList.contains('activo')) {
                        let id = reserva.children[x].getAttribute('data-id');
                        reserva.children[x].classList.remove('activo');
                        reserva.children[x].classList.add('reservado');
                        reserva.children[x].children[0].classList.remove('reserva');
                        reserva.children[x].children[0].classList.add('ocupado');

                        estadoMesa = [...estadoMesa, [id, 'activo', 'reservado', 'reserva', 'ocupado']];
                        sincronizarStorage('mesa', estadoMesa);
                    }
                }

                Swal.fire(
                    '¡Reservado!',
                    'Tu mesa se ha reservado.',
                    'success'
                )
            }
        })
    }


}

function reservarArea(e) {
    e.preventDefault();
    if (validarCampos() && validarFecha() && verificarEstado(area)) {


        Swal.fire({
            title: 'Seguro(a)?',
            text: "Usted va a reservar la Área",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {

                for (var x = 0; x < area.children.length; x++) {
                    if (area.children[x].classList.contains('activo')) {
                        let id = area.children[x].getAttribute('data-id');
                        area.children[x].classList.remove('fa-door-open');
                        area.children[x].classList.remove('activo');
                        area.children[x].classList.add('reservado');
                        area.children[x].classList.add('fa-door-closed');
                        area.children[x].children[0].classList.remove('reserva');
                        area.children[x].children[0].classList.add('ocupado');
                        estadoArea = [...estadoArea, [id, 'fa-door-open', 'fa-door-closed', 'activo', 'reservado', 'reserva', 'ocupado']];
                        sincronizarStorage('area', estadoArea);
                    }
                };

                Swal.fire(
                    '¡Reservado!',
                    'Tu área se ha reservado.',
                    'success'
                )
            }
        });
    }

}

function validarFecha() {

    //Validacion de fecha
    var fecha = new Date();
    var dia = inputFecha.valueAsDate.getDate() + 1;
    var mes = inputFecha.valueAsDate.getMonth() + 1;
    var año = inputFecha.valueAsDate.getFullYear();


    if (dia >= fecha.getDate() + 1 && año === fecha.getFullYear() && mes >= fecha.getMonth() + 1 && mes <= fecha.getMonth() + 2) {
        return true
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Ponga una fecha entre los rangos de mañana y el mes siguiente',
            text: 'Error'
        });
        return false;
    }

    //validacion de Email



}

function validarCampos() {

    //Validar email
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    //Validar telefono
    var phoneno = /^[0-9]{8}$/i;
    if (emailRegex.test(email.value) && telefono.value.match(phoneno) && nombre.value.length != 0 && parseInt(hora.value.substring(0, 2)) >= 12 && parseInt(hora.value.substring(0, 2)) <= 20) {

        return true;
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Complete los campos de manera que sea valido',
            text: 'Error'
        });
        return false;
    }

}

function cambiarZoom(e) {
    e.preventDefault();
    //Si quiere incrementar el zoom
    if (e.target.classList.contains('fa-search-plus')) {
        var zoom = document.querySelector('#zoom').previousElementSibling.children[0];
        var elemento = window.getComputedStyle(zoom);
        var escala = parseFloat(elemento.getPropertyValue('scale')).toFixed(1);

        if (parseFloat(escala) < 1.5) {
            zoom.style.scale = parseFloat(escala) + 0.1;
        }
    }
    //si quiere disminuir el zoom
    if (e.target.classList.contains('fa-search-minus')) {
        var zoom = document.querySelector('#zoom').previousElementSibling.children[0];
        var elemento = window.getComputedStyle(zoom);
        var escala = parseFloat(elemento.getPropertyValue('scale')).toFixed(1);

        if (parseFloat(escala) > 1) {
            zoom.style.scale = parseFloat(escala) - 0.1;
        }
    }

}

function sincronizarStorage(tipo, estado) {
    localStorage.setItem(tipo, JSON.stringify(estado));
}

function sincronizarArea() {
    let iconos = Array.from(area.children);
    if (estadoArea) {
        estadoArea.forEach(estado => {
            iconos.find(icono => {
                if (icono.getAttribute('data-id') === estado[0]) {
                    icono.classList.remove(estado[1]);
                    icono.classList.remove(estado[3]);
                    icono.children[0].classList.remove(estado[5]);
                    icono.classList.add(estado[2]);
                    icono.classList.add(estado[4]);
                    icono.children[0].classList.add(estado[6]);
                }
            });
        });
    }

}

function sincronizarMesa() {
    let iconos = Array.from(reserva.children);
    estadoMesa.forEach(estado => {
        iconos.forEach(icono => {
            if (icono.getAttribute('data-id') === estado[0]) {
                icono.classList.remove(estado[1]);
                icono.children[0].classList.remove(estado[3]);
                icono.classList.add(estado[2]);
                icono.children[0].classList.add(estado[4]);
            }
        });
    });
}

function EditarPlatillo(id) {
    window.location.href = `formulario.html?id=${id}&t=${"platillo"}`;

}

function EditarBebida(id) {
    window.location.href = `formulario.html?id=${id}&t=${"bebida"}`;
}

function borrarBebida(id) {
    url = 'https://restauranteappudb.herokuapp.com/api/bebida/' + id;
    fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Access-Control-Allow-Origin': '*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            }
        })
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarAdminBebidas(resultado));
}

function borrarPlatillo(id) {
    url = 'https://restauranteappudb.herokuapp.com/api/menu/' + id;
    fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Access-Control-Allow-Origin': '*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            }
        })
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarAdmin(resultado));
}

function obtenerDatosForm() {
    let valores = window.location.search;
    let id = valores.substring(4, 5);
    let tipo = valores.substring(8);
    if (id > 0) {
        if (tipo === "platillo") {
            var url = 'https://restauranteappudb.herokuapp.com/api/menu/' + id;
        } else if (tipo === "bebida") {
            var url = 'https://restauranteappudb.herokuapp.com/api/bebida/' + id;
        }
        fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Access-Control-Allow-Origin': '*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                }
            })
            .then(respuesta => respuesta.json())
            .then(resultado => llenarFormulario(resultado));
    }

}


function llenarFormulario(datos) {
    const nombre = document.querySelector('input[name="name"]');
    const descripti = document.querySelector('input[name="descrip"]');
    const precio = document.querySelector('input[name="price"]');
    const url = document.querySelector('input[name="url"]');
    const imagen = document.querySelector('#imgForm');
    datos.forEach(platillo => {
        const { name, description, price, image } = platillo;
        nombre.value = name;
        descripti.value = description;
        precio.value = price;
        url.value = image;
        imagen.src = platillo.image;
    });
}

function enviarForm(e) {
    e.preventDefault();
    const nombre = document.querySelector('input[name="name"]');
    const descripti = document.querySelector('input[name="descrip"]');
    const precio = document.querySelector('input[name="price"]');
    const url = document.querySelector('input[name="url"]');

    let valores = window.location.search;
    let id = valores.substring(4, 5);
    let tipo = valores.substring(8);
    console.log(tipo);
    const json = {
        name: nombre.value,
        description: descripti.value,
        price: precio.value,
        image: url.value
    }
    if (id > 0) {
        if (tipo === "platillo") {
            var direc = 'https://restauranteappudb.herokuapp.com/api/menu/' + id;
        } else {
            var direc = 'https://restauranteappudb.herokuapp.com/api/bebida/' + id;
        }
        fetch(direc, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Access-Control-Allow-Origin': '*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                },
                body: JSON.stringify(json)
            })
            .then(function() {
                window.location.href = `admin.html`;
            });

    } else {
        if (tipo === "platillo") {
            var direc = 'https://restauranteappudb.herokuapp.com/api/menu';
        } else {
            var direc = 'https://restauranteappudb.herokuapp.com/api/bebida';
        }
        fetch(direc, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Access-Control-Allow-Origin': '*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                },
                body: JSON.stringify(json)
            })
            .then(function() {
                window.location.href = `admin.html`;
            });
    }

}

function limpiarHTML() {


    while (contenidoplatillo.firstChild) {
        contenidoplatillo.removeChild(contenidoplatillo.firstChild);
    }
}

function limpiarHTMLBebidas() {

    while (contenidobebida.firstChild) {
        contenidobebida.removeChild(contenidobebida.firstChild);
    }
}