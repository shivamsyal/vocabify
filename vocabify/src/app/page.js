import SideNavbar from "@/components/SideNavbar";
import Upload from "@/components/UploadForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className= "grid-cols-2">
      <SideNavbar/>
      <Upload/>
    </div>
  );
}

