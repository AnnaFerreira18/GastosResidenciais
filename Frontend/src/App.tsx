// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Pessoas from "./pages/Pessoa"; 
import Categorias from "./pages/Categorias";
import Transacoes from "./pages/Transacoes";
import Relatorios from "./pages/Relatorios";

// rotas
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/pessoas" replace />} />
          
          <Route path="pessoas" element={<Pessoas />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="transacoes" element={<Transacoes />} />
          <Route path="relatorios" element={<Relatorios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}