import {collection, GeoPoint, getDocs, getFirestore, orderBy, where} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {query} from "@firebase/database";

const db = getFirestore(firebase_app)

interface Place {
    coords: number[][],
    name: string,
    id: string,
}

export default async function getCoordinates() {
    // @ts-ignore
    const q = query(collection(db, "Users"), where("userType", "==", "organization"));
    let coordinatesGeoPoint: Array<GeoPoint> = [];
    let coordinates: Array<number[]> = [];
    let coordsId: Map<string, number[]> = new Map<string, number[]>();
    let i = 0;
    let places: Array<Place> = [];
    // @ts-ignore
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // @ts-ignore
        /*let place: Place = {
            id: doc.id,
            name: doc.data().title,
            coords: [doc.data().position.latitude, doc.data().position.longitude]
        };
        places.push(place);*/
        // @ts-ignore
        coordinatesGeoPoint.push(doc.data().position)
        // @ts-ignore
        coordsId.set(doc.id, [doc.data().position.latitude, doc.data().position.longitude])
    });

    coordinatesGeoPoint.forEach((point) => {
        coordinates[i] = [point.latitude, point.longitude]
        i++;
    })

    //return coordinates;
    return coordsId;
}