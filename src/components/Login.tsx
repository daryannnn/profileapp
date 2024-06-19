import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    MenuList,
    OutlinedInput,
    TextField,
    Typography
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import React from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import signIn from "@/firebase/auth/signIn";

export default function Login() {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const router = useRouter();

    const handleForm = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        const { result, error } = await signIn(email, password);
        if (error) {
            return console.log(error)
        }
        // else successful
        console.log(result)
        return router.push("/")
    }

    return (
        <>
            <Box sx={{display: "flex", justifyContent: "end"}}>
                <MenuList sx={{maxWidth: "300px", margin: "30px"}}>
                    <MenuItem selected>Вход</MenuItem>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/registration"}>
                        <MenuItem >Регистрация</MenuItem>
                    </Link>
                </MenuList>
            </Box>
            <Box sx={{
                maxWidth: "40vw",
                margin: "auto",
                padding: "20px",
                alignItems: "center",
            }}>
                <Typography variant={"h5"} color={"text.primary"}>Войти</Typography>
                <form onSubmit={handleForm}>
                    <TextField
                        data-testid="email-field"
                        type={"email"}
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin={"normal"}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FormControl variant="outlined" fullWidth sx={{margin: "15px auto"}}>
                        <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
                        <OutlinedInput
                            data-testid="password-field"
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            onChange={(e) => setPassword(e.target.value)}
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
                            label="Пароль"
                        />
                    </FormControl>
                    <Button sx={{bgcolor: "#2E7D32"}} data-testid="login-button" type={"submit"} fullWidth variant="contained">войти</Button>
                </form>
            </Box>
        </>
    )
}