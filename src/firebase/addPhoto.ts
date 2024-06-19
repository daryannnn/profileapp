import {addDoc, collection, doc, getCountFromServer, getFirestore, query, updateDoc} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {getStorage, ref, uploadBytes} from "@firebase/storage";

const db = getFirestore(firebase_app)
const storage = getStorage(firebase_app);

export const addPhoto = async ( image: File,
                                userId: string,
                                ) => {
    try {
        const storageRef = ref(storage, `images/users/` + userId + '/album_photos/' + image.name);
        await uploadBytes(storageRef, image);
        await addDoc(collection(db, "Users", userId, "User PhotosUrls"), {
            photoUrl: `images/users/` + userId + '/album_photos/' + image.name,
        });

        const q = query(collection(getFirestore(firebase_app), "Users", userId, "User PhotosUrls"));
        const count = await getCountFromServer(q);
        await updateDoc(doc(db, "Users", userId), {
            photosCount: count.data().count,
        });

    } catch (err) {
        console.error(err)
    }
}