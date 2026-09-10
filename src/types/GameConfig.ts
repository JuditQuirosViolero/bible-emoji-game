export interface GameConfig {
    tipo: "nino" | "adulto";
    dificultad: "normal" | "facil" | "medio" | "dificil";
    modo: "solitario" | "grupos";
    nombreJugador?: string;
    grupos?: string[];
}