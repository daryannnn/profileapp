import {Auth, signOut} from "firebase/auth";

export default async function signIn(auth: Auth) {
    let result = null,
        error = null;
    try {
        result = await signOut(auth);
    } catch (e) {
        error = e;
    }

    return { result, error };
}