import type {AppLocale} from "./config";

type JsonRecord = Record<string, unknown>;

const DOMAIN_FILES = ["common", "dashboard", "chat", "events", "profile"] as const;

function deepMerge(target: JsonRecord, source: JsonRecord): JsonRecord {
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === "object" &&
      !Array.isArray(targetValue)
    ) {
      target[key] = deepMerge(targetValue as JsonRecord, sourceValue as JsonRecord);
      continue;
    }

    target[key] = sourceValue;
  }

  return target;
}

export async function getLocaleMessages(locale: AppLocale) {
  const merged = {} as JsonRecord;

  for (const domain of DOMAIN_FILES) {
    const fileMessages = (await import(`../messages/${locale}/${domain}.json`)).default as JsonRecord;
    deepMerge(merged, fileMessages);
  }

  return merged;
}
