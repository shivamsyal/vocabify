import SideNavbar from "@/components/SideNavbar";
import Upload from "@/components/UploadForm";
import Image from "next/image";
import Flashcards from "@/components/FlashCards";
export default function Home() {
  return (
    <div className= "grid-cols-2">
      <SideNavbar/>
      {/* <Upload/>  */}
      <Flashcards/>
    </div>
  );
}

