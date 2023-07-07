import Header from "@/components/layouts/Header"
import Main from "@/components/layouts/Main"

export default function Home() {


  return (
    <main className="flex bg-[#E6E9F3] min-w-[320px] min-h-[370px] flex-col items-center justify-between px-4 py-4">
      {/* header */}
      <Header />
      {/* body */}
      <Main />
    </main>
  )
}
