import HeroBanner from "../components/LotList/HeroBanner";
import LotList from "../components/LotList/LotList";


export default function LotesPage() {
  return (
    <>
      <HeroBanner />
      <div style={{ padding: "2rem" }}>
        <LotList />
      </div>
    </>
  );
}
