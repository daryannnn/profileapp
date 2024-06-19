import {doc, GeoPoint, getFirestore, setDoc, Timestamp} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {updateDoc} from "@firebase/firestore";

const db = getFirestore(firebase_app)

export const changeSportsman = async (id: string,
                                   name: string,
                                   nickname: string,
                                   description: string,
                                   sex: string,
                                   birthdate: Timestamp,
                                      categories: { [k: string]: boolean; },
                                      position?: GeoPoint,
                                      positionName?: string,
) => {
    try {
        if (position) {
            await updateDoc(doc(db, "Users", id), {
                name,
                nickname,
                sex,
                description,
                birthdate,
                categories,
                position,
                positionName,
            })
        } else {
            await updateDoc(doc(db, "Users", id), {
                name,
                nickname,
                sex,
                description,
                birthdate,
                categories,
            })
        }
    } catch (err) {
        console.error(err)
    }
}