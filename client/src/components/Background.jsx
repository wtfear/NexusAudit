export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-mesh">
      <div className="absolute -top-32 -left-32 h-[34rem] w-[34rem] rounded-full bg-red-700/25 blur-[130px]" />
      <div className="absolute top-1/4 -right-40 h-[30rem] w-[30rem] rounded-full bg-red-900/35 blur-[130px]" />
      <div className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-black/70 blur-[110px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[20rem] w-[20rem] rounded-full bg-red-600/15 blur-[110px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/30 to-bg" />
    </div>
  );
}
