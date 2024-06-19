import {Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper} from "@mui/material";
import {blue} from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import React, {useEffect} from "react";
import 'dayjs/locale/de';
import {collection, doc, getDoc, getDocs, getFirestore} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {addPhoto} from "@/firebase/addPhoto";
import Link from "next/link";
import {StorageReference, getDownloadURL, getStorage, ref} from "@firebase/storage";

interface Props {
    id: string,
    currentUserId: string,
}

export default function UserPhotosSurface(props: Props) {
    const [own, setOwn] = React.useState(props.id == props.currentUserId);

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setImage(null);
    };

    const [rusType, setRusType] = React.useState("");
    const [name, setName] = React.useState();
    const [photoUrlsArr, setPhotoUrlsArr] = React.useState<string[]>([]);
    useEffect(() => {
        async function getType() {
            const docRef = doc(getFirestore(firebase_app), "Users", props.id);
            const docSnap = await getDoc(docRef);
            (docSnap.get("userType") == "organization") ? (setRusType("организации")) : (setRusType("пользователя"))
        }

        async function getName() {
            const docRef = doc(getFirestore(firebase_app), "Users", props.id);
            const docSnap = await getDoc(docRef);
            setName(docSnap.get("name"))
        }

        async function getData() {
            let copyArr: string[] = [];
            await getDocs(collection(getFirestore(firebase_app), "Users", props.id, "User PhotosUrls")).then((data) => {
                //setPhotoUrlsArr([]);
                data.forEach((doc) => {
                    copyArr.push(doc.get("photoUrl"));
                    //setPhotoUrlsArr(old => [...old, doc.get("photoUrl")]);
                })
            }).then(() => {setPhotoUrlsArr(copyArr)})
        }

        getData();
        getType();
        getName();
    }, []);

    const [image, setImage] = React.useState<File | null>(null);
    const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };
    const handleForm = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        if (image) {
            await addPhoto(image, props.currentUserId)
        } else {
            alert("Выберите фото")
        }
        handleClose();
    }

    // @ts-ignore
    let photos = [];
    const [p, setP] = React.useState(null);

    const storage = getStorage(firebase_app);

    const [images, setImages] = React.useState<string[]>([]);
    //const [imagesArr, setImagesArr] = React.useState<string[]>([]);
    let imagesArr: string[] = [];
    useEffect(() => {
        async function getImages(reference: StorageReference) {
            await getDownloadURL(reference).then((url) => {
                imagesArr.push(url);
            });
            return imagesArr;
        }

        if (photoUrlsArr.length > 0) {
            imagesArr = [];
            photoUrlsArr.map((url) => {
                const reference = ref(storage, url);
                getImages(reference).then((i) => {
                    if (photoUrlsArr.length == i.length) {
                        setImages(i)
                    }
                });
            })
        }
    }, [photoUrlsArr]);

    useEffect(() => {
        photos = [];
        if (images.length > 0) {
            images.map((photoUrl) => {
                photos.push(
                    <Grid item xs={12} sm={6} md={4}>
                        <Avatar
                            src={photoUrl}
                            sx={{height: '220px', width: '220px', padding: '10px'}}
                            variant="rounded"
                            onClick={() => handleClickOpenImage(photoUrl)}>
                        </Avatar>
                    </Grid>
                );
                // @ts-ignore
                setP(photos);
            })
        }
    }, [images]);

    const [openImage, setOpenImage] = React.useState(false);
    const [imageOpened, setImageOpened] = React.useState("");
    const handleClickOpenImage = (image: string) => {
        setImageOpened(imageOpened);
        setOpenImage(true);
    };
    const handleCloseImage = () => {
        setOpenImage(false);
    };

    return (
        <Paper sx={{ maxWidth: 800, margin: "10px auto", padding: "0 0 10px 0", bgcolor: blue[200] }}>
            <Box sx={{ flexDirection: 'row', bgcolor: blue[300], display: 'flex', justifyContent: 'space-between', padding: "10px", margin: "0 0 10px 0", borderRadius: 1}}>
                <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                    <CalendarTodayIcon sx={{margin: "5px 10px 0 0"}} color={"primary"}/>
                    <Typography display="inline" variant="h6">Фотографии&nbsp;</Typography>
                    <Typography data-testid="user-type" display="inline" variant="h6">{rusType}&nbsp;</Typography>
                    <Link style={{ textDecoration: 'none' }} href={`/profile/${props.id}`}>
                        <Typography data-testid="photos-name" display="inline" variant="h6">{name}</Typography>
                    </Link>
                </Box>
                <div>
                    {
                        own ? (
                            <Button onClick={handleClickOpen} variant="contained">
                                <AddIcon />
                                <Typography variant="button">фото</Typography>
                            </Button>) : (
                            <div>
                            </div>
                        )
                    }
                </div>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Новое фото</DialogTitle>
                <form onSubmit={handleForm}>
                    <DialogContent>
                        {
                            image ? (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={image.name}
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
                        <Button onClick={handleClose}>Отмена</Button>
                        <Button type={"submit"}>Добавить</Button>
                    </DialogActions>
                </form>
            </Dialog>

                <Grid container spacing={1} >
                    {p}
                </Grid>

                <Dialog
                    open={openImage}
                    onClose={handleCloseImage}
                    sx={{
                        "& .MuiDialog-container": {
                            "& .MuiPaper-root": {
                                width: "100%",
                                maxWidth: "80vw",
                            },
                        },
                    }}
                >
                    <DialogContent sx={{justifyContent: "center"}}>
                        <img
                            src={imageOpened}
                            loading="lazy"
                            style={{borderRadius:'10px', maxWidth: "70vw", margin: "0 auto"}}
                        />
                    </DialogContent>
                </Dialog>

        </Paper>
    );
}
