import {
  Apple,
  Bird,
  Bug,
  Cat,
  Crown,
  Dog,
  Fish,
  Flame,
  Flower,
  Rabbit,
  Rocket,
  Snail,
  Squirrel,
  Star,
  Turtle,
  User,
  Zap,
} from "lucide-react";

export const avatarOptions = [
  { id: "USER", name: "Pessoa", icon: User },
  { id: "CAT", name: "Gato", icon: Cat },
  { id: "BIRD", name: "Pássaro", icon: Bird },
  { id: "FISH", name: "Peixe", icon: Fish },
  { id: "RABBIT", name: "Coelho", icon: Rabbit },
  { id: "TURTLE", name: "Tartaruga", icon: Turtle },
  { id: "FLAME", name: "Fogo", icon: Flame },
  { id: "ROCKET", name: "Foguete", icon: Rocket },
  { id: "CROWN", name: "Coroa", icon: Crown },
  { id: "ZAP", name: "Raio", icon: Zap },
  { id: "STAR", name: "Estrela", icon: Star },
  { id: "BUG", name: "Inseto", icon: Bug },
  { id: "SQUIRREL", name: "Esquilo", icon: Squirrel },
  { id: "APPLE", name: "Maçã", icon: Apple },
  { id: "ROSE", name: "Rosa", icon: Flower },
  { id: "PANDA", name: "Panda", icon: Dog },
  { id: "SNAIL", name: "Caracol", icon: Snail },
];

export function findAvatarOption(id) {
  return avatarOptions.find((opt) => opt.id === id) ?? avatarOptions[0];
}
