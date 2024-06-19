import {collection, doc, documentId, getDoc, getDocs, getFirestore, orderBy, query, where} from "firebase/firestore";
import firebase_app from "@/firebase/config";

const db = getFirestore(firebase_app)

export default async function searchSportsmen(name: string, interest: string[], sex: string, programs: boolean, events: boolean) {
    let usersIds: Array<string> = [];

    const querySnapshotUsers = await getDocs(query(collection(db, "Users"), where("userType", "==", "athlete")));
    querySnapshotUsers.forEach((doc) => {
        usersIds.push(doc.id);
    });

    if (sex.length > 0) {
        let sexIds: Array<string> = [];
        const querySnapshot = await getDocs(query(collection(db, "Users"), where("sex", "==", sex), where("userType", "==", "athlete")));
        querySnapshot.forEach((doc) => sexIds.push(doc.id))
        await Promise.all(usersIds.map(async (userId, index) => {
            if (!sexIds.includes(userId)) {
                //usersIds.splice(index, 1);
                delete usersIds[index]
            }
        }))
        usersIds = usersIds.filter(function( element ) {
            return element !== undefined;
        });
    }

    if (programs) {
        let programIds: Array<string> = [];
        const querySnapshot = await getDocs(query(collection(db, "Training Programs")));
        querySnapshot.forEach((doc) => programIds.push(doc.get("authorId")))
        await Promise.all(usersIds.map(async (userId, index) => {
            if (!programIds.includes(userId)) {
                delete usersIds[index]
            }
        }))
        usersIds = usersIds.filter(function( element ) {
            return element !== undefined;
        });
    }

    if (events) {
        let eventIds: Array<string> = [];
        const querySnapshot = await getDocs(query(collection(db, "Events")));
        querySnapshot.forEach((doc) => eventIds.push(doc.get("organizerId")))
        await Promise.all(usersIds.map(async (userId, index) => {
            if (!eventIds.includes(userId)) {
                delete usersIds[index]
            }
        }))
        usersIds = usersIds.filter(function( element ) {
            return element !== undefined;
        });
    }

    if (name.length > 0) {
        await Promise.all(usersIds.map(async (userId, index) => {
            const docRef = doc(db, "Users", userId);
            const docSnap = await getDoc(docRef);
            if (!(docSnap.get("name").toLowerCase()).match(new RegExp(name.toLowerCase())) &&
                !(docSnap.get("nickname").toLowerCase()).match(new RegExp(name.toLowerCase()))) {

                delete usersIds[index]
            }
        }))
        usersIds = usersIds.filter(function( element ) {
            return element !== undefined;
        });
    }

    if (interest.length > 0) {
        let interestIds: Array<string> = [];
        const querySnapshot = await getDocs(query(collection(db, "Users"), where("userType", "==", "athlete")));
        querySnapshot.forEach((doc) => {
            const interestsMap: Map<string, boolean> = new Map(Object.entries(doc.get("categories")))
            interestsMap.forEach((value, key) => {
                if (value && interest.includes(key)) {
                    interestIds.push(doc.id)
                }
            })
        })
        await Promise.all(usersIds.map(async (userId, index) => {
            if (!interestIds.includes(userId)) {
                delete usersIds[index]
            }
        }))
        usersIds = usersIds.filter(function( element ) {
            return element !== undefined;
        });
    }

    return usersIds;
}