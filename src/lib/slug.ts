const translitMap: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye", ж: "zh", з: "z",
  и: "y", і: "i", ї: "yi", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
  ь: "", ъ: "", ю: "yu", я: "ya",
  А: "A", Б: "B", В: "V", Г: "H", Ґ: "G", Д: "D", Е: "E", Є: "Ye", Ж: "Zh", З: "Z",
  И: "Y", І: "I", Ї: "Yi", Й: "Y", К: "K", Л: "L", М: "M", Н: "N", О: "O", П: "P",
  Р: "R", С: "S", Т: "T", У: "U", Ф: "F", Х: "Kh", Ц: "Ts", Ч: "Ch", Ш: "Sh", Щ: "Shch",
  Ь: "", Ъ: "", Ю: "Yu", Я: "Ya",
  // russian extras
  ы: "y", э: "e", ё: "yo", Ы: "Y", Э: "E", Ё: "Yo",
};

export function transliterate(text: string): string {
  return text.split("").map(ch => translitMap[ch] ?? ch).join("");
}

export function slugify(text: string): string {
  return transliterate(text)
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}
