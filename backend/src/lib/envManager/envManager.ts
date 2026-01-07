import type { VariableEnvListeType } from "../../types/variableEnv.d.ts";

function findeVariable(variable: VariableEnvListeType): string {
  // récupère la variable d'environnement avec le nom passé en paramètre
  const value = process.env[variable];

  // si la variable n'existe pas, lance une erreur
  if (value === undefined || value === "") {
    throw new Error(`🚨 Variable d'environnement manquante : ${variable}`);
  }

  // retourne la valeur de la variable d'environnement
  return value;
}

// Entrées possibles
type Entry = VariableEnvListeType | readonly [VariableEnvListeType, true];

type BuildShape<T extends readonly Entry[]> = {
  [P in T[number] as P extends VariableEnvListeType
    ? P
    : P extends readonly [infer K, any]
      ? K extends VariableEnvListeType
        ? K
        : never
      : never]: P extends readonly [any, true] ? number : string;
};

// fonction pour récupérer plusieurs variables d'un coup
export function getVariableEnvMulti<const T extends readonly Entry[]>(entries: T): BuildShape<T>;
export function getVariableEnvMulti<const T extends readonly Entry[]>(variableEnvName: T): BuildShape<T> {
  const result = {} as BuildShape<T>;
  for (const variable of variableEnvName) {
    if (typeof variable === "string") {
      const value = findeVariable(variable);
      (result as any)[variable] = value;
    } else {
      const [key, isNumber] = variable;
      const value = findeVariable(variable[0]);
      if (isNumber) {
        const valueNumber = Number(value);
        if (Number.isNaN(valueNumber)) {
          throw new Error(`🚨 Variable d'environnement ${key} n'est pas un nombre valide`);
        }
        (result as any)[key] = valueNumber;
      } else {
        (result as any)[key] = value;
      }
    }
  }
  return result;
}

// function pour récupérer que une seul variable
export function getVariableEnv(variableEnvName: VariableEnvListeType, isNomber: true): number;
export function getVariableEnv(variableEnvName: VariableEnvListeType, isNomber?: false): string;
export function getVariableEnv(variableEnvName: VariableEnvListeType, isNomber?: boolean): string | number {
  const envValue = findeVariable(variableEnvName);
  if (isNomber) {
    const envValueNumber = Number(envValue);
    // si la valeur n'est pas un nombre, lance une erreur
    if (Number.isNaN(envValueNumber)) {
      throw new Error(`🚨 Variable d'environnement ${variableEnvName} n'est pas un nombre valide`);
    }
    return envValueNumber;
  }
  // sion on returne le string
  return envValue;
}
