import {blue} from "@mui/material/colors";
import {Button, Typography} from "@mui/material";
import React from "react";

interface Props {
    text: string;
    icon:  any,
}

export default function ButtonD(props: Props) {
    return (
        <Button data-testid="photos-button" variant={"contained"} sx={{bgcolor: "primary.light", textTransform: "none", height: "70px"}}>
            <div>{ props.icon }</div>
            <Typography sx={{ margin: "10px 10px" }} variant={"h6"} color={"black"}>{props.text}</Typography>
            <div>{ props.icon }</div>
        </Button>
    )
}