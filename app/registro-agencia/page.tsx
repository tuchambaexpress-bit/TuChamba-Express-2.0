"use client";

import React, { useState } from "react";
import { supabase } from "../../lib/supabase";// Importamos el puente que creamos
import { Building2, Mail, FileText, Send } from "lucide-react";

export default function RegistroAgencia() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const datos = {
      nombre: formData.get("nombre") as string,
      rfc: formData.get("rfc") as string,
      // Nota: El email se usará después para crear la cuenta de usuario
    };

    // "Cómo": Insertamos en la tabla 'agencias' que creamos en el SQL
    const { error } = await supabase.from("agencias").insert([datos]);

    if (error) {
      setMensaje("Error: " + error.message);
    } else {
      setMensaje("¡Agencia registrada con éxito! Espera validación.");
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-black">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center">
          <Building2 className="mr-2" /> Registro de Agencia
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre Legal</label>
            <input name="nombre" type="text" required className="w-full p-2 border rounded-md" placeholder="Nombre de la empresa" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">RFC</label>
            <input name="rfc" type="text" required className="w-full p-2 border rounded-md" placeholder="RFC de 12 o 13 dígitos" />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-md font-bold hover:bg-blue-700 flex items-center justify-center"
          >
            {loading ? "Procesando..." : <><Send className="mr-2 w-4 h-4" /> Registrar Empresa</>}
          </button>
        </form>

        {mensaje && <p className="mt-4 text-center text-sm font-semibold text-blue-500">{mensaje}</p>}
      </div>
    </div>
  );
}