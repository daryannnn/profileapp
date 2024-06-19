import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    TextField, ThemeProvider,
    Typography
} from "@mui/material";
import {blue, yellow} from "@mui/material/colors";
import PlaceIcon from '@mui/icons-material/Place';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import React, {useEffect} from "react";
import firebase_app from "@/firebase/config";
import getUserData from "@/firebase/getUserData";
import StarIcon from '@mui/icons-material/Star';
import Link from "next/link";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {addPost} from "@/firebase/addPost";
import {deleteDoc, onSnapshot, updateDoc} from "@firebase/firestore";
import {collection, doc, getFirestore, increment, query, setDoc, where} from "firebase/firestore";
import {changeProfilePhoto} from "@/firebase/changeProfilePhoto";
import {getDownloadURL, getStorage, ref} from "@firebase/storage";
import ButtonD from "@/components/ButtonD";
import {theme} from "@/utils/theme";

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
    id: string,
    currentUserId: string,
    currentUserName: string,
}

export default function ProfileUpper(props: Props) {
    const [own, setOwn] = React.useState(false);
    useEffect(() => {
        (props.id == props.currentUserId) ? setOwn(true) : setOwn(false)
    }, []);

    const [name, setName] = React.useState(null);
    const [userType, setUserType] = React.useState(null);
    const [followersCount, setFollowersCount] = React.useState(null);
    const [followingsCount, setFollowingsCount] = React.useState(null);
    const [description, setDescription] = React.useState(null);
    const [interestsMap, setInterestsMap] = React.useState<Map<string, boolean>>(new Map());
    const [interest, setInterest] = React.useState<string[]>([]);
    const [profilePhotoUrl, setProfilePhotoUrl] = React.useState<string>("");
    const [positionName, setPositionName] = React.useState("");
    useEffect(() => {
        async function getUser() {
            const userGetted = await getUserData(props.id);
            // @ts-ignore
            setName(userGetted.result.name);
            // @ts-ignore
            (userGetted.result.userType == "athlete") ? setUserType("спортсмен") : setUserType("организация");
            // @ts-ignore
            setFollowingsCount(userGetted.result.followingsCount);
            // @ts-ignore
            setFollowersCount(userGetted.result.followersCount);
            // @ts-ignore
            setDescription(userGetted.result.description);
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
        }
    }, [profilePhotoUrl]);

    useEffect(() => {
        if (interestsMap) {
            interestsMap.forEach((mapValue, key) => {
                if (mapValue) {
                    setInterest(old => [...old, key]);
                }
            })
        }
    }, [interestsMap]);

    const [followed, setFollowed] = React.useState(false);
    function handleFollow() {
        // @ts-ignore
        updateDoc(doc(getFirestore(firebase_app), "Users", props.currentUserId), {
            followingsCount: increment(1),
        });
        setDoc(doc(getFirestore(firebase_app), "Users", props.currentUserId, "Followings Ids", props.id), {
            userId: props.id,
        });
        updateDoc(doc(getFirestore(firebase_app), "Users", props.id), {
            followersCount: increment(1),
        });
        setDoc(doc(getFirestore(firebase_app), "Users", props.id, "Followers Ids", props.currentUserId), {
            userId: props.currentUserId,
        });
        // @ts-ignore
        setFollowersCount(followersCount+1);
    }
    function handleUnfollow() {
        // @ts-ignore
        updateDoc(doc(getFirestore(firebase_app), "Users", props.currentUserId), {
            followingsCount: increment(-1),
        });
        deleteDoc(doc(getFirestore(firebase_app), "Users", props.currentUserId, "Followings Ids", props.id));
        updateDoc(doc(getFirestore(firebase_app), "Users", props.id), {
            followersCount: increment(-1),
        });
        deleteDoc(doc(getFirestore(firebase_app), "Users", props.id, "Followers Ids", props.currentUserId));
        // @ts-ignore
        setFollowersCount(followersCount-1);
    }

    const qFollowed = query(collection(getFirestore(firebase_app), "Users", props.currentUserId, "Followings Ids"), where("userId", "==", props.id));
    const isFollowed = onSnapshot(qFollowed, (querySnapshot) => {
        setFollowed(!querySnapshot.empty);
    });

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setImages(null);
    };

    const [text, setText] = React.useState("");
    const [images, setImages] = React.useState<File[] | null>(null);
    const handleForm = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        await addPost(props.currentUserId, props.currentUserName, text, images, profilePhotoUrl);
        handleClose();
    }

    const [openPhotoDialog, setOpenPhotoDialog] = React.useState(false);
    const handleClickOpenPhotoDialog = () => {
        setOpenPhotoDialog(true);
    };
    const handleClosePhotoDialog = () => {
        setOpenPhotoDialog(false);
    };

    const [newProfilePhoto, setNewProfilePhoto] = React.useState<File | null>(null);
    const handlePhotoForm = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        if (newProfilePhoto) {
            await changeProfilePhoto(props.currentUserId, newProfilePhoto);
        } else {
            alert("Выберите фото")
        }
        handleClosePhotoDialog();
    }
    const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewProfilePhoto(e.target.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // @ts-ignore
            if (((e.target.files.length + images?.length) > 10) || (e.target.files.length > 10)) {
                alert("Вы можете выбрать до 10 изображений")
            } else {
                setImages(Array.from(e.target.files));
                //console.log(images)
            }
            //console.log(image)
        }
    };

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{ maxWidth: 800, margin: "10px auto" }}>
            <Paper sx={{ maxWidth: 800, margin: "0 auto", padding: "10px 20px", bgcolor: "primary.light" }}>
                <Box sx={{display: "flex", flexDirection: 'row'}}>
                    {
                        own ? (
                            <div>
                                {
                                    (avatar.length > 0) ? (
                                        <Avatar sx={{ border: "solid", borderColor: "white", height: '200px', width: '200px' }} variant="rounded" onClick={handleClickOpenPhotoDialog} src={avatar} />
                                    ) : (
                                        <Avatar sx={{ border: "solid", borderColor: "white", height: '200px', width: '200px' }} variant="rounded" onClick={handleClickOpenPhotoDialog} >
                                            <AccountBoxIcon sx={{ fontSize: 160, color: "primary.light" }} />
                                        </Avatar>
                                    )
                                }
                            </div>
                        ) : (
                            <div>
                                {
                                    (avatar.length > 0) ? (
                                        <Avatar sx={{ border: "solid", borderColor: "white", height: '200px', width: '200px' }} variant="rounded" src={avatar} />
                                    ) : (
                                        <Avatar sx={{ border: "solid", borderColor: "white", height: '200px', width: '200px' }} variant="rounded" >
                                            <AccountBoxIcon sx={{ fontSize: 160, color: "primary.light" }} />
                                        </Avatar>
                                    )
                                }
                            </div>
                        )
                    }
                    <Box sx={{margin: "0 0 0 20px", width: 600}}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography data-testid="name" variant={"h6"}>{name}</Typography>
                            <Typography color={"text.secondary"}>{userType}</Typography>
                        </Box>
                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button sx={{color: "#2E7D32", borderColor: "#2E7D32"}} variant={"outlined"}>{followersCount} подписчиков</Button>
                            <Button sx={{color: "#2E7D32", borderColor: "#2E7D32"}} variant={"outlined"}>{followingsCount} подписок</Button>
                        </Box>
                        {
                            (positionName.length > 0) ? (
                                <Box sx={{display: 'flex', justifyContent: 'start', margin: "7px 0"}}>
                                    <PlaceIcon sx={{ color: "text.disabled", height: "20px" }}/>
                                    <Typography variant="body2" sx={{ color: "text.disabled" }}>{positionName}</Typography>
                                </Box>
                            ) : (
                                <div>
                                </div>
                            )
                        }
                        <Typography sx={{ border: "0.5px solid", borderColor: "primary.main", borderRadius: 1, padding: "0 5px" }}>
                            {description}
                        </Typography>
                        <Box sx={{display: 'flex', justifyContent: 'start', margin: "10px 0 0 0"}}>
                            <Typography variant={"body2"} color={"text.secondary"}>
                                КАТЕГОРИИ:
                            </Typography>
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
                        <div>
                            {
                                own ? (
                                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/favorites/posts"}>
                                        <Button sx={{margin: "10px 0 0 0", bgcolor: "#2E7D32"}} size={"small"} variant={"contained"}>
                                            <StarIcon sx={{color: "white"}} />
                                            <Typography sx={{color: "white"}} variant="button">избранное</Typography>
                                        </Button>
                                    </Link>
                                ) : (
                                            followed ? (
                                                    <Button onClick={handleUnfollow} sx={{margin: "10px 0 0 0", bgcolor: "#2E7D32"}} size={"small"} variant={"contained"}>
                                                        <CheckIcon sx={{color: "white"}}/>
                                                        <Typography sx={{color: "white"}} variant="button">ВЫ ПОДПИСАНЫ</Typography>
                                                    </Button>
                                            ) : (
                                                <Button onClick={handleFollow} sx={{margin: "10px 0 0 0", bgcolor: "#2E7D32"}} size={"small"} variant={"contained"}>
                                                    <AddIcon sx={{color: "white"}} />
                                                    <Typography sx={{color: "white"}} variant="button">ПОДПИСАТЬСЯ</Typography>
                                                </Button>
                                            )
                                )
                            }
                        </div>
                    </Box>
                </Box>
            </Paper>

            <Box sx={{display: 'flex', justifyContent: 'space-between', margin: "10px 0"}}>
                <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/photos/${props.id}`}>
                    <ButtonD text={"Фото"} icon={<PhotoLibraryIcon sx={{color: "primary.dark"}}/>} />
                </Link>
                <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/photos/${props.id}`}>
                    <ButtonD text={"Мероприятия"} icon={<CalendarTodayIcon sx={{color: "primary.dark"}} />} />
                </Link>
                <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/programs/${props.id}`} >
                    <ButtonD text={"Услуги"} icon={<SportsMmaIcon sx={{color: "primary.dark"}}/>} />
                </Link>
                {/*
                <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/photos/${props.id}`}>
                    <Button data-testid="photos-button" variant={"contained"} sx={{bgcolor: blue[200], textTransform: "none", height: "70px"}}>
                        <PhotoLibraryIcon color={"primary"}/>
                        <Typography sx={{ margin: "10px 10px" }} variant={"h6"} color={"black"}>Фото</Typography>
                        <PhotoLibraryIcon color={"primary"}/>
                    </Button>
                </Link>
                <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/events/${props.id}`}>
                    <Button variant={"contained"} sx={{bgcolor: blue[200], textTransform: "none"}}>
                        <CalendarTodayIcon color={"primary"}/>
                        <Typography sx={{ margin: "10px 10px" }} variant="h6" color={"black"}>Мероприятия</Typography>
                        <CalendarTodayIcon color={"primary"}/>
                    </Button>
                </Link>
                <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/services/${props.id}`} >
                    <Button variant={"contained"} sx={{bgcolor: blue[200], textTransform: "none"}}>
                        <SportsMmaIcon color={"primary"}/>
                        <Typography sx={{ margin: "10px 10px" }} variant={"h6"} color={"black"}>Услуги</Typography>
                        <SportsMmaIcon color={"primary"}/>
                    </Button>
                </Link>
                */}
            </Box>
            <div>
                {
                    own ? (
                        <Box display={"flex"} justifyContent={"center"}>
                            <Button sx={{bgcolor: "#2E7D32"}} onClick={handleClickOpen} variant="contained">
                                <AddIcon sx={{color: "white"}}/>
                                <Typography sx={{color: "white"}} variant="button">новая запись</Typography>
                            </Button>
                        </Box>
                    ) : (
                        <div></div>
                    )
                }
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "50vw",  // Set your width here
                        },
                    },
                }}
            >
                <form onSubmit={handleForm}>
                    <DialogTitle>Новая запись</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Текст записи"
                            variant="outlined"
                            fullWidth
                            margin={"normal"}
                            multiline
                            required
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            component="label"
                            sx={{margin: "10px 0 0 0"}}
                        >
                            Добавить фото
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                                //multiple={false}
                                multiple
                            />
                        </Button>
                        <div>
                            {
                                (images && images.length > 0) ? (
                                    <>
                                        {
                                            images.map((image) => (
                                                <Typography key={image.name}>{image.name}</Typography>
                                            ))
                                        }
                                    </>
                                ) : (
                                    <div>
                                    </div>
                                )
                            }
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Отмена</Button>
                        <Button type={"submit"}>Добавить</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog
                open={openPhotoDialog}
                onClose={handleClosePhotoDialog}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "70vw",  // Set your width here
                        },
                    },
                }}
            >
                <form onSubmit={handlePhotoForm}>
                    <DialogTitle>Изменить фото профиля</DialogTitle>
                    <DialogContent>
                        {
                            newProfilePhoto ? (
                                <img
                                    src={URL.createObjectURL(newProfilePhoto)}
                                    loading="lazy"
                                    style={{borderRadius:'10px', maxWidth: "70vw", margin: "0 auto"}}
                                />
                            ) : (
                                <div></div>
                            )
                        }
                        <Button
                            variant="contained"
                            component="label"
                            sx={{margin: "10px 0 0 0"}}
                        >
                            Новое фото
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handlePhotoFileChange}
                                multiple={false}
                            />
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosePhotoDialog}>Отмена</Button>
                        <Button type={"submit"}>Изменить</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
        </ThemeProvider>
    )
}