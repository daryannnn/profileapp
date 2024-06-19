import {doc, GeoPoint, getFirestore} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {updateDoc} from "@firebase/firestore";

const db = getFirestore(firebase_app)

export const changeOrganization = async (id: string,
                                      name: string,
                                      nickname: string,
                                      description: string,
                                         categories: { [k: string]: boolean; },
                                         position: GeoPoint,
                                         positionName: string,
) => {
    try {
        await updateDoc(doc(db, "Users", id), {
            name,
            nickname,
            description,
            categories,
            position,
            positionName,
        })
    } catch (err) {
        console.error(err)
    }
}