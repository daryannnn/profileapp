import ProfileUpper from "@/components/ProfileUpper";
import {getAuth, onAuthStateChanged, signInWithEmailAndPassword} from "@firebase/auth";
import firebase_app from "@/firebase/config";
import React, {useCallback, useEffect, useMemo} from "react";
import {useRouter} from "next/router";

const auth = getAuth(firebase_app);

export default function ProfilePage() {
    //signInWithEmailAndPassword(auth, "gym@gym.yr", "111111");

    const [user, setUser] = React.useState(auth.currentUser);

    /*const isUserLoggedIn = useCallback(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            }
        });
    }, []);
    useEffect(() => {
        isUserLoggedIn();
    }, [isUserLoggedIn]);*/
    //const currentUser = auth.currentUser;
    /*useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            }
        });
    }, []);*/

    const router = useRouter();
    const { userId} = useMemo(() => ({
        userId: router.query?.userId?.toString() ?? "",
    }), [router.query?.userId]);

    /*const isUserLoggedIn = useCallback(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                return router.push("/login");
            }
        });
    }, [router]);

    useEffect(() => {
        isUserLoggedIn();
    }, [isUserLoggedIn]);*/

    //<ProfileUpper id="uwQpIREuHGY1b2Mu4EjXfEDw6eW2" />
    //<ProfileUpper id="u7bg33K1sJT7vTjzrlSi3SKQbcA3" />
    /*return (
        <>
            <ProfileUpper id="u7bg33K1sJT7vTjzrlSi3SKQbcA3" />
        </>
    )*/
    /*if (userId != "" && user != null) {
        return (
            <>
                <ProfileUpper id={userId} currentUserId={user.uid} currentUserName={user.displayName!}/>
            </>
        );
    } else {
        return (
            <div>
            </div>
        )
    }*/
    if (userId != "") {
        return (
            <>
                <ProfileUpper id={userId} currentUserId={userId} currentUserName={"Тренажерный зал"}/>
            </>
        );
    } else {
        return (
            <div>
            </div>
        )
    }
}