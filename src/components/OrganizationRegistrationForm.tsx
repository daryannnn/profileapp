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
    TextField
} from "@mui/material";
import React, {useEffect} from "react";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useRouter} from "next/router";
import signUp from "@/firebase/auth/signUp";
import {addOrganization} from "@/firebase/addOrganization";
import {YMaps} from "@pbe/react-yandex-maps";
import {GeoPoint} from "firebase/firestore";

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

export default function OrganizationRegistrationForm() {
    specializations.sort((a, b) => a.rus.localeCompare(b.rus))

    const [specialization, setSpec] = React.useState<string[]>([]);

    const [interestsMap, setInterestsMap] = React.useState<Map<string, boolean>>(new Map([
        [ 'Running', false ],
        [ 'Aerobics', false ],
        [ 'Gym', false ],
        [ 'Tennis', false ],
        [ 'Martial arts', false ],
        [ 'Walking', false ],
        [ 'Cycling', false ],
        [ 'Dancing', false ],
        [ 'Fitness', false ],
        [ 'Swimming', false ],
        [ 'Yoga', false ],
        [ 'Body-building', false ],
        [ 'Soccer', false ],
        [ 'Hockey', false ],
        [ 'Volleyball', false ],
        [ 'Basketball', false ],
        [ 'Athletics', false ],
        [ 'Weightlifting', false ],
        [ 'Skiing', false ],
        [ 'Box', false ],
        [ 'Figure skating', false ],
        [ 'Gymnastics', false ],
        [ 'Chess', false ],
        [ 'Table tennis', false ],
    ]));

    const handleSpec = (event: SelectChangeEvent<typeof specialization>) => {
        const {
            target: { value },
        } = event;
        setSpec(
            typeof value === 'string' ? value.split(',') : value,
        );
        const newMap = new Map<string, boolean>();
        interestsMap.forEach((mapValue, key) => {
            newMap.set(key, false)
            if (value.includes(key)) {
                newMap.set(key, true);
            }
        })
        setInterestsMap(newMap);
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

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [nickname, setNickname] = React.useState('');
    const [description, setDescription] = React.useState('');

    const router = useRouter();

    let userId = null;

    const [value, setValue] = React.useState("");
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
        const { result, error } = await signUp(email, password, name);
        if (error) {
            return console.log(error)
        }

        userId = result!.user.uid;

        await addOrganization(userId, name, nickname, description, Object.fromEntries(interestsMap), new GeoPoint(newCoords[0], newCoords[1]), value);

        // else successful
        console.log(result)
        return router.push("/")
    }

    return (
        <YMaps
            query={{
                apikey: API_KEY,
                lang: "ru_RU",
                load: "package.full",
            }}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{maxWidth: "60vw", margin: "0px auto"}}>
                    <form onSubmit={handleForm}>
                        <TextField
                            label="Название"
                            inputProps={{ "data-testid": "name" }}
                            variant="outlined"
                            fullWidth
                            required
                            margin={"normal"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            label="Никнейм"
                            inputProps={{ "data-testid": "nickname" }}
                            variant="outlined"
                            fullWidth
                            required
                            margin={"normal"}
                            onChange={(e) => setNickname(e.target.value)}
                        />

                        <Autocomplete
                            sx={{margin: "15px auto 10px auto"}}
                            freeSolo
                            filterOptions={(x) => x}
                            value={value}
                            data-testid="coords"
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
                                    console.log(coords);
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
                            renderInput={(params) => (
                                <TextField {...params} label="Адрес" />
                            )}
                        />

                        <TextField
                            label="Описание"
                            inputProps={{ "data-testid": "description" }}
                            variant="outlined"
                            fullWidth
                            margin={"normal"}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            multiline
                        />
                        <FormControl fullWidth sx={{margin: "15px auto"}}>
                            <InputLabel id="demo-multiple-name-label">Специализация</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple
                                data-testid="spec"
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
                        <TextField
                            type={"email"}
                            inputProps={{ "data-testid": "email" }}
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin={"normal"}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FormControl variant="outlined" fullWidth sx={{margin: "15px auto"}}>
                            <InputLabel htmlFor="outlined-adornment-password">Пароль *</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPasswordNew ? 'text' : 'password'}
                                required
                                onChange={(e) => setPassword(e.target.value)}
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
                                label="Пароль *"
                                inputProps={{ "data-testid": "password" }}
                            />
                        </FormControl>

                        {
                            (name && nickname && newCoords && description && specialization && email && password) ? (
                                <Button sx={{bgcolor: "#2E7D32"}} data-testid="enabled-button" type={"submit"} fullWidth variant="contained">зарегистрироваться</Button>
                            ) : (
                                <Button sx={{bgcolor: "#2E7D32"}} data-testid="disabled-button" disabled={true} type={"submit"} fullWidth variant="contained">зарегистрироваться</Button>
                            )
                        }

                    </form>
                </Box>
            </LocalizationProvider>
        </YMaps>
    )
}