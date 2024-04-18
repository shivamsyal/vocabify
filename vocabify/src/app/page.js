'use client';
import SideNavbar from "@/components/SideNavbar";
import Upload from "@/components/UploadForm";
import Image from "next/image";
import Flashcards from "@/components/FlashCards";
import { useState } from 'react';
export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState('Upload');
  return (
    <div className="grid-cols-2">
      <SideNavbar onComponentChange={setSelectedComponent} />  
      {selectedComponent === 'Flashcards' && <Flashcards/>} 
      {selectedComponent === 'Upload' && <Upload/>} 
    </div>
  );
}

