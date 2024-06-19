import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import React, {useEffect} from "react";
import {blue} from "@mui/material/colors";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import getUserData from "@/firebase/getUserData";
import {getAuth, signInWithEmailAndPassword} from "@firebase/auth";
import firebase_app from "@/firebase/config";
import {changeSportsman} from "@/firebase/changeSportsman";
import {GeoPoint, Timestamp} from "firebase/firestore";
import {changeOrganization} from "@/firebase/changeOrganization";

const specializations = [
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

const API_KEY = "591f4c84-c98b-4836-ae26-8f2297c7b425";

interface Props {
    id: string,
    currentUserEmail: string,
}

const auth = getAuth(firebase_app);

export default function OrganizationSettingsLayout(props: Props) {
    specializations.sort((a, b) => a.rus.localeCompare(b.rus))

    const [name, setName] = React.useState('');
    const [nickname, setNickname] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [specialization, setSpec] = React.useState<string[]>([]);
    const [interestsMap, setInterestsMap] = React.useState<Map<string, boolean>>(new Map());
    const [value, setValue] = React.useState("");
    useEffect(() => {
        async function getUser() {
            const userGetted = await getUserData(props.id);
            // @ts-ignore
            setName(userGetted.result.name);
            // @ts-ignore
            setDescription(userGetted.result.description);
            // @ts-ignore
            setNickname(userGetted.result.nickname);
            // @ts-ignore
            setEmail(userGetted.result.email);
            // @ts-ignore
            setInterestsMap(new Map(Object.entries(userGetted.result.categories)));
            // @ts-ignore
            setValue(userGetted.result.positionName);
        }
        getUser();
    }, [])

    useEffect(() => {
        if (interestsMap && specialization.length == 0) {
            interestsMap.forEach((mapValue, key) => {
                if (mapValue) {
                    setSpec(old => [...old, key]);
                }
            })
        }
        console.log(interestsMap)
    }, [interestsMap]);

    const handleSpec = (event: SelectChangeEvent<typeof specialization>) => {
        const {
            target: { value },
        } = event;
        setSpec(
            typeof value === 'string' ? value.split(',') : value,
        );
        const newMap = new Map<string, boolean>();
        if (interestsMap) {
            interestsMap.forEach((mapValue, key) => {
                newMap.set(key, false)
                if (value.includes(key)) {
                    newMap.set(key, true);
                }
            })
        }
        setInterestsMap(newMap);
    };

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const [showPasswordNew, setShowPasswordNew] = React.useState(false);
    const handleClickShowPasswordNew = () => setShowPasswordNew((show) => !show);
    const handleMouseDownPasswordNew = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const [showPasswordRep, setShowPasswordRep] = React.useState(false);
    const handleClickShowPasswordRep = () => setShowPasswordRep((show) => !show);
    const handleMouseDownPasswordRep = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const [email, setEmail] = React.useState(props.currentUserEmail);
    /*useEffect(() => {
        // @ts-ignore
        setEmail(currentUser?.email)
    }, [currentUser]);*/

    const [options, setOptions] = React.useState([]);
    const [newCoords, setNewCoords] = React.useState([]);

    useEffect(() => {
        (async () => {
            try {
                if (value) {
                    const res = await fetch(
                        `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&format=json&geocode=${value}`
                    );
                    const data = await res.json();
                    const collection = data.response.GeoObjectCollection.featureMember.map(
                        (item: { GeoObject: any; }) => item.GeoObject
                    );
                    setOptions(() => collection);
                }
            } catch (e) {
                console.log(e);
            }
        })();
    }, [value]);

    const handleForm = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        await changeOrganization(props.id, name, nickname, description, Object.fromEntries(interestsMap!), new GeoPoint(newCoords[0], newCoords[1]), value);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{maxWidth: "60vw", margin: "20px auto", padding: "20px"}}>
                <form onSubmit={handleForm}>
                    <Typography variant={"h5"} color={"text.primary"}>Настройки</Typography>
                    <TextField
                        label="Имя"
                        variant="outlined"
                        fullWidth
                        margin={"normal"}
                        value={name}
                        onChange={(newValue) => setName(newValue.target.value)}
                    />
                    <TextField
                        label="Никнейм"
                        variant="outlined"
                        fullWidth
                        margin={"normal"}
                        value={nickname}
                        onChange={(newValue) => setNickname(newValue.target.value)}
                    />

                    <Autocomplete
                        sx={{margin: "15px auto 10px auto"}}
                        freeSolo
                        filterOptions={(x) => x}
                        value={value}
                        onChange={(event, newValue) => {
                            if (typeof newValue === "string") {
                                setValue(() => newValue);
                                const obg = options.find(
                                    (item: any) =>
                                        newValue.includes(item.name) &&
                                        newValue.includes(item.description)
                                );
                                // @ts-ignore
                                const coords = obg.Point.pos
                                    .split(" ")
                                    .map((item: any) => Number(item))
                                    .reverse();
                                setNewCoords(() => coords);
                            } else {
                                console.log(newValue);
                            }
                        }}
                        onInputChange={(e) => {
                            if (e) {
                                // @ts-ignore
                                setValue(e.target.value);
                            }
                        }}
                        options={options.map((item: any) => `${item.name}, ${item.description}`)}
                        //options={options.map((item: any) => `${item.metaDataProperty.GeocoderMetaData.text}`)}
                        renderInput={(params) => (
                            <TextField {...params} label="Адрес *" />
                        )}
                    />

                    <TextField
                        label="Описание"
                        variant="outlined"
                        fullWidth
                        margin={"normal"}
                        multiline
                        value={description}
                        onChange={(newValue) => setDescription(newValue.target.value)}
                    />
                    <FormControl fullWidth sx={{margin: "15px auto"}}>
                        <InputLabel id="demo-multiple-name-label">Специализация</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            multiple
                            value={specialization}
                            onChange={handleSpec}
                            input={<OutlinedInput label="Специализация" />}
                        >
                            {specializations.map(({rus, value}, index) => (
                                <MenuItem
                                    key={index}
                                    value={value}
                                >
                                    {rus}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/*
                    <TextField
                        type={"email"}
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin={"normal"}
                        disabled
                        value={email}
                        onChange={(newValue) => setEmail(newValue.target.value)}
                    />
                    <FormControl variant="outlined" fullWidth sx={{margin: "15px auto"}}>
                        <InputLabel htmlFor="outlined-adornment-password">Старый пароль</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            disabled
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Старый пароль"
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth sx={{margin: "15px auto"}}>
                        <InputLabel htmlFor="outlined-adornment-password">Новый пароль</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPasswordNew ? 'text' : 'password'}
                            disabled
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPasswordNew}
                                        onMouseDown={handleMouseDownPasswordNew}
                                        edge="end"
                                    >
                                        {showPasswordNew ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Новый пароль"
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth sx={{margin: "15px auto"}}>
                        <InputLabel htmlFor="outlined-adornment-password">Повторите пароль</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPasswordRep ? 'text' : 'password'}
                            disabled
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPasswordRep}
                                        onMouseDown={handleMouseDownPasswordRep}
                                        edge="end"
                                    >
                                        {showPasswordRep ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Повторите пароль"
                        />
                    </FormControl>
                    */}
                    <Button sx={{bgcolor: "#2E7D32"}} fullWidth variant="contained" type={"submit"}>сохранить</Button>
                </form>
            </Box>
        </LocalizationProvider>
    )
}