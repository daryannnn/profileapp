import firebase_app from "../config";
import {createUserWithEmailAndPassword, getAuth, updateProfile} from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signUp(email: string, password: string, name: string) {
    let result = null,
        error = null;
    try {
        result = await createUserWithEmailAndPassword(auth, email, password);
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {displayName: name})
        }
    } catch (e) {
        error = e;
    }

    return { result, error };
}