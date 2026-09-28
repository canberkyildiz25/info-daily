import { Fragment } from 'react';

/* Tireli kelimeler ("Hands-On", "Wi-Fi", "E-Reader") büyük başlıklarda
   satır sonunda tireden bölünüyordu: "Hands-" bir satırda, "On" ötekinde.
   Kelimeyi bölünmez bir aralığa alıyoruz; metnin kendisi değişmiyor. */
export function keepHyphenated(text: string) {
  return text.split(/(\S+-\S+)/g).map((part, i) =>
    /\S+-\S+/.test(part)
      ? <span key={i} className="whitespace-nowrap">{part}</span>
      : <Fragment key={i}>{part}</Fragment>,
  );
}
