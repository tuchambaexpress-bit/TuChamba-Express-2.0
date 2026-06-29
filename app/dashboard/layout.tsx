"use client";

import React from "react";
import { Briefcase, Users, LayoutDashboard } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 text-black">
      {/* Barra Lateral */}
      <aside className="w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">TuChamba Express</h1>
        </div>

        <nav className="mt-6">
          <div className="flex items-center px-6 py-3 text-gray-700 bg-gray-200 cursor-pointer">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </div>
          <div className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer">
            <Briefcase className="w-5 h-5 mr-3" />
            Mis Vacantes
          </div>
          <div className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer">
            <Users className="w-5 h-5 mr-3" />
            Candidatos
          </div>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}