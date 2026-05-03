import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import type { Categoria } from "../types";
import { FinalidadeCategoria } from "../types";

export default function Categorias() {
  // Estados do form
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState<number>(
    FinalidadeCategoria.Despesa,
  );

  // Estados de UX e Feedback
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  const exibirMensagem = (texto: string, tipo: "sucesso" | "erro") => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 4000);
  };

  const fecharFormulario = () => {
    setDescricao("");
    setFinalidade(FinalidadeCategoria.Despesa);
    setMostrarForm(false);
  };

  const carregarCategorias = useCallback(async () => {
    setCarregando(true);
    try {
      const response = await api.get<Categoria[]>("/Categoria");
      setCategorias(response.data);
    } catch {
      exibirMensagem("Erro ao buscar categorias.", "erro");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    carregarCategorias();
  }, [carregarCategorias]);

  const salvarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descricao.trim()) {
      exibirMensagem("A descrição é obrigatória.", "erro");
      return;
    }

    setCarregando(true);
    try {
      await api.post("/Categoria", { descricao, finalidade });
      exibirMensagem("Categoria salva com sucesso!", "sucesso");
      fecharFormulario();
      carregarCategorias();
    } catch {
      exibirMensagem("Erro ao salvar categoria.", "erro");
    } finally {
      setCarregando(false);
    }
  };

  const traduzirFinalidade = (valor: number) => {
    switch (valor) {
      case FinalidadeCategoria.Despesa:
        return { label: "Despesa", cor: "#dc3545", icon: "🔴" };
      case FinalidadeCategoria.Receita:
        return { label: "Receita", cor: "#28a745", icon: "🟢" };
      case FinalidadeCategoria.Ambas:
        return { label: "Ambas", cor: "#007bff", icon: "🔵" };
      default:
        return { label: "Desconhecida", cor: "#666", icon: "⚪" };
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        backgroundColor: "#f4f7f6",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Cabeçalho */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ color: "#333", margin: 0 }}>📂 Categorias de Gastos</h2>
          {!mostrarForm && (
            <button
              onClick={() => setMostrarForm(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              + Nova Categoria
            </button>
          )}
        </header>

        {/* Mensagem */}
        {mensagem && (
          <div
            style={{
              padding: "12px",
              borderRadius: "5px",
              marginBottom: "20px",
              backgroundColor:
                mensagem.tipo === "sucesso" ? "#d4edda" : "#f8d7da",
              color: mensagem.tipo === "sucesso" ? "#155724" : "#721c24",
              border: `1px solid ${mensagem.tipo === "sucesso" ? "#c3e6cb" : "#f5c6cb"}`,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {mensagem.tipo === "sucesso" ? "✅" : "❌"} {mensagem.texto}
          </div>
        )}

        {mostrarForm ? (
          /* Formulário */
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#555" }}>Nova Categoria</h3>
            <form onSubmit={salvarCategoria}>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "bold",
                    color: "#666",
                  }}
                >
                  Descrição da Categoria
                </label>
                <input
                  type="text"
                  maxLength={400}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                  placeholder="Ex: Alimentação, Salário, Lazer..."
                  required
                />
              </div>
              <div style={{ marginBottom: "25px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "bold",
                    color: "#666",
                  }}
                >
                  Finalidade
                </label>
                <select
                  value={finalidade}
                  onChange={(e) => setFinalidade(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    backgroundColor: "white",
                  }}
                >
                  <option value={FinalidadeCategoria.Despesa}>
                    Despesa (🔴)
                  </option>
                  <option value={FinalidadeCategoria.Receita}>
                    Receita (🟢)
                  </option>
                  <option value={FinalidadeCategoria.Ambas}>Ambas (🔵)</option>
                </select>
                <small
                  style={{ color: "#888", display: "block", marginTop: "5px" }}
                >
                  Isso define onde esta categoria poderá ser usada.
                </small>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  disabled={carregando}
                  style={{
                    flex: 2,
                    padding: "12px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: carregando ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {carregando ? "Gravando..." : "Salvar Categoria"}
                </button>
                <button
                  type="button"
                  onClick={fecharFormulario}
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Tabela */
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              overflow: "auto",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderBottom: "2px solid #eee",
                  }}
                >
                  <th
                    style={{
                      padding: "15px",
                      textAlign: "left",
                      color: "#666",
                    }}
                  >
                    Descrição
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    Finalidade
                  </th>
                </tr>
              </thead>
              <tbody>
                {carregando && categorias.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      style={{ textAlign: "center", padding: "30px" }}
                    >
                      Carregando categorias...
                    </td>
                  </tr>
                ) : categorias.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "#999",
                      }}
                    >
                      Nenhuma categoria encontrada.
                    </td>
                  </tr>
                ) : (
                  categorias.map((cat) => {
                    const info = traduzirFinalidade(cat.finalidade);
                    return (
                      <tr
                        key={cat.id}
                        style={{ borderBottom: "1px solid #eee" }}
                      >
                        <td style={{ padding: "15px", fontWeight: 500 }}>
                          {cat.descricao}
                        </td>
                        <td style={{ padding: "15px", textAlign: "center" }}>
                          <span
                            style={{
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "14px",
                              backgroundColor: `${info.cor}15`,
                              color: info.cor,
                              border: `1px solid ${info.cor}30`,
                              fontWeight: "bold",
                            }}
                          >
                            {info.icon} {info.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
