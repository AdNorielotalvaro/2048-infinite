import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL =
    "https://jmqnyaemtviwitgxyadm.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_BI7D7g0r81w2vm3gyJAmMw_pwMoi5f6";

export const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

export async function loginUser(email, password) {

    const {
        data,
        error
    } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error(
            "Error iniciando sesión:",
            error
        );

        return false;
    }

    console.log(
        "Usuario autenticado correctamente:",
        data.user
    );

    return true;
}

export async function getCurrentPlayer() {

    const {
        data: {
            user
        },
        error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {

        console.error(
            "No hay usuario autenticado:",
            userError
        );

        return null;
    }

    const {
        data,
        error
    } = await supabase
        .from("players")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) {

        console.error(
            "Error obteniendo jugador:",
            error
        );

        return null;
    }

    console.log(
        "Jugador encontrado:",
        data
    );

    return data;
}
