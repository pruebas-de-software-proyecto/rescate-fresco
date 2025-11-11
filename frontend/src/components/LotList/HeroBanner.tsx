import { Box, Typography } from "@mui/material";

export default function HeroBanner() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "50vh",
        background: "linear-gradient(180deg, #2e7d32 0%, #66bb6a 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 1, textShadow: "0 2px 6px rgba(0,0,0,0.3)" }}
      >
        Reduce el desperdicio de alimentos a un precio
      </Typography>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", textShadow: "0 2px 6px rgba(0,0,0,0.3)" }}
      >
        más conveniente
      </Typography>

      <img
        src="/frutas.png"
        alt="Frutas felices"
        style={{ width: "100%" }} />
    </Box>
  );
}
