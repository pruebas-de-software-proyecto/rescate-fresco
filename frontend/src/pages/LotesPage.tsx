import React from "react";
import LotList from "../components/LotList/LotList";
import NavBar from "../components/NavBar";
import HeroBanner from "../components/LotList/HeroBanner";

 
export default function LotesPage() {
  return (
    <>
      <NavBar />
      <HeroBanner />
      <div style={{ padding: "2rem" }}>
        <LotList />
      </div>
    </>
  );
}
