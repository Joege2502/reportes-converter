"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface HistoryItem {
  name: string;
  date: string;
}

interface UserData {
  user: string;
  role: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si no hay token, lo mandamos al login (Protección de ruta)
    if (!token) {
      router.push("/login");
      return;
    }

    // Extraer datos del usuario desde el JWT (Decodificación simple)
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      setUserData(JSON.parse(jsonPayload));
    } catch (e) {
      console.error("Error decodificando el token");
      handleLogout();
    }

    const savedHistory = localStorage.getItem("conversion_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(`${API_URL}/convert`, formData, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );
          setUploadProgress(percentCompleted);
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Limpio_${file.name.replace(".xls", ".xlsx")}`,
      );
      document.body.appendChild(link);
      link.click();

      const newHistory = [
        { name: file.name, date: new Date().toLocaleString() },
        ...history,
      ].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem("conversion_history", JSON.stringify(newHistory));
    } catch (error) {
      alert("Sesión expirada o servidor inactivo.");
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-200 py-16 px-4 font-sans relative">
      {/* Header de Usuario (Top Right) */}
      {userData && (
        <div className="absolute top-6 right-8 flex items-center gap-4 bg-[#141414] border border-gray-800 p-3 rounded-2xl shadow-lg">
          <div className="text-right">
            <p className="text-sm font-bold text-white">{userData.user}</p>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">
              {userData.role}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-black font-black">
            {userData.user[0]}
          </div>
        </div>
      )}

      {/* Botón de Cerrar Sesión (Bottom Left) */}
      <button
        onClick={handleLogout}
        className="fixed bottom-8 left-8 flex items-center gap-2 text-gray-500 hover:text-red-400 transition-colors font-bold text-sm uppercase tracking-widest"
      >
        <span className="text-lg">↩</span> Cerrar Sesión
      </button>

      <div className="max-w-xl mx-auto space-y-8">
        <div className="bg-[#141414] border border-gray-800 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>

          <header className="text-center mb-10">
            <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3">
              Smart Report Fixer
            </h1>
            <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">
              Legacy Data Normalizer • v1.0
            </p>
          </header>

          <div className="space-y-6">
            <div className="group relative border-2 border-dashed border-gray-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all bg-[#0f0f0f]">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="text-center">
                <p className="text-gray-400 font-medium">
                  {file ? file.name : "Arrastra tu archivo XLS o haz clic aquí"}
                </p>
                <span className="text-xs text-gray-600 mt-2 block italic">
                  Formatos soportados: .xls (HTML Wrapped)
                </span>
              </div>
            </div>

            {loading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-emerald-400 font-mono">
                  <span>PROCESANDO_DATOS</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`w-full py-4 rounded-2xl font-black tracking-widest uppercase text-sm transition-all shadow-lg ${
                loading
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-500/20"
              }`}
            >
              {loading ? "Ejecutando ETL..." : "Iniciar Conversión"}
            </button>
          </div>
        </div>

        {history.length > 0 && (
          <div className="bg-[#141414] border border-gray-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6 text-emerald-500/80">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <h2 className="text-xs font-bold uppercase tracking-widest">
                Historial de Conversiones
              </h2>
            </div>
            <div className="space-y-3">
              {history.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-xs font-mono bg-[#0f0f0f] border border-gray-800/50 p-4 rounded-xl hover:border-emerald-500/30 transition-colors"
                >
                  <span className="text-gray-300 truncate max-w-[200px]">
                    {item.name}
                  </span>
                  <span className="text-gray-600">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
