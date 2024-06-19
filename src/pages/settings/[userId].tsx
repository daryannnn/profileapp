import SportsmanSettingsLayout from "@/components/settings/SportsmanSettingsLayout";
import OrganizationSettingsLayout from "@/components/settings/OrganizationSettingsLayout";
import React, {useCallback, useEffect, useMemo} from "react";
import getUserData from "@/firebase/getUserData";
import {useRouter} from "next/router";
import {getAuth, onAuthStateChanged, signInWithEmailAndPassword} from "@firebase/auth";
import firebase_app from "@/firebase/config";


export default function SettingsPage() {
    /*const auth = getAuth(firebase_app);
    signInWithEmailAndPassword(auth, "email@email.yr", "111111");
    const [user, setUser] = React.useState(auth.currentUser);

    const router = useRouter()
    const { userId } = useMemo(() => ({
        userId: router.query?.userId?.toString() ?? "",
    }), [router.query?.userId]);

    const [userType, setUserType] = React.useState("");
    useEffect(() => {
        async function getUser() {
            const userGetted = await getUserData(userId);
            // @ts-ignore
            setUserType(userGetted.result.userType)
        }
        if (userId != "") {
            getUser();
        }
    }, [userId])

    const isUserLoggedIn = useCallback(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                return router.push("/login");
            } else {
                setUser(user)
            }
        });
    }, []);

    useEffect(() => {
        isUserLoggedIn();
    }, [isUserLoggedIn]);

    if (userType != "" && user != null) {
        return (
            <div>
                {
                    (userType == "athlete") ? (
                        <SportsmanSettingsLayout id={userId} currentUserEmail={user.email!} />
                    ) : (
                        <OrganizationSettingsLayout id={userId} currentUserEmail={user.email!} />
                    )
                }
            </div>
        );
    } else {
        return (
            <div>
            </div>
        )
    }*/
    return (
        <OrganizationSettingsLayout id={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"} currentUserEmail={"gym@gym.yr"} />
    )
}