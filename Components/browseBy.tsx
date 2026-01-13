export default function BrowseBy() {
  return (
    <div className="bg-black/30 backdrop-blur-sm h-100 w-100 fixed  mt-3 rounded-md border-white/20 border p-5">
      <label className="font-semibold text-lg text-white">Browse By</label>
      <div className="grid grid-cols-3 gap-3 justify-center items-center mt-5">
        <div className="hover:border-[#353945] bg-linear-to-br from-[#171717] to-[#0A0A0C] border border-[#252833] rounded-md h-24 flex items-center justify-center text-white flex-col">
          <i className="mb-2 bi bi-grid-1x2"></i>
          <label className="text-center">Category</label>
        </div>
        <div className="hover:border-[#353945] bg-linear-to-br from-[#171717] to-[#0A0A0C] border border-[#252833] rounded-md h-24 flex items-center justify-center text-white flex-col">
          <i className="mb-2 fa-solid fa-masks-theater"></i>
          <label className="text-center">Genre</label>
        </div>
        <div className="hover:border-[#353945] bg-linear-to-br from-[#171717] to-[#0A0A0C] border border-[#252833] rounded-md h-24 flex items-center justify-center text-white flex-col">
          <i className="mb-2 bi bi-globe"></i>
          <label className="text-center">Country</label>
        </div>
        <div className="hover:border-[#353945] bg-linear-to-br from-[#171717] to-[#0A0A0C] border border-[#252833] rounded-md h-24 flex items-center justify-center text-white flex-col">
          <i className="mb-2 bi bi-translate"></i>
          <label className="text-center">Language</label>
        </div>
        <div className="hover:border-[#353945] bg-linear-to-br from-[#171717] to-[#0A0A0C] border border-[#252833] rounded-md h-24 flex items-center justify-center text-white flex-col">
          <i className="mb-2 fa-solid fa-users-line"></i>
          <label className="text-center">Family Friendly</label>
        </div>
        <div className="hover:border-[#353945] bg-linear-to-br from-[#171717] to-[#0A0A0C] border border-[#252833] rounded-md h-24 flex items-center justify-center text-white flex-col">
          <i className="mb-2 fa-solid fa-trophy"></i>
          <label className="text-center">Award Winners</label>
        </div>
        <div className="hover:border-[#353945] bg-linear-to-br from-[#171717] to-[#0A0A0C] border border-[#252833] rounded-md h-24 flex items-center justify-center text-white flex-col">
          <i className="mb-2 bi bi-award"></i>
          <label className="text-center">Moctale Select</label>
        </div>
        <div className="hover:border-[#353945] bg-linear-to-br from-[#171717] to-[#0A0A0C] border border-[#252833] rounded-md h-24 flex items-center justify-center text-white flex-col">
          <i className="mb-2 fa-solid fa-user-ninja"></i>
          <label className="text-center">Anime</label>
        </div>
        <div className="hover:border-[#353945] bg-linear-to-br from-[#171717] to-[#0A0A0C] border border-[#252833] rounded-md h-24 flex items-center justify-center text-white flex-col">
          <i className="mb-2 bi bi-camera-reels"></i>
          <label className="text-center">Franchise</label>
        </div>
      </div>
    </div>
  );
}
