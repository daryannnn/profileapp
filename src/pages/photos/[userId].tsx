import UserPhotosSurface from "@/components/UserPhotosSurface";
import {useRouter} from "next/router";
import React, {useEffect, useMemo} from "react";
import {getAuth, onAuthStateChanged, signInWithEmailAndPassword} from "@firebase/auth";
import firebase_app from "@/firebase/config";
import ProfileUpper from "@/components/ProfileUpper";

const auth = getAuth(firebase_app);

export default function Photos() {
   signInWithEmailAndPassword(auth, "gym@gym.yr", "111111");

   const [user, setUser] = React.useState(auth.currentUser);

   const router = useRouter();
   const { userId} = useMemo(() => ({
      userId: router.query?.userId?.toString() ?? "",
   }), [router.query?.userId]);

   useEffect(() => {
      onAuthStateChanged(auth, (user) => {
         if (user) {
            setUser(user)
         }
      });
   }, []);

   if (userId != "" && user != null) {
      return (
          <>
             <UserPhotosSurface id={userId} currentUserId={user.uid} />
          </>
      );
   } else {
      return (
          <div>
          </div>
      )
   }
}