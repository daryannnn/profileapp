import {doc, GeoPoint, getFirestore, setDoc, Timestamp} from "firebase/firestore";
import firebase_app from "@/firebase/config";

const db = getFirestore(firebase_app)

export const addOrganization = async (id: string,
                                   name: string,
                                   nickname: string,
                                   description: string,
                                      categories: { [k: string]: boolean; },
                                      position: GeoPoint,
                                      positionName: string,
) => {
    try {
        await setDoc(doc(db, "Users", id), {
            name,
            nickname,
            description,
            categories,
            position,
            positionName,
            dateCreated: Timestamp.fromDate(new Date()),
            eventsCount: 0,
            followersCount: 0,
            followingsCount: 0,
            photosCount: 0,
            postsCount: 0,
            servicesCount: 0,
            userType: "organization",
            profilePhotoUrl: "",
        })
    } catch (err) {
        console.error(err)
    }
}