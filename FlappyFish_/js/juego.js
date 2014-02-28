function ponTurbo() {
    if ("ontouchstart" in document.documentElement) {
        pantalaTactil = true;
        turbo = true
    } else {
        pantalaTactil = false;
        turbo = false
    }
}

function resize_canvas() {
    ponTurbo();
    width = window.innerWidth;
    height = window.innerHeight;
    var e = .35;
    var t = .9;
    if (pantalaTactil == true) {
        if (width < height) {
            posicionVertical = true
        } else {
            posicionVertical = false
        }
        width = width * e;
        height = height * t;
        width = 250;
        height = 330;
        fps = 30;
        turbo = true;
        document.getElementById("adsense").innerHTML = "";
        document.getElementById("compartir").innerHTML = "";
        document.getElementById("contenedor").innerHTML = ""
    } else {
        fps = 120;
        turbo = false;
        width = width * e;
        height = height * t;
        document.getElementById("contenedorCanvas").style.position = "absolute";
        document.getElementById("contenedorCanvas").style.left = "28%";
        document.getElementById("contenedorCanvas").style.top = "2%";
        document.getElementById("c").style.width = "auto";
        document.getElementById("c0").style.width = "auto";
        document.getElementById("c2").style.width = "auto";
        document.getElementById("c").style.height = "auto";
        document.getElementById("c0").style.height = "auto";
        document.getElementById("c2").style.height = "auto";
        document.getElementById("banner").style.width = width + "px"
    }
    c.width = width;
    c.height = height;
    c0.width = width;
    c0.height = height;
    c2.width = width;
    c2.height = height;
    size_factor_w = width / default_width;
    size_factor_h = height / default_height;
    tile_w_responsive = parseInt(tile_w * size_factor_w);
    tile_h_responsive = parseInt(tile_h * size_factor_h);
    pixel_x = 1;
    pixel_y = 1;
    velocidad = parseInt(tile_w_responsive / 12);
    if (turbo == false) velocidad = parseInt(tile_w_responsive / 20);
    else velocidad = parseInt(tile_w_responsive / 12)
}

function touchHandler(e) {
    e.preventDefault();
    if (pulsacionTactil == false) {
        pulsacionTactil = true;
        pulsacion()
    }
}

function touchHandlerend(e) {
    e.preventDefault();
    pulsacionTactil = false
}

function touchHandlermove(e) {
    e.preventDefault();
    pulsacionTactil = true
}

function KeyboardController(e, t) {
    var n = {};
    document.onkeydown = function (r) {
        var i = (r || window.event).keyCode;
        if (!(i in e)) return true;
        if (!(i in n)) {
            n[i] = null;
            e[i]();
            if (t !== 0) n[i] = setInterval(e[i], t)
        }
        return false
    };
    document.onkeyup = function (e) {
        var t = (e || window.event).keyCode;
        if (t in n) {
            if (n[t] !== null) clearInterval(n[t]);
            delete n[t]
        }
    }
}

function pulsacion() {
    if (start == false) {
        publicidad.borra();
        start = true
    }
    if (start == true && personaje.estado() == true && fade.estado() == false) {
        fade.negra()
    }
    personaje.salto()
}

function fondo() {
    var e;
    if (imagenFondo == 0) e = "#4ee0cc";
    if (imagenFondo == 1) e = "#4ee0cc";
    if (imagenFondo == 2) e = "#4ee0cc";
    ctx0.fillStyle = e;
    ctx0.clearRect(0, 0, width, height);
    ctx0.beginPath();
    ctx0.rect(0, 0, width, tile_h_responsive * 6);
    ctx0.closePath();
    ctx0.fill();
    ctx0.drawImage(fondo_tile, 0, parseInt(imagenFondo * 110), 319, 110, 0, parseInt(tile_h_responsive * 5), parseInt(tile_w_responsive * 6), parseInt(tile_h_responsive * 2));
    ctx0.beginPath();
    ctx0.rect(0, parseInt(tile_h_responsive * 8), width, tile_h_responsive);
    ctx0.fillStyle = "#dbdc90";
    ctx0.fill()
}

function texto(e, t, n, r, i, s, o) {
    var u = parseInt(r * size_factor_w);
    ctx2.fillStyle = i;
    ctx2.strokeStyle = o;
    ctx2.font = u + "pt Arial";
    ctx2.fillText(e, t * tile_w_responsive, n * tile_h_responsive)
}

function cuadro(e, t, n, r, i) {
    if (i - 1 < 0) i = 6;
    ctx.drawImage(tubo_tile, 0, (i - 1) * 60, 58, 60, parseInt(e * tile_w_responsive + pixel_x * n), parseInt((t + 1) * tile_h_responsive), tile_w_responsive, tile_h_responsive)
}

function juego() {}

function GameLoop() {
    setTimeout(function () {
        window.requestAnimationFrame(GameLoop);
        var e = new Date;
        fpsMonitor = 1e3 / (e - lastLoop);
        lastLoop = e;
        if (typeof console === "undefined") {
            console = {}
        }
        if (posicionVertical == false && pantalaTactil == true) {
            clearH();
            texto("Turn", 1.9, 3, 100, "#FFFFFF", 100, "#000000");
            texto("Vertical", 1.3, 4.5, 100, "#FFFFFF", 100, "#000000")
        } else {
            clear2();
            clear();
            suelo.move();
            suelo.draw();
            menu2.draw();
            if (start == true) {
                plataforma.move();
                plataforma.draw();
                personaje.draw();
                personaje.gravedad();
                personaje.colision();
                menu2.transicion()
            } else {
                personaje.oscilacion();
                personaje.draw()
            } if (!personaje.estado()) {
                texto(plataforma.puntuacion(), 2.5, 1, 100, "#000000", 100, "#000000")
            }
            fade.draw()
        }
    }, interval)
}

function cargando() {
    gameover_img = new Image;
    gameover_img.src = imagenDir + "gameover.png";
    gameover_img.onload = incrementaCargador;
    medallas_img = new Image;
    medallas_img.src = imagenDir + "medallas.png";
    medallas_img.onload = incrementaCargador;
    cuadro_img = new Image;
    cuadro_img.src = imagenDir + "cuadro.png";
    cuadro_img.onload = incrementaCargador;
    tubo_tile = new Image;
    tubo_tile.src = imagenDir + "tubo.png";
    tubo_tile.onload = incrementaCargador;
    fondo_tile = new Image;
    fondo_tile.src = imagenDir + "fondo.png?=2";
    fondo_tile.onload = incrementaCargador;
    menu2_tile = new Image;
    menu2_tile.src = imagenDir + "getready.png";
    menu2_tile.onload = incrementaCargador;
    personaje_tile = new Image;
    personaje_tile.src = imagenDir + "personaje.png?=2";
    personaje_tile.onload = incrementaCargador;
    sonidoAleteo = new Howl({
        urls: ["sound/01.ogg"],
        onload: function () {
            incrementaCargador()
        },
        onend: function () {
            sonidoAleteoFin = true
        }
    });
    sonidoMuerte = new Howl({
        urls: ["sound/02.ogg"],
        onload: function () {
            incrementaCargador()
        }
    });
    sonidoPunto = new Howl({
        urls: ["sound/03.ogg"],
        onload: function () {
            incrementaCargador()
        }
    })
}

function sAleteo() {
    if (sonidoAleteoFin == true) {
        sonidoAleteo.play();
        sonidoAleteoFin = false
    }
}

function barraCarga(e) {
    var t = tile_w_responsive * 3.1;
    var n = tile_h_responsive * .8;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(tile_w_responsive * 1, tile_h_responsive * 5, tile_w_responsive * 3.5, tile_h_responsive * 1.2);
    ctx.fillStyle = "#000000";
    ctx.fillRect(tile_w_responsive * 1.2, tile_h_responsive * 5.2, t, n);
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(tile_w_responsive * 1.2, tile_h_responsive * 5.2, t * .01 * e, n)
}

function incrementaCargador() {
    var e = 0;
    ctx.fillStyle = "#000000";
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.fill();
    archivosCargados++;
    if (archivosCargados == 1) e = 20;
    if (archivosCargados == 2) e = 40;
    if (archivosCargados == 3) e = 60;
    if (archivosCargados > 3 && archivosCargados < 10) e = 80;
    if (archivosCargados == 10) e = 100;
    barraCarga(e);
    if (archivosCargados == totalArchivos) {
        GameLoop();
        plataforma.inicializa();
        fondo()
    }
}
var fps;
var velocidad;
var turbo = true;
var numPajaros = 6;
var numFondos = 3;
var pantallaTactil = false;
var posicionVertical = false;
var interval = 1e3 / fps;
$(window).resize(function () {
    resize_canvas();
    fondo()
});
var publicidad = new function () {
        this.inserta = function () {
            document.getElementById("banner").style.top = "0px"
        };
        this.borra = function () {
            document.getElementById("banner").style.top = "-500px"
        }
    };
var tile_w = 148;
var tile_h = 62;
var pixel_x = 1;
var pixel_y = 1;
var size_factor_w = 1;
var size_factor_h = 1;
var default_width = 850;
var default_height = 520;
var tile_w_responsive = 64;
var tile_h_responsive = 62;
(function () {
    var e = 0;
    var t = ["ms", "moz", "webkit", "o"];
    for (var n = 0; n < t.length && !window.requestAnimationFrame; ++n) {
        window.requestAnimationFrame = window[t[n] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[t[n] + "CancelAnimationFrame"] || window[t[n] + "CancelRequestAnimationFrame"]
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (t, n) {
        var r = (new Date).getTime();
        var i = Math.max(0, 16 - (r - e));
        var s = window.setTimeout(function () {
            t(r + i)
        }, i);
        e = r + i;
        return s
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (e) {
        clearTimeout(e)
    }
})();
var imagenDir = "images/";
var soundDir = "sound/";
var gLoop, puntos = 0,
    state = true,
    c = document.getElementById("c"),
    ctx = c.getContext("2d"),
    c0 = document.getElementById("c0"),
    ctx0 = c0.getContext("2d"),
    c2 = document.getElementById("c2"),
    ctx2 = c2.getContext("2d"),
    width = default_width,
    height = default_height;
var clear = function () {
    c.width = width;
    c.height = height
};
var clear2 = function () {
    c2.width = width;
    c2.height = height
};
var clearH = function () {
    ctx.fillStyle = "#000000";
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.fill()
};
var pulsacionTactil = false;
var elementoTouch = document.getElementById("c2");
elementoTouch.addEventListener("touchstart", touchHandler, false);
elementoTouch.addEventListener("touchend", touchHandlerend, false);
elementoTouch.addEventListener("touchmove", touchHandlermove, false);
$("#c2").click(function (e) {
    pulsacion()
});
KeyboardController({
    32: function () {
        pulsacion()
    }
}, 40);
var matriz_x = 10;
var matriz_y = 9;
var camara_x = 7;
var tubos = [
    [2, 1, 1, 1, 0],
    [0, 2, 1, 1, 0],
    [0, 0, 2, 1, 0],
    [3, 0, 0, 2, 0],
    [1, 3, 0, 0, 0],
    [1, 1, 3, 0, 0],
    [1, 1, 1, 3, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
];
var pantalla = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
var pantallaAux = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
var start = false;
var gradoOpacidad = [1, .9, .8, .7, .6, .5, .4, .3, .2, .1, 0];
var fade = new function () {
        this.opacidad = 10;
        this.blancaActiva1 = false;
        this.blancaActiva2 = false;
        this.negraActiva1 = false;
        this.negraActiva2 = false;
        this.negra = function () {
            this.blancaActiva1 = false;
            this.blancaActiva2 = false;
            this.opacidad = 10;
            this.negraActiva1 = true
        };
        this.estado = function () {
            var e = false;
            if (this.negraActiva1 || this.negraActiva2) e = true;
            return e
        };
        this.blanca = function () {
            this.blancaActiva1 = true
        };
        this.draw = function () {
            if (this.blancaActiva1 == true) {
                if (this.opacidad == 3) {
                    this.blancaActiva1 = false;
                    this.blancaActiva2 = true
                }
                ctx2.fillStyle = "rgba(255,255,255," + gradoOpacidad[this.opacidad] + ")";
                ctx2.fillRect(0, 0, width, height);
                this.opacidad--
            }
            if (this.blancaActiva2 == true) {
                if (this.opacidad == 10) {
                    this.blancaActiva2 = false
                }
                ctx2.fillStyle = "rgba(255,255,255," + gradoOpacidad[this.opacidad] + ")";
                ctx2.fillRect(0, 0, width, height);
                this.opacidad++
            }
            if (this.negraActiva1 == true) {
                if (this.opacidad == 0) {
                    this.negraActiva1 = false;
                    this.negraActiva2 = true;
                    personaje.reset()
                }
                ctx2.fillStyle = "rgba(0,0,0," + gradoOpacidad[this.opacidad] + ")";
                ctx2.fillRect(0, 0, width, height);
                this.opacidad--
            }
            if (this.negraActiva2 == true) {
                if (this.opacidad == 10) {
                    this.negraActiva2 = false
                }
                ctx2.fillStyle = "rgba(0,0,0," + gradoOpacidad[this.opacidad] + ")";
                ctx2.fillRect(0, 0, width, height);
                this.opacidad++
            }
        }
    };
var menu2 = new function () {
        this.opacidad = 0;
        this.draw = function () {
            ctx2.globalAlpha = gradoOpacidad[this.opacidad];
            ctx2.drawImage(menu2_tile, parseInt(tile_w_responsive * 1.4), parseInt(tile_h_responsive * 2.4), parseInt(tile_w_responsive * 3), parseInt(tile_h_responsive * 3));
            texto("www.seetio.com", 3.3, 8, 25, "#7b4b00", 0, "#FFFFFF");
            ctx2.globalAlpha = 1
        };
        this.estado = function () {
            return this.opacidad
        };
        this.transicion = function () {
            if (this.opacidad < 10) this.opacidad++
        };
        this.reset = function () {
            this.opacidad = 0
        }
    };
var suelo = new function () {
        this.scroll_x = 0;
        this.scroll_y = tile_h_responsive;
        this.muerto = false;
        this.stop = function () {
            this.muerto = true
        };
        this.start = function () {
            this.muerto = false
        };
        this.draw = function () {
            for (x = 0; x < matriz_x - 3; x++) {
                cuadro(x - 1, 6, this.scroll_x, this.scroll_y, 4)
            }
        };
        this.move = function () {
            if (this.muerto == false) {
                if (this.scroll_x > 0 && parseInt(this.scroll_x - velocidad) > 0) this.scroll_x = parseInt(this.scroll_x - velocidad);
                else this.scroll_x = tile_w_responsive
            }
        }
    };
var personaje = new function () {
        this.x = 1;
        this.y = 3;
        this.pajaro = Math.floor(Math.random() * numPajaros);
        this.frame = 0;
        this.animacionDelante = true;
        this.retrasoAnimacion = 0;
        this.topeRetrasoAnimacion = 2;
        this.muerto = false;
        this.xOscilacion = .009;
        this.scrolly = .8;
        this.grados = 0;
        this.fuerza = 0;
        this.fuerzaGravedad = .005;
        this.fuerzaSalto = .08;
        ponTurbo();
        if (turbo) {
            this.fuerzaGravedad = .012;
            this.fuerzaSalto = .12;
            this.topeRetrasoAnimacion = 0;
            this.xOscilacion = .025
        }
        this.suelo = false;
        this.saltando = false;
        this.subida = true;
        this.reset = function () {
            this.x = 1;
            this.y = 3;
            this.muerto = false;
            this.scrolly = .8;
            this.grados = 0;
            this.fuerza = 0;
            this.fuerzaGravedad = .005;
            this.fuerzaSalto = .08;
            ponTurbo();
            if (turbo) {
                this.fuerzaGravedad = .012;
                this.fuerzaSalto = .12
            }
            this.saltando = false;
            this.suelo = false;
            this.subida = true;
            this.pajaro = Math.floor(Math.random() * numPajaros);
            imagenFondo = Math.floor(Math.random() * numFondos);
            gameover.reset();
            menu2.reset();
            suelo.start();
            fondo();
            plataforma.start();
            start = false
        };
        this.estado = function () {
            return this.suelo
        };
        this.estamuerto = function () {
            return this.muerto
        };
        this.oscilacion = function () {
            if (this.subida == false) {
                if (this.scrolly < 1) this.scrolly += this.xOscilacion;
                else this.subida = true
            } else {
                if (this.scrolly > .5) this.scrolly -= this.xOscilacion;
                else {
                    this.subida = false
                }
            }
        };
        this.draw = function () {
            var e = tile_w_responsive * .5 + tile_w_responsive * this.x;
            var t = tile_h_responsive * .5 + tile_h_responsive * (this.y + this.scrolly);
            if (this.muerto == false) {
                if (this.retrasoAnimacion > this.topeRetrasoAnimacion) {
                    if (this.animacionDelante == true) {
                        if (this.frame < 2) this.frame++;
                        else this.animacionDelante = false
                    } else {
                        if (this.frame > 0) this.frame--;
                        else this.animacionDelante = true
                    }
                    this.retrasoAnimacion = 0
                }
                this.retrasoAnimacion++
            }
            ctx.save();
            ctx.translate(e, t);
            ctx.rotate(Math.PI / 180 * this.grados);
            ctx.translate(-e, -t);
            ctx.drawImage(personaje_tile, this.frame * 64, this.pajaro * 64, 64, 64, Math.round(this.x * tile_w_responsive), Math.round((this.y + this.scrolly) * tile_h_responsive), tile_w_responsive, tile_h_responsive);
            ctx.restore()
        };
        this.salto = function () {
            if (this.muerto == false) {
                this.saltando = true;
                this.grados = -45;
                sAleteo()
            }
        };
        this.colision = function () {
            if (pantalla[this.y][1] != 0) {
                this.muere()
            }
            var e = plataforma.retraso();
            var t = tile_w_responsive * .3;
            var n = tile_w_responsive * .7;
            if (this.y > 0) {
                if (pantalla[this.y - 1][1] != 0 && this.scrolly < -.2 && e > t) this.muere()
            }
            if (pantalla[this.y + 1][1] != 0 && this.scrolly > .2 && e > t) this.muere();
            if (pantalla[this.y][2] != 0 && e < n) this.muere()
        };
        this.muere = function () {
            if (this.muerto == false) {
                publicidad.inserta();
                this.muerto = true;
                sonidoMuerte.play();
                fade.blanca();
                if (this.fuerza > 0) this.fuerza = 0;
                plataforma.stop();
                suelo.stop()
            }
        };
        this.gravedad = function () {
            this.fuerza -= this.fuerzaGravedad;
            if (this.saltando == true) {
                this.saltando = false;
                this.fuerza = this.fuerzaSalto
            }
            if (this.y < 6) {
                if (parseInt(this.scrolly) == -1) {
                    this.y--;
                    this.scrolly = this.scrolly + 1
                }
                if (parseInt(this.scrolly) == 1) {
                    this.y++;
                    this.scrolly = this.scrolly - 1
                }
                this.scrolly -= this.fuerza
            } else {
                this.suelo = true;
                this.scrolly = .1;
                this.muere();
                gameover.draw()
            } if (this.grados < 90 && this.fuerza < 0) {
                this.grados += 6
            }
            if (this.y == 0 && this.fuerza > 0) {
                this.scrolly = 0;
                this.fuerza = 0
            }
        }
    };
var gameover = new function () {
        this.y = tile_h_responsive * -1;
        this.y2 = tile_h_responsive * 9;
        this.vel = 8;
        this.vel2 = 16;
        ponTurbo();
        if (turbo) {
            this.vel = 16;
            this.vel2 = 32
        }
        this.medalla = 0;
        this.draw = function () {
            ctx2.drawImage(gameover_img, parseInt(tile_w_responsive * 1.4), this.y, parseInt(tile_w_responsive * 3), parseInt(tile_h_responsive * .8));
            if (this.y < tile_h_responsive * 1.5) this.y = this.y + this.vel;
            else {
                ctx2.drawImage(cuadro_img, parseInt(tile_w_responsive * 1.4), parseInt(this.y2), parseInt(tile_w_responsive * 3), parseInt(tile_h_responsive * 2));
                if (this.y2 > tile_h_responsive * 3) this.y2 = this.y2 - this.vel2;
                else {
                    var e = plataforma.puntuacion();
                    texto("SCORE", 3.5, 3.3, 22, "#000000", 0, "#FFFFFF");
                    texto(e, 3.7, 3.7, 40, "#000000", 0, "#FFFFFF");
                    texto("BEST", 3.6, 4.2, 22, "#000000", 0, "#FFFFFF");
                    texto(plataforma.mejor_puntuacion(), 3.7, 4.6, 40, "#000000", 0, "#FFFFFF");
                    var t = "MEDAL";
                    if (e <= 9) {
                        this.medalla = 0;
                        t = "NO MEDAL"
                    }
                    if (e > 9) this.medalla = 1;
                    if (e > 19) this.medalla = 2;
                    if (e > 29) this.medalla = 3;
                    if (e > 39) this.medalla = 4;
                    if (e > 49) this.medalla = 5;
                    texto(t, 1.6, 3.4, 25, "#000000", 0, "#FFFFFF");
                    ctx2.drawImage(medallas_img, 0, this.medalla * 60, 58, 60, parseInt(tile_w_responsive * 1.6), parseInt(tile_h_responsive * 3.5), tile_w_responsive, tile_h_responsive)
                }
            }
        };
        this.reset = function () {
            this.y = tile_h_responsive * -2;
            this.y2 = 558
        }
    };
var plataforma = new function () {
        this.scroll_x = tile_w_responsive;
        this.scroll_y = tile_h_responsive;
        this.espacio = 0;
        this.puntos = 0;
        this.best = 0;
        this.contador = 0;
        this.pares = 1;
        this.muerto = false;
        this.inicializa = function () {
            this.scroll_x = tile_w_responsive;
            this.scroll_y = tile_h_responsive
        };
        this.puntuacion = function () {
            if (this.puntos > this.best) this.best = this.puntos;
            return this.puntos
        };
        this.mejor_puntuacion = function () {
            return this.best
        };
        this.draw = function () {
            for (y = 0; y < matriz_y; y++) {
                for (x = 0; x < camara_x; x++) {
                    cuadro(x - 1, y - 1, this.scroll_x, this.scroll_y, pantalla[y][x])
                }
            }
        };
        this.retraso = function () {
            return this.scroll_x
        };
        this.stop = function () {
            this.muerto = true
        };
        this.start = function () {
            for (y = 0; y < matriz_y; y++) {
                for (x = 0; x < matriz_x; x++) {
                    pantalla[y][x] = 0
                }
            }
            this.contador = 0;
            this.puntos = 0;
            this.muerto = false
        };
        this.move = function () {
            if (this.muerto == false) {
                if (this.scroll_x > 0 && this.scroll_x - velocidad > 0) this.scroll_x -= velocidad;
                else {
                    this.scroll_x = tile_w_responsive;
                    for (y1 = 0; y1 < matriz_y; y1++) {
                        for (x1 = 0; x1 < matriz_x; x1++) {
                            pantalla[y1][x1] = pantalla[y1][x1 + 1]
                        }
                    }
                    if (this.contador > 7 && this.pares == 0) {
                        this.puntos++;
                        sonidoPunto.play()
                    }
                    if (this.pares < 2) {
                        this.pares++
                    } else this.pares = 0;
                    this.contador++;
                    var e = 4;
                    if (this.espacio == 0) {
                        e = Math.floor(Math.random() * 4);
                        this.espacio = 1
                    } else {
                        if (this.espacio == 2) this.espacio = 0;
                        else this.espacio++
                    }
                    for (y1 = 0; y1 < matriz_y; y1++) {
                        pantalla[y1][matriz_x - 1] = tubos[y1][e]
                    }
                }
            }
        }
    };
var lastLoop = new Date;
var fpsMonitor = 0;
var sonidoAleteo;
var sonidoMuerte;
var sonidoPunto;
var tubo_tile;
var fondo_tile;
var menu2_tile;
var personaje_tile;
var gameover_img;
var cuadro_img;
var medallas_img;
var sonidoAleteoFin = true;
var archivosCargados = 0;
var totalArchivos = 10;
var menu = 9;
var imagenFondo = Math.floor(Math.random() * numFondos);
resize_canvas();
cargando()