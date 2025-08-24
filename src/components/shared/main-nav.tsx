"use client";

import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export function MainNav() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <img src={logo} alt="Agni" className="h-8 w-auto" />
      <span className="font-bold hidden md:inline-block">Agni Store</span>
    </Link>
  );
}