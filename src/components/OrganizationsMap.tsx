import {YMaps, Map as MMap, Placemark} from "@pbe/react-yandex-maps";
import getCoordinates from "@/firebase/getCoordinates";
import React, {useEffect} from "react";
import {
    Autocomplete,
    Box, Button, Dialog,
    FormControl, FormControlLabel, InputAdornment,
    InputLabel,
    MenuItem,
    MenuList,
    OutlinedInput,
    Select, SelectChangeEvent, Switch, TextField, ThemeProvider,
    Typography
} from "@mui/material";
import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";
import {theme} from "@/utils/theme";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

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

const cities = [
    { label: 'Москва'},
    { label: 'Санкт-Петербург'},
    { label: 'Новосибирск'},
]


const API_KEY = "591f4c84-c98b-4836-ae26-8f2297c7b425";

export default function OrganizationsMap(){

    interests.sort((a, b) => a.rus.localeCompare(b.rus))

    const [interestsMap, setInterestsMap] = React.useState<Map<string, boolean>>(new Map());
    const [interest, setInterest] = React.useState<string[]>([]);
    useEffect(() => {
        if (interestsMap && interest.length == 0) {
            interestsMap.forEach((mapValue, key) => {
                if (mapValue) {
                    setInterest(old => [...old, key]);
                }
            })
        }
    }, [interestsMap]);
    const handleInterest = (event: SelectChangeEvent<typeof interest>) => {
        const {
            target: { value },
        } = event;
        setInterest(
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

    const [name, setName] = React.useState("");
    const [checked, setChecked] = React.useState(false);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };
    const [checkedEvents, setCheckedEvents] = React.useState(false);
    const handleChangeEvents = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedEvents(event.target.checked);
    };

    //const [coords, setCoords] = React.useState<number[][]>();
    const [coords, setCoords] = React.useState<Map<string, number[]>>(new Map());
    useEffect(() => {
        async function getCoords() {
            const coords = await getCoordinates();
            setCoords(coords);
        }
        getCoords().then(() => {
            console.log(coords)
        });
    }, []);

    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState("");
    const handleClickOpen = (coord: any) => {
        setOpen(true);
        setUser(coord);
    };

    const handleClose = () => {
        setOpen(false);
        //setEvent("")
    };

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{display: "flex", justifyContent: "space-between"}}>

            <Box sx={{padding: "10px", margin: "30px 0px", width: "15vw", minWidth: "160px"}}>
                <Typography color={"text.secondary"}>Выберите специализацию</Typography>
                <FormControl fullWidth sx={{margin: "10px auto 15px auto"}}>
                    <InputLabel id="interests">Специализации</InputLabel>
                    <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        multiple
                        value={interest}
                        onChange={handleInterest}
                        input={<OutlinedInput label="Интересы" />}
                    >
                        {interests.map(({rus, value}, index) => (
                            <MenuItem
                                key={index}
                                value={value}
                            >
                                {rus}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Typography color={"text.secondary"}>Выберите город</Typography>
                <Autocomplete
                    disabled
                    disablePortal
                    id="city-box"
                    options={cities}
                    sx={{ margin: "10px auto 15px auto" }}
                    renderInput={(params) => <TextField {...params} label="Город" />}
                />
                <FormControlLabel control={<Switch checked={checked}
                                                   onChange={handleChange}
                                                   inputProps={{ 'aria-label': 'controlled' }}/>}
                                  label="Оказывает услуги" />
                <FormControlLabel control={<Switch checked={checkedEvents}
                                                   onChange={handleChangeEvents}
                                                   inputProps={{ 'aria-label': 'controlled' }}/>}
                                  label="Проводит мероприятия" />
            </Box>

            <Box>
                <Box sx={{
                    margin: "30px 10px 20px 10px",
                    width: "50vw",
                }}>
                    <TextField
                        onChange={(newValue) => setName(newValue.target.value)}
                        id="input-with-icon-textfield"
                        placeholder="Поиск..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchOutlinedIcon />
                                </InputAdornment>
                            ),
                        }}
                        variant="outlined"
                        sx={{
                            width: "40vw"
                        }}
                    />

                    <Button variant="contained" type={"submit"} sx={{margin: "10px"}}>
                        <SearchOutlinedIcon />
                    </Button>
                </Box>

                <Box sx={{margin: "30px 0 0 0"}}>
                    <YMaps
                        query={{
                            apikey: API_KEY,
                            lang: "ru_RU",
                            load: "package.full",
                        }}
                    >
                        <MMap
                            defaultState={{ center: [55.030202, 82.920429], zoom: 11 }}
                            width={"60vw"}
                            height={"70vh"}
                        >
                            {
                                [...coords].map((coords) => {
                                    return (
                                        <Placemark
                                            key={coords[0]}
                                            geometry={coords[1]}
                                            onClick={() => {
                                                handleClickOpen(coords[0])
                                            }}
                                        />
                                    )
                                })
                                /*coords?.map((coords, index) => {
                                    return (
                                        <Placemark
                                            key={index}
                                            geometry={coords}
                                        />
                                    )
                                })*/
                            }
                        </MMap>
                    </YMaps>
                </Box>
            </Box>

            <Box sx={{display: "flex", justifyContent: "end"}}>
                <MenuList sx={{margin: "30px", width: "15vw"}}>
                    <MenuItem selected>Организации</MenuItem>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/map/events"}>
                        <MenuItem>Мероприятия</MenuItem>
                    </Link>
                </MenuList>
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                //fullWidth={true}
                maxWidth='md'
            >

                    <ProfileCard userId={user} />

            </Dialog>

        </Box>
        </ThemeProvider>
    )
}