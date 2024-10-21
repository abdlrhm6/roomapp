
import Hero from "./components/Hero";
import Services from "./components/Services";


export const metadata = {
  title: "Roomat",
  description: "Roomat",
};

export default function Home() {
  return (
    <div className="">
      
      <Hero/>
      <Services/>
    </div>
  );
}
