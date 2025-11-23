import { Arma } from "./armas.js";

export class Jogador {
    constructor() {
        this.x = 300;
        this.y = 700;
        this.largura = 40;
        this.altura = 40;

        this.velocidade = 5;
        this.vida = 3;

        this.teclas = {};

        // Arma começa no nível 1
        this.nivelArma = 1;
        this.arma = new Arma(this.nivelArma);

        // Eventos de teclado
        document.addEventListener("keydown", (e) => this.teclas[e.key] = true);
        document.addEventListener("keyup", (e) => this.teclas[e.key] = false);
    }

    mover() {
        if (this.teclas["ArrowLeft"] && this.x > 0) {
            this.x -= this.velocidade;
        }
        if (this.teclas["ArrowRight"] && this.x + this.largura < 600) {
            this.x += this.velocidade;
        }
        if (this.teclas["ArrowUp"] && this.y > 0) {
            this.y -= this.velocidade;
        }
        if (this.teclas["ArrowDown"] && this.y + this.altura < 800) {
            this.y += this.velocidade;
        }
    }

    atirar(listaTiros) {
        if (this.teclas[" "] || this.teclas["Space"]) {
            const novosTiros = this.arma.disparar(
                this.x + this.largura / 2,
                this.y
            );
            listaTiros.push(...novosTiros);
        }
    }

    atualizar(listaTiros) {
        this.mover();
        this.atirar(listaTiros);
    }

    desenhar(ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }

    // =======================================================
    // NOVO: EVOLUIR ARMA APÓS BOSS
    // =======================================================
    evoluirArma() {
        if (this.nivelArma < 12) {
            this.nivelArma++;
            this.arma = new Arma(this.nivelArma);
        }
    }
}
