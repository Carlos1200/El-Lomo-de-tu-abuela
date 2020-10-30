const nombre = document.querySelector('#name');
const email = document.querySelector('input[type="email"]');
const telefono = document.querySelector('#telefono');
const errorDiv = document.getElementById('error');
const hora = document.querySelector('#hora');
const reserva = document.querySelector('#reservacion');
const area = document.querySelector('#areas');
const inputFecha = document.querySelector('input[type="date"]');
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



//Nombre de la pagina
function filename() {
    var rutaAbsoluta = self.location.href;
    var posicionUltimaBarra = rutaAbsoluta.lastIndexOf("/");
    var rutaRelativa = rutaAbsoluta.substring(posicionUltimaBarra + "/".length, rutaAbsoluta.length);
    return rutaRelativa;
}

function obtenerDatos() {
    const url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef';
    const urlB = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Ordinary_Drink';
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarHTML(resultado));

    fetch(urlB)
        .then(resultado => resultado.json())
        .then(datos => mostrarHTMLBebidas(datos));
}

function mostrarHTML(datos) {
    const contenido = document.querySelector('div .menu');

    let html = '';
    const { meals } = datos;

    meals.forEach(platillo => {
        const { strMeal, strMealThumb } = platillo;

        html += `
            <div class="col-md-4 p-3">
                <img src="${strMealThumb}" class="img-thumbnail">
                <p class="d-block text-white text-center font-weight-bold" style="font-size: 1.5rem;">${strMeal}</p>
            </div>
        
        `;
    });

    contenido.innerHTML = html;
}

function mostrarHTMLBebidas(datos) {
    const contenido = document.querySelector('div .bebidas');

    let html = '';
    const { drinks } = datos;
    drinks.forEach(bebida => {
        const { strDrink, strDrinkThumb } = bebida;

        html += `
            <div class="col-md-4 p-3">
                <img src="${strDrinkThumb}" class="img-thumbnail">
                <p class="d-block text-white text-center font-weight-bold" style="font-size: 1.5rem;">${strDrink}</p>
            </div>
        
        `;
    });

    contenido.innerHTML = html;
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