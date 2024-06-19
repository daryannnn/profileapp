import {Box} from "@mui/material";
import OrganizationsMap from "@/components/OrganizationsMap";

export default function MapOrganizations() {
    return (
        <Box sx={{justifyContent: "center", margin: "0 auto"}}>
            <Box sx={{ flexGrow: 1 }} />
            <OrganizationsMap />
            <Box sx={{ flexGrow: 1 }} />
        </Box>
    )
}