export class Arma {
    constructor(tipo) {
        this.tipo = tipo;
        this.cooldown = 0;

        // Define cooldown base para cada tipo
        switch (tipo) {
            case "simples": this.cooldownMax = 25; break;
            case "simples_rapida": this.cooldownMax = 15; break;
            case "dupla_frente": this.cooldownMax = 25; break;
            case "dupla_rapida": this.cooldownMax = 15; break;
            case "diagonal_dupla": this.cooldownMax = 20; break;
            case "tripla_frente": this.cooldownMax = 12; break;
            case "espalhamento_5": this.cooldownMax = 12; break;
            default: this.cooldownMax = 10;
        }
    }

    disparar(x, y) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return [];
        }

        this.cooldown = this.cooldownMax;

        switch (this.tipo) {
            case "simples":
                return [{ x: x - 2, y, largura: 4, altura: 10, velocidade: 7, tipoVisual: ".tiro-simples" }];
            case "simples_rapida":
                return [{ x: x - 2, y, largura: 4, altura: 10, velocidade: 12, tipoVisual: ".tiro-rapido" }];
            case "dupla_frente":
                return [
                    { x: x - 10, y, largura: 4, altura: 10, velocidade: 9, tipoVisual: ".tiro-duplo" },
                    { x: x + 10, y, largura: 4, altura: 10, velocidade: 9, tipoVisual: ".tiro-duplo" }
                ];
            case "dupla_rapida":
                return [
                    { x: x - 12, y, largura: 4, altura: 10, velocidade: 13, tipoVisual: ".tiro-duplo-rapido" },
                    { x: x + 12, y, largura: 4, altura: 10, velocidade: 13, tipoVisual: ".tiro-duplo-rapido" }
                ];
            case "diagonal_dupla":
                return [
                    { x, y, largura: 5, altura: 5, velX: -4, velY: 8, tipoVisual: ".tiro-diagonal" },
                    { x, y, largura: 5, altura: 5, velX: 4, velY: 8, tipoVisual: ".tiro-diagonal" }
                ];
            case "tripla_frente":
                return [
                    { x: x - 2, y, largura: 4, altura: 10, velocidade: 9, tipoVisual: ".tiro-triplo" },
                    { x, y, largura: 5, altura: 5, velX: -3, velY: 9, tipoVisual: ".tiro-triplo" },
                    { x, y, largura: 5, altura: 5, velX: 3, velY: 9, tipoVisual: ".tiro-triplo" }
                ];
            case "espalhamento_5":
                return [
                    { x, y, largura: 4, altura: 10, velX: 0, velY: 10, tipoVisual: ".tiro-esp5" },
                    { x, y, largura: 4, altura: 10, velX: -2, velY: 10, tipoVisual: ".tiro-esp5" },
                    { x, y, largura: 4, altura: 10, velX: 2, velY: 10, tipoVisual: ".tiro-esp5" },
                    { x, y, largura: 4, altura: 10, velX: -4, velY: 10, tipoVisual: ".tiro-esp5" },
                    { x, y, largura: 4, altura: 10, velX: 4, velY: 10, tipoVisual: ".tiro-esp5" }
                ];
        }
    }
}
