var nombre = document.querySelector('#name');
var email = document.querySelector('input[type="email"]');
var telefono = document.querySelector('#telefono');
var errorDiv = document.getElementById('error');
var hora = document.querySelector('#hora');
var reserva = document.querySelector('#reservacion');
var area = document.querySelector('#areas');
var inputFecha = document.querySelector('input[type="date"]');




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

if (filename() === "reservacion-mesa.html") {
    //Cambiar color de reservacion
    reserva.addEventListener('click', cambiarEstado);

    //Cambiar color de registros seleccionados
    document.querySelector('#registrado').addEventListener('click', reservarMesa);
}

if (filename() === "reservacion-area.html") {
    //Cambiar color de Areas
    area.addEventListener('click', cambiarEstadoArea);

    //Cambiar color de registros seleccionados
    document.querySelector('#registrado').addEventListener('click', reservarArea);
}

//Aumentar o disminuir Zoom
document.querySelector('#zoom').addEventListener('click', cambiarZoom);


//Nombre de la pagina
function filename() {
    var rutaAbsoluta = self.location.href;
    var posicionUltimaBarra = rutaAbsoluta.lastIndexOf("/");
    var rutaRelativa = rutaAbsoluta.substring(posicionUltimaBarra + "/".length, rutaAbsoluta.length);
    return rutaRelativa;
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

function reservarMesa(e) {

    e.preventDefault();

    if (validarCampos() && validarFecha()) {
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
                        reserva.children[x].classList.remove('activo');
                        reserva.children[x].classList.add('reservado');
                        reserva.children[x].children[0].classList.remove('reserva');
                        reserva.children[x].children[0].classList.add('ocupado');
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
    if (validarCampos() && validarFecha()) {


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
                        area.children[x].classList.remove('fa-door-open');
                        area.children[x].classList.remove('activo');
                        area.children[x].classList.add('reservado');
                        area.children[x].classList.add('fa-door-closed');
                        area.children[x].children[0].classList.remove('reserva');
                        area.children[x].children[0].classList.add('ocupado');
                    }
                }

                Swal.fire(
                    '¡Reservado!',
                    'Tu área se ha reservado.',
                    'success'
                )
            }
        })
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
    console.log(emailRegex.test(email.value));
    console.log(telefono.value.match(phoneno));
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
            console.log(escala);
            zoom.style.scale = parseFloat(escala) + 0.1;
        }
    }
    //si quiere disminuir el zoom
    if (e.target.classList.contains('fa-search-minus')) {
        var zoom = document.querySelector('#zoom').previousElementSibling.children[0];
        var elemento = window.getComputedStyle(zoom);
        var escala = parseFloat(elemento.getPropertyValue('scale')).toFixed(1);

        if (parseFloat(escala) > 1) {
            console.log(escala);
            zoom.style.scale = parseFloat(escala) - 0.1;
        }
    }

}