"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function FormTambahSoal({ onTambahSoal }) {
  const [tipeSoal, setTipeSoal] = useState("pg");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      mapel: "",
      pertanyaan: "",
      opsiA: "",
      opsiB: "",
      opsiC: "",
      opsiD: "",
      kunciJawaban: "A",
    },
  });

  const onSubmit = (data) => {
    const payload = {
      id: Date.now(),
      mapel: data.mapel,
      pertanyaan: data.pertanyaan,
      tipe: tipeSoal === "pg" ? "Pilihan Ganda" : "Essay",
      opsi: tipeSoal === "pg" ? [data.opsiA, data.opsiB, data.opsiC, data.opsiD] : [],
      kunci: tipeSoal === "pg" ? data.kunciJawaban : null,
    };

    if (onTambahSoal) onTambahSoal(payload);
    reset();
  };

  return (
    <div className="bg-surface border border-line rounded-2xl p-6 font-jakarta">
      <h2 className="text-lg font-bold text-primary mb-4">Buat Soal Baru</h2>

      {/* Switcher Tipe Soal */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
          Tipe Soal
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-base border border-line rounded-xl">
          <button
            type="button"
            onClick={() => setTipeSoal("pg")}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              tipeSoal === "pg"
                ? "bg-brand text-base font-bold shadow-md"
                : "text-secondary hover:text-primary"
            }`}
          >
            Pilihan Ganda
          </button>
          <button
            type="button"
            onClick={() => setTipeSoal("essay")}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              tipeSoal === "essay"
                ? "bg-brand text-base font-bold shadow-md"
                : "text-secondary hover:text-primary"
            }`}
          >
            Essay / Isian
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
            Mata Pelajaran
          </label>
          <input
            type="text"
            placeholder="Contoh: Pemrograman Web"
            {...register("mapel", { required: "Mapel wajib diisi" })}
            className="w-full rounded-xl border border-line bg-base p-3 text-sm text-primary placeholder:text-muted focus:border-brand focus:outline-none"
          />
          {errors.mapel && (
            <p className="text-xs text-av-red mt-1">{errors.mapel.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
            Pertanyaan / Soal
          </label>
          <textarea
            rows={3}
            placeholder="Tuliskan pertanyaan di sini..."
            {...register("pertanyaan", { required: "Pertanyaan wajib diisi" })}
            className="w-full rounded-xl border border-line bg-base p-3 text-sm text-primary placeholder:text-muted focus:border-brand focus:outline-none resize-none"
          />
          {errors.pertanyaan && (
            <p className="text-xs text-av-red mt-1">
              {errors.pertanyaan.message}
            </p>
          )}
        </div>

        {tipeSoal === "pg" && (
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider">
              Opsi Jawaban
            </label>
            {["A", "B", "C", "D"].map((opsi) => (
              <input
                key={opsi}
                type="text"
                placeholder={`Opsi ${opsi}`}
                {...register(`opsi${opsi}`, {
                  required: `Opsi ${opsi} wajib diisi`,
                })}
                className="w-full rounded-xl border border-line bg-base p-2.5 text-xs text-primary placeholder:text-muted focus:border-brand focus:outline-none"
              />
            ))}

            <div className="pt-2">
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                Kunci Jawaban
              </label>
              <select
                {...register("kunciJawaban")}
                className="w-full rounded-xl border border-line bg-base p-3 text-xs text-primary focus:border-brand focus:outline-none"
              >
                <option value="A">Opsi A</option>
                <option value="B">Opsi B</option>
                <option value="C">Opsi C</option>
                <option value="D">Opsi D</option>
              </select>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-brand py-3.5 font-semibold text-sm text-base hover:bg-brand-hover transition-all shadow-lg mt-4"
        >
          Simpan Soal
        </button>
      </form>

      {/*Link untuk mengarah ke halaman kelola-soal page.jsx*/}
      <Link
          href="/dashboard/guru/kelola-soal"
          className="text-xs mt-4 font-semibold w-fit font-jakarta text-brand hover:underline flex items-center gap-1 bg-brand-soft border border-brand-ring px-3 py-1.5 rounded-lg transition-colors"
        >
          Lihat Semua Soal &rarr;
        </Link>
        {/*Link end*/}

    </div>
  );
}