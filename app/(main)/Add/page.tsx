"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    title: "",
    type: "movie",
    releaseDate: "",
    director: "",
    cast: "",
    genre: "",
    country: "",
    languages: "",
    production: "",
    streaming_platforms: [] as string[],
    tags: "",
    description: "",
    current_status: "",
    poster_url: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);

    const res = await fetch("/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      return;
    }

    alert("Upload Successfull");
    console.log(data.success);
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-zinc-900 rounded-2xl shadow-xl p-10 border border-zinc-800 text-zinc-100">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">
          Add Movie / Series
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ---------------------- Basic Info ---------------------- */}
          <section className="space-y-5">
            <h2 className="text-xl font-semibold text-blue-300">Basic Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="movie">Movie</option>
                  <option value="series">Series</option>
                </select>
              </div>

              {/* Release Date */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Release Date
                </label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Director */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Director
                </label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Cast */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Cast (comma-separated)
                </label>
                <input
                  type="text"
                  name="cast"
                  value={formData.cast}
                  onChange={handleChange}
                  placeholder="Actor 1, Actor 2"
                  className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Genre */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Genre
                </label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="Drama, Action"
                  className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          </section>

          {/* ---------------------- Production Info ---------------------- */}
          <section className="space-y-5">
            <h2 className="text-xl font-semibold text-blue-300">
              Production Info
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="USA, UK"
                  className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  placeholder="English, Spanish"
                  className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Production / Studios */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Production / Studios
                </label>
                <input
                  type="text"
                  name="production"
                  value={formData.production}
                  onChange={handleChange}
                  placeholder="Netflix, Warner Bros"
                  className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Streaming Platforms (multi-select) */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Streaming Platforms
                </label>
                <select
                  name="streaming_platforms"
                  multiple
                  value={formData.streaming_platforms}
                  onChange={(e) => {
                    const selected = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    setFormData((prev) => ({
                      ...prev,
                      streaming_platforms: selected,
                    }));
                  }}
                  className="w-full h-28 rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800"
                >
                  <option value="Netflix">Netflix</option>
                  <option value="Amazon Prime Video">Amazon Prime Video</option>
                  <option value="Disney+">Disney+</option>
                  <option value="HBO Max">HBO Max</option>
                  <option value="Hulu">Hulu</option>
                  <option value="Apple TV+">Apple TV+</option>
                  <option value="Other">Other</option>
                </select>
                <p className="text-xs text-zinc-400 mt-1">
                  Hold Ctrl (Windows) or Cmd (Mac) to select multiple
                </p>
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Tags / Type (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Thriller, Based on true story"
                  className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Current Status */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Current Status
                </label>
                <select
                  name="current_status"
                  value={formData.current_status}
                  onChange={handleChange}
                  className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Select status</option>
                  <option value="Released">Released</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Filming">Filming</option>
                  <option value="Post-production">Post-production</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Poster Image Upload */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Poster Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    // convert to base64
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                      const base64 = (reader.result as string).split(",")[1];

                      const formData = new FormData();
                      formData.append("image", base64);

                      // Replace YOUR_API_KEY with your ImgBB API key
                      const res = await fetch(
                        `https://api.imgbb.com/1/upload?key=712e9653c1453f9d5da0b5893fe3ec25`,
                        {
                          method: "POST",
                          body: formData,
                        }
                      );
                      const data = await res.json();
                      console.log(data);

                      if (data.success) {
                        setFormData((prev) => ({
                          ...prev,
                          poster_url: data.data.url,
                        }));
                        alert("Image uploaded successfully!");
                      } else {
                        alert("Image upload failed!");
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* ---------------------- Description ---------------------- */}
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-blue-300">Description</h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Write a brief synopsis..."
              className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </section>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition text-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
