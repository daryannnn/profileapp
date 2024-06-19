import {Box, FormControl, InputLabel, MenuItem, MenuList, Select, SelectChangeEvent, Typography} from "@mui/material";
import Link from "next/link";
import React from "react";
import SportsmanRegistrationForm from "@/components/SportsmanRegistrationForm";
import OrganizationRegistrationForm from "@/components/OrganizationRegistrationForm";

export default function Registration() {
    const [type, setType] = React.useState('sportsman');
    const handleType = (event: SelectChangeEvent) => {
        setType(event.target.value as string);
    };

    return (
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <Box sx = {{
                    maxWidth: "40vw",
                    margin: "auto auto auto 30vw",
                    padding: "20px 0 0 0",
                    alignItems: "center",
            }}>
                <Typography variant={"h5"} color={"text.primary"}>Регистрация</Typography>
                <FormControl fullWidth sx={{margin: "20px auto"}}>
                    <InputLabel id="typeOfProfile-label">Тип профиля</InputLabel>
                    <Select
                        value={type}
                        label="Тип профиля"
                        labelId="typeOfProfile-label"
                        onChange={handleType}
                        id="typeOfProfile"
                    >
                        <MenuItem value={"sportsman"}>Спортсмен</MenuItem>
                        <MenuItem value={"organization"}>Организация</MenuItem>
                    </Select>
                    <div>
                        {
                            (type == "sportsman") ? (
                                <SportsmanRegistrationForm />
                            ) : (
                                <OrganizationRegistrationForm />
                            )
                        }
                    </div>
                </FormControl>
            </Box>
            <Box sx={{display: "flex", justifyContent: "end"}}>
                <MenuList sx={{maxWidth: "300px", margin: "30px"}}>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/login"}>
                        <MenuItem>Вход</MenuItem>
                    </Link>
                    <MenuItem selected>Регистрация</MenuItem>
                </MenuList>
            </Box>
        </Box>
    )
}