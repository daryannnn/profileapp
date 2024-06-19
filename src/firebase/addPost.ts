import {
    addDoc,
    collection,
    doc,
    getCountFromServer,
    getFirestore,
    query,
    Timestamp,
    updateDoc,
    where
} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {getStorage, ref, uploadBytes} from "@firebase/storage";
import {arrayUnion} from "@firebase/firestore";

const db = getFirestore(firebase_app)
const storage = getStorage(firebase_app);

export const addPost = async (authorId: string,
                                      authorName: string,
                                      text: string,
                              images: File[] | null,
                              authorProfilePhotoUrl: string,
) => {
    try {
        const newPost = await addDoc(collection(db, "Posts"), {
            authorId,
            authorName,
            text,
            authorProfilePhotoUrl,
            dateCreated: Timestamp.fromDate(new Date()),
            likesCount: 0,
            imagesUrls: [],
        });

        if (images != null) {
            images.map(async image => {
                const storageRef = ref(storage, `images/posts/` + newPost.id + '/' + image.name);
                await uploadBytes(storageRef, image);
                await updateDoc(doc(db, "Posts", newPost.id), {
                    imagesUrls: arrayUnion(`images/posts/` + newPost.id + '/' + image.name)
                });
            })
        }

        const q = query(collection(db, "Posts"), where("authorId", "==", authorId));
        const count = await getCountFromServer(q);
        await updateDoc(doc(db, "Users", authorId), {
            postsCount: count.data().count,
        });

    } catch (err) {
        console.error(err)
    }
}