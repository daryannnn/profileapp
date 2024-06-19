import {collection, doc, getDocs, getFirestore, query, updateDoc, where} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {getStorage, ref, uploadBytes} from "@firebase/storage";

const db = getFirestore(firebase_app)
const storage = getStorage(firebase_app);

export const changeProfilePhoto = async (userId: string,
                                        profilePhoto: File,
) => {
    try {
        const storageRef = ref(storage, "images/users/" + userId + '/profile_photo');
        await uploadBytes(storageRef, profilePhoto);

        await updateDoc(doc(db, "Users", userId), {
            profilePhotoUrl: "images/users/" + userId + '/profile_photo',
        });

        let eventIds: Array<string> = [];
        const q = query(collection(db, "Events"), where("organizerId", "==", userId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            eventIds.push(doc.id)
        });
        eventIds.map(async (eventId) => {
            await updateDoc(doc(db, "Events", eventId), {
                organizerProfilePhotoUrl: "images/users/" + userId + '/profile_photo',
            });
        })

        const qPosts = query(collection(db, "Posts"), where("authorId", "==", userId));
        let postIds: Array<string> = [];
        const querySnapshotPosts = await getDocs(qPosts);
        querySnapshotPosts.forEach((doc) => {
            postIds.push(doc.id)
        });
        postIds.map(async (postId) => {
            await updateDoc(doc(db, "Posts", postId), {
                authorProfilePhotoUrl: "images/users/" + userId + '/profile_photo',
            });
        })

        const qPrograms = query(collection(db, "Training Programs"), where("authorId", "==", userId));
        let programIds: Array<string> = [];
        const querySnapshotPrograms = await getDocs(qPrograms);
        querySnapshotPrograms.forEach((doc) => {
            programIds.push(doc.id)
        });
        programIds.map(async (programId) => {
            await updateDoc(doc(db, "Training Programs", programId), {
                authorProfilePhotoUrl: "images/users/" + userId + '/profile_photo',
            });
        })

        const qReviews = query(collection(db, "Training Program Reviews"), where("authorId", "==", userId));
        let reviewsIds: Array<string> = [];
        const querySnapshotReviews = await getDocs(qReviews);
        querySnapshotReviews.forEach((doc) => {
            reviewsIds.push(doc.id)
        });
        reviewsIds.map(async (programId) => {
            await updateDoc(doc(db, "Training Program Reviews", programId), {
                authorProfilePhotoUrl: "images/users/" + userId + '/profile_photo',
            });
        })

    } catch (err) {
        console.error(err)
    }
}