/*
 * ================================================================
 * 2048 INFINITE
 * CONEXIÓN CON SUPABASE
 * ================================================================
 *
 * Este archivo se encarga únicamente de conectar
 * nuestro juego con Supabase.
 *
 * NO contiene la lógica del juego.
 *
 * La lógica del 2048 permanece en:
 *
 *     /js/game.js
 *
 * ================================================================
 */

import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


/*
 * ================================================================
 * CONFIGURACIÓN DE SUPABASE
 * ================================================================
 *
 * URL de nuestro proyecto.
 */

const SUPABASE_URL =
    "https://jmqnyaemtviwitgxyadm.supabase.co";


/*
 * Clave pública de Supabase.
 *
 * Esta clave está diseñada para utilizarse
 * desde aplicaciones frontend.
 */

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_BI7D7g0r81w2vm3gyJAmMw_pwMoi5f6";


/*
 * ================================================================
 * CLIENTE SUPABASE
 * ================================================================
 *
 * Creamos la conexión que utilizaremos
 * posteriormente desde el resto del proyecto.
 */

export const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/*
 * ================================================================
 * CONEXIÓN DE PRUEBA
 * ================================================================
 *
 * Esta función nos permitirá comprobar
 * que Supabase está correctamente conectado.
 */

export async function testSupabaseConnection() {

    try {

        const {
            data,
            error
        } = await supabase
            .from("players")
            .select("*")
            .limit(1);


        if (error) {

            console.error(
                "Error conectando con Supabase:",
                error
            );

            return false;
        }


        console.log(
            "Supabase conectado correctamente.",
            data
        );

        return true;

    } catch (error) {

        console.error(
            "Error inesperado con Supabase:",
            error
        );

        return false;
    }


    window.testSupabaseConnection = testSupabaseConnection;
}
