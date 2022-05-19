import { readFileSync } from "fs";

const readJsonFile = (path) => JSON.parse(readFileSync(path));

export const modulesDb = readJsonFile("./test-data/modules.json");
export const lessonsDb = readJsonFile("./test-data/lessons.json");
export const studentsDb = readJsonFile("./test-data/students.json");