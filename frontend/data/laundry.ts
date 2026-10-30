/**
 * Content for the laundry site. Informational only: nothing here is booked or
 * stored, so there is no backend counterpart.
 */

export type LaundryIconName = "basket" | "hanger" | "iron" | "blanket" | "sparkle" | "sneaker";

export type LaundryService = {
  slug: string;
  name: string;
  description: string;
  turnaround: string;
  icon: LaundryIconName;
};

export type LaundryStep = {
  title: string;
  description: string;
};

export type LaundryFaq = {
  question: string;
  answer: string;
};

export type PickupSlot = {
  days: string;
  hours: string;
};

export const services: readonly LaundryService[] = [
  {
    slug: "lavado-y-doblado",
    name: "Lavado y doblado",
    description:
      "Lavamos, secamos y doblamos tu ropa del día a día, separada por color y tejido.",
    turnaround: "24 h",
    icon: "basket",
  },
  {
    slug: "lavado-en-seco",
    name: "Lavado en seco",
    description: "Para sacos, vestidos y prendas que piden un cuidado profesional.",
    turnaround: "48–72 h",
    icon: "hanger",
  },
  {
    slug: "planchado",
    name: "Planchado",
    description: "Camisas, pantalones y uniformes listos para colgar, sin una sola arruga.",
    turnaround: "24 h",
    icon: "iron",
  },
  {
    slug: "edredones-y-cobijas",
    name: "Edredones y cobijas",
    description: "Piezas grandes lavadas a fondo y devueltas esponjosas y perfumadas.",
    turnaround: "48 h",
    icon: "blanket",
  },
  {
    slug: "prendas-delicadas",
    name: "Prendas delicadas",
    description: "Seda, lana y encaje con lavado a mano y detergentes suaves.",
    turnaround: "48 h",
    icon: "sparkle",
  },
  {
    slug: "tenis-y-zapatos",
    name: "Tenis y zapatos",
    description: "Limpieza profunda, de la suela a los cordones, para calzado de tela y cuero.",
    turnaround: "72 h",
    icon: "sneaker",
  },
];

export const steps: readonly LaundryStep[] = [
  {
    title: "Agenda",
    description: "Elige el día y la franja horaria en que quieres que pasemos por tu ropa.",
  },
  {
    title: "Recogemos",
    description: "Llegamos a tu puerta con una bolsa reutilizable. Tú solo la entregas.",
  },
  {
    title: "Te la devolvemos",
    description: "Limpia, doblada y perfumada, en la misma puerta y a la hora acordada.",
  },
];

export const careNotes: readonly string[] = [
  "Separamos cada carga por color y tipo de tela.",
  "Respetamos la temperatura que pide cada etiqueta.",
  "Doblamos y empacamos todo a mano.",
  "Usamos detergentes hipoalergénicos con aroma a lavanda.",
];

export const faqs: readonly LaundryFaq[] = [
  {
    question: "¿Cuánto tarda el servicio?",
    answer:
      "La mayoría de los pedidos vuelven en 24 horas. El lavado en seco, los edredones y el calzado pueden tardar entre 48 y 72 horas; el tiempo de cada servicio aparece en su tarjeta.",
  },
  {
    question: "¿Tengo que estar en casa?",
    answer:
      "Solo al momento de la recogida y de la entrega. Si no puedes, la puede recibir cualquier persona que dejes encargada.",
  },
  {
    question: "¿Qué pasa si una prenda necesita un cuidado especial?",
    answer:
      "Revisamos cada etiqueta antes de lavar. Si una prenda no admite agua, te avisamos y la pasamos a lavado en seco.",
  },
  {
    question: "¿En qué bolsa entrego la ropa?",
    answer:
      "En la que quieras. En la primera recogida te dejamos una bolsa reutilizable para los siguientes pedidos.",
  },
];

export const pickupSchedule: readonly PickupSlot[] = [
  { days: "Lunes a viernes", hours: "7:00 a. m. – 7:00 p. m." },
  { days: "Sábados", hours: "8:00 a. m. – 2:00 p. m." },
  { days: "Domingos y festivos", hours: "Sin servicio" },
];
