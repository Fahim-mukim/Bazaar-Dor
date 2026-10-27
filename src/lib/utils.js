/**
 * Bengali numeral and string formatting utilities for BazarDor
 */

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/**
 * Converts any English number or string containing digits into Bengali numerals.
 * Handles decimals and commas properly.
 */
export function toBengaliNumber(value) {
  if (value === null || value === undefined || value === "") return "";
  
  const num = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(num)) {
    // If it's a string with digits, replace each digit
    return String(value).replace(/[0-9]/g, (d) => BENGALI_DIGITS[parseInt(d, 10)]);
  }

  // Format with Bengali locale for proper comma separation
  return num.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
}

/**
 * Format price in Bengali: e.g. "১৪৮ টাকা"
 */
export function formatPrice(price) {
  if (price === null || price === undefined) return "—";
  return `${toBengaliNumber(price)} টাকা`;
}

/**
 * Format unit into standard Bengali: e.g. "প্রতি কেজি"
 */
export function formatUnit(unit) {
  if (!unit) return "প্রতি একক";
  const lower = String(unit).toLowerCase().trim();
  switch (lower) {
    case "kg":
    case "কেজি":
      return "প্রতি কেজি";
    case "liter":
    case "litre":
    case "l":
    case "লিটার":
      return "প্রতি লিটার";
    case "dozen":
    case "ডজন":
      return "প্রতি ডজন";
    case "piece":
    case "pc":
    case "পিস":
      return "প্রতি পিস";
    case "hali":
    case "হালি":
      return "প্রতি হালি";
    default:
      return lower.startsWith("প্রতি") ? lower : `প্রতি ${unit}`;
  }
}

/**
 * Format price change with badge info
 */
export function formatChange(change) {
  if (!change) {
    return {
      text: "— ০.০%",
      dir: "flat",
      colorClass: "bg-gray-100 text-gray-600 border-gray-200",
      sign: "—",
    };
  }

  const { dir, pct } = change;
  const absPct = Math.abs(pct || 0);
  const formattedPct = toBengaliNumber(absPct.toFixed(1));

  if (dir === "up" || pct > 0) {
    return {
      text: `▲ ${formattedPct}%`,
      dir: "up",
      colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      sign: "▲",
    };
  }

  if (dir === "down" || pct < 0) {
    return {
      text: `▼ ${formattedPct}%`,
      dir: "down",
      colorClass: "bg-rose-50 text-rose-700 border-rose-200",
      sign: "▼",
    };
  }

  return {
    text: `— ${formattedPct}%`,
    dir: "flat",
    colorClass: "bg-gray-100 text-gray-600 border-gray-200",
    sign: "—",
  };
}
