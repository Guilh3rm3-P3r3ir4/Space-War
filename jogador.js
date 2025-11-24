import { Arma } from "./arma.js";

export class Jogador {
    constructor() {
        this.x = 300;
        this.y = 700;
<<<<<<< HEAD
        this.largura = 100;
        this.altura = 100;

        // padding da hitbox (reduz levemente a caixa de colisão sem alterar a arte)
        this.hitboxPadding = 16; // diminui 16px no total (8px por lado)
=======
        this.largura = 150;
        this.altura = 150;
>>>>>>> 0f28ba609719570195cfef2c2217cd1737059dbb

        this.velocidade = 5;
        this.vida = 3;

        this.teclas = {};

        // Arma começa no nível 1
        this.nivelArma = 1;
        this.tiposDeArma = [
            "simples", "simples_rapida", "dupla_frente", "dupla_rapida",
            "diagonal_dupla", "tripla_frente", "espalhamento_5", "espalhamento_7",
            "rajada", "onda", "laser_fino", "laser_grosso"
        ];
        this.arma = new Arma(this.tiposDeArma[this.nivelArma - 1]);

        // Eventos de teclado
        document.addEventListener("keydown", (e) => this.teclas[e.key] = true);
        document.addEventListener("keyup", (e) => this.teclas[e.key] = false);
        // imagem da nave
        this.imagem = new Image();
        this.imagem.src = "./imagens/nave.png"; // caminho da imagem

    }

    mover() {
        if (this.teclas["ArrowLeft"] && this.x > 0) this.x -= this.velocidade;
        if (this.teclas["ArrowRight"] && this.x + this.largura < 600) this.x += this.velocidade;
        if (this.teclas["ArrowUp"] && this.y > 0) this.y -= this.velocidade;
        if (this.teclas["ArrowDown"] && this.y + this.altura < 800) this.y += this.velocidade;
    }

    atirar(listaTiros) {
        const novosTiros = this.arma.disparar(this.x + this.largura / 2, this.y);
        listaTiros.push(...novosTiros);
    }

    atualizar(listaTiros) {
        this.mover();
        this.atirar(listaTiros);
    }

    desenhar(ctx) {
        ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
<<<<<<< HEAD
    }

    // retorna a hitbox usada para colisões (reduzida em relação à imagem)
    getHitbox() {
        const pad = this.hitboxPadding;
        return {
            x: this.x + pad / 2,
            y: this.y + pad / 2,
            largura: this.largura - pad,
            altura: this.altura - pad
        };
    }
=======
       }
>>>>>>> 0f28ba609719570195cfef2c2217cd1737059dbb

    evoluirArma() {
        if (this.nivelArma < 12) {
            this.nivelArma++;
            this.arma = new Arma(this.tiposDeArma[this.nivelArma - 1]);

            // Aumenta velocidade da arma (diminuindo cooldown)
            this.arma.cooldownMax = Math.max(2, 12 - this.nivelArma);
        }
    }
}
