import sqlite3 from "sqlite3";
import { open } from "sqlite";
export async function connection() {
    return open({
        filename: "./dados.db",
        driver: sqlite3.Database
    });
}
