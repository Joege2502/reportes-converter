"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      router.push("/");
    } catch (err) {
      setError("Credenciales inválidas. Intente de nuevo.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>

      <div className="max-w-md w-full bg-[#141414] border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-600/10 rounded-full blur-[80px]"></div>

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-[#0f0f0f] border border-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
          </div>

          <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Panel de Acceso
          </h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-10">
            Smart Report Fixer • Security
          </p>

          <form onSubmit={handleLogin} className="space-y-5 text-left">
            <div>
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1 mb-2 block">
                Identificador
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0f0f0f] border border-gray-800 rounded-2xl py-4 px-5 text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-gray-700"
                placeholder="Ej. Administrador"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1 mb-2 block">
                Llave de Seguridad
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0f0f0f] border border-gray-800 rounded-2xl py-4 px-5 text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-gray-700"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-xl">
                <p className="text-red-500 text-[11px] font-bold text-center italic">
                  {error}
                </p>
              </div>
            )}

            {/* Barra de carga animada */}
            {isSubmitting && (
              <div className="w-full bg-gray-900 rounded-full h-1 overflow-hidden">
                <div className="bg-emerald-500 h-full animate-[loading_1.5s_infinite] w-1/2 shadow-[0_0_8px_#10b981]"></div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl ${
                isSubmitting
                  ? "bg-gray-800 text-gray-500 cursor-wait"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? "Verificando..." : "Autenticar"}
            </button>
          </form>
        </div>
      </div>

      {/* Estilos para la animación de la barra de carga */}
      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </main>
  );
}
