import {doc, GeoPoint, getFirestore, setDoc, Timestamp} from "firebase/firestore";
import firebase_app from "@/firebase/config";

const db = getFirestore(firebase_app)

export const addSportsman = async (id: string,
                              name: string,
                              nickname: string,
                              description: string,
                              categories: { [k: string]: boolean; },
                              sex: string,
                              birthdate: Timestamp,
                              position?: GeoPoint,
                                   positionName?: string,
                                  ) => {
    try {
        if (position) {
            await setDoc(doc(db, "Users", id), {
                name,
                nickname,
                sex,
                description,
                birthdate,
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
                userType: "athlete",
                profilePhotoUrl: "",
            })
        } else {
            await setDoc(doc(db, "Users", id), {
                name,
                nickname,
                sex,
                description,
                birthdate,
                categories,
                positionName: '',
                dateCreated: Timestamp.fromDate(new Date()),
                eventsCount: 0,
                followersCount: 0,
                followingsCount: 0,
                photosCount: 0,
                postsCount: 0,
                servicesCount: 0,
                userType: "athlete",
                profilePhotoUrl: "",
            })
        }
    } catch (err) {
        console.error(err)
    }
}