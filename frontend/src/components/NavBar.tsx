import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EmojiNatureOutlinedIcon from "@mui/icons-material/EmojiNatureOutlined";

export default function NavBar() {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#2E7D32", // verde oscuro
        boxShadow: "none",
        width: "100%",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo e Identidad */}
        <Box display="flex" alignItems="center" gap={1}>
          <EmojiNatureOutlinedIcon sx={{ color: "#FFF9C4" }} />
          <Typography
            variant="h6"
            sx={{ color: "#FFF9C4", fontWeight: 500, letterSpacing: "0.5px" }}
          >
            RescateFresco
          </Typography>
        </Box>

        {/* Navegación */}
        <Box display="flex" alignItems="center" gap={3}>
          <Typography
            variant="body2"
            sx={{ color: "white", cursor: "pointer", "&:hover": { opacity: 0.8 } }}
          >
            Productos
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "white", cursor: "pointer", "&:hover": { opacity: 0.8 } }}
          >
            Contacto
          </Typography>

          {/* Íconos */}
          <IconButton size="small" sx={{ color: "white" }}>
            <ShoppingCartOutlinedIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: "white" }}>
            <AccountCircleOutlinedIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
