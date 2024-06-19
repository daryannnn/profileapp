import {Avatar, Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import * as React from "react";
import {useEffect} from "react";
import getUserData from "@/firebase/getUserData";
import {getDownloadURL, getStorage, ref} from "@firebase/storage";
import firebase_app from "@/firebase/config";
import {blue, yellow} from "@mui/material/colors";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

const interests = [
    { rus: 'Бег', value: 'Running' },
    { rus: 'Аэробика', value: 'Aerobics' },
    { rus: 'Тренажерный зал', value: 'Gym' },
    { rus: 'Теннис', value: 'Tennis' },
    { rus: 'Боевые искусства', value: 'Martial arts' },
    { rus: 'Ходьба', value: 'Walking' },
    { rus: 'Велоспорт', value: 'Cycling' },
    { rus: 'Танцы', value: 'Dancing' },
    { rus: 'Фитнес', value: 'Fitness' },
    { rus: 'Плавание', value: 'Swimming' },
    { rus: 'Йога', value: 'Yoga' },
    { rus: 'Бодибилдинг', value: 'Body-building' },
    { rus: 'Футбол', value: 'Soccer' },
    { rus: 'Хоккей', value: 'Hockey' },
    { rus: 'Волейбол', value: 'Volleyball' },
    { rus: 'Баскетбол', value: 'Basketball' },
    { rus: 'Легкая атлетика', value: 'Athletics' },
    { rus: 'Тяжелая атлетика', value: 'Weightlifting' },
    { rus: 'Лыжный спорт', value: 'Skiing' },
    { rus: 'Бокс', value: 'Box' },
    { rus: 'Фигурное катание', value: 'Figure skating' },
    { rus: 'Гимнастика', value: 'Gymnastics' },
    { rus: 'Шахматы', value: 'Chess' },
    { rus: 'Настольный теннис', value: 'Table tennis' },
];

interface Props {
    userId: string,
}

export default function ProfileCard(props: Props) {
    const [name, setName] = React.useState(null);
    const [interestsMap, setInterestsMap] = React.useState<Map<string, boolean>>(new Map());
    const [interest, setInterest] = React.useState<string[]>([]);
    const [profilePhotoUrl, setProfilePhotoUrl] = React.useState<string>("");
    const [positionName, setPositionName] = React.useState("");
    useEffect(() => {
        async function getUser() {
            const userGetted = await getUserData(props.userId);
            // @ts-ignore
            setName(userGetted.result.name);
            // @ts-ignore
            setInterestsMap(new Map(Object.entries(userGetted.result.categories)));
            // @ts-ignore
            setProfilePhotoUrl(userGetted.result.profilePhotoUrl);
            // @ts-ignore
            setPositionName(userGetted.result.positionName);
        }
        getUser();
    }, [props])

    const storage = getStorage(firebase_app);
    const [avatar, setAvatar] = React.useState<string>("");
    useEffect(() => {
        if (profilePhotoUrl.length > 0) {
            const reference = ref(storage, profilePhotoUrl);
            getDownloadURL(reference).then((url) => {
                setAvatar(url)
            });
        } else {
            setAvatar("")
        }
    }, [profilePhotoUrl]);

    useEffect(() => {
        setInterest([])
        if (interestsMap) {
            interestsMap.forEach((mapValue, key) => {
                if (mapValue) {
                    setInterest(old => [...old, key]);
                }
            })
        }
    }, [interestsMap]);

    return (
        <Link data-testid="link-to-profile" style={{ textDecoration: 'none', color: 'inherit' }} href={`/profile/${props.userId}`}>
            <Box sx={{ width: "45vw", flexDirection: 'row', bgcolor: "primary.light", display: 'flex', justifyContent: 'start', padding: "10px", borderRadius: 1, margin: "0 7vw 0 6vw", alignItems: "center"}}>
                {
                    (avatar.length > 0) ? (
                        <Avatar data-testid="avatar-photo" sx={{ border: "solid", borderColor: "white", height: '50px', width: '50px', margin: "0 10px 0 0" }} variant="rounded" src={avatar} />
                    ) : (
                        <Avatar data-testid="avatar-nophoto" sx={{ border: "solid", borderColor: "white", height: '50px', width: '50px', margin: "0 10px 0 0", color: "primary.light" }} variant="rounded" >
                            <AccountBoxIcon sx={{ fontSize: 50 }} />
                        </Avatar>
                    )
                }
                    <Box>
                        <Typography data-testid="name"><strong>{name}</strong></Typography>
                        {
                            (positionName.length > 0) ? (
                                <Typography data-testid="position" sx={{ color: "text.disabled" }}>{positionName}</Typography>
                            ) : (
                                <div></div>
                            )
                        }
                        <Box sx={{display: 'flex', justifyContent: 'start', margin: "10px 0 0 0"}}>
                            {
                                interest.map((i) => (
                                    <Box key={i} sx={{ margin: "0 5px", padding: "2px 5px", borderRadius: 2, bgcolor: yellow[100] }}>
                                        {
                                            <div>{interests.find(val => val.value === i)?.rus}</div>
                                        }
                                    </Box>
                                ))
                            }
                        </Box>
                    </Box>
            </Box>
        </Link>
    )
}