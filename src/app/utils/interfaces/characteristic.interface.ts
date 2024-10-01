export interface Characteristic {
    id: number;
    name: string;
    value: string;
    isCorrect?: boolean; // Ajouté pour indiquer si la réponse est correcte
    isIncorrect?: boolean; // Ajouté pour indiquer si la réponse est incorrecte
  }
  