import Image from "next/image";

export default function Home() {
  return (
    <main>
      <h1 className="text-4xl text-wrap">
        Welcome to 
        {" "}
        <span className="text-red-400 font-bold hover:animate-ping hover:cursor-pointer">
          Ghost
        </span>
        {" "}
        <span className="text-blue-400 font-bold hover:animate-ping hover:cursor-pointer">
          Messenger
        </span>
      </h1>
    </main>
  );
}
