import { Arma } from "./arma.js";

export class Jogador {
    constructor() {
        this.x = 255;
        this.y = 595;
        // tamanho reduzido para jogabilidade
        this.largura = 100;
        this.altura = 100;

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
        // imagens de vida
        this.imgVidaCheia = new Image();
        this.imgVidaCheia.src = "./imagens/vida_cheia.png";

        this.imgVidaVazia = new Image();
        this.imgVidaVazia.src = "./imagens/vida_vazia.png";

        // hitbox reduzida (padding interno) — aumentada para colisão mais permissiva
        this.hitboxPadding = 18;

    }

    mover() {
        // Movimentação por teclado
        if (this.teclas["ArrowLeft"] && this.x > 0) this.x -= this.velocidade;
        if (this.teclas["ArrowRight"] && this.x + this.largura < 510) this.x += this.velocidade;
        if (this.teclas["ArrowUp"] && this.y > 0) this.y -= this.velocidade;
        if (this.teclas["ArrowDown"] && this.y + this.altura < 680) this.y += this.velocidade;

        // Movimentação por touch (celular)
        if (window.moveX !== undefined && window.moveY !== undefined) {
            // Ajuste para ~2x mais rápido que a configuração anterior
            const divisor = 30; // menor -> resposta mais rápida
            let dx = window.moveX / divisor;
            let dy = window.moveY / divisor;

            // limitar deslocamento máximo por frame para evitar saltos
            const maxMove = 1; // pixels por frame (maior => mais responsivo)
            dx = Math.max(-maxMove, Math.min(maxMove, dx));
            dy = Math.max(-maxMove, Math.min(maxMove, dy));

            this.x += dx;
            this.y += dy;

            // manter dentro da tela
            if (this.x < 0) this.x = 0;
            if (this.x + this.largura > 510) this.x = 510 - this.largura;
            if (this.y < 0) this.y = 0;
            if (this.y + this.altura > 680) this.y = 680 - this.altura;
        }
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

    }

    // retorna hitbox reduzida para colisões (melhora jogabilidade)
    getHitbox() {
        return {
            x: this.x + this.hitboxPadding,
            y: this.y + this.hitboxPadding,
            largura: Math.max(4, this.largura - this.hitboxPadding * 2),
            altura: Math.max(4, this.altura - this.hitboxPadding * 2)
        };
    }

    evoluirArma() {
        // só evolui se ainda tiver tipos de arma disponíveis
        if (this.nivelArma < this.tiposDeArma.length) {
            this.nivelArma++;
            this.arma = new Arma(this.tiposDeArma[this.nivelArma - 1]);
        }
    }


    desenharVidas(ctx) {
        const tamanho = 40;
        const margem = 10;

        for (let i = 0; i < 3; i++) {
            let img = (i < this.vida) ? this.imgVidaCheia : this.imgVidaVazia;
            ctx.drawImage(img, margem + i * (tamanho + 5), ctx.canvas.height - tamanho - margem, tamanho, tamanho);
        }
    }
    trocarArmaAleatoria() {
        // escolhe um índice aleatório diferente da arma atual
        let novoNivel;
        do {
            novoNivel = Math.floor(Math.random() * this.tiposDeArma.length) + 1;
        } while (novoNivel === this.nivelArma);

        this.nivelArma = novoNivel;
        this.arma = new Arma(this.tiposDeArma[this.nivelArma - 1]);

        // ajusta cooldown conforme a potência da arma
        this.arma.cooldownMax = Math.max(2, 12 - this.nivelArma);
    }

}
