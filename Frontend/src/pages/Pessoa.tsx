import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import type { Pessoa } from "../types";

export default function Pessoas() {
  // Estados do form
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [idEdicao, setIdEdicao] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState<number | "">("");

  // Estados para UX e Feedback
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  // Estado para o Modal de Deletar
  const [confirmarDelete, setConfirmarDelete] = useState<{
    aberto: boolean;
    id: number | null;
  }>({
    aberto: false,
    id: null,
  });

  const exibirMensagem = (texto: string, tipo: "sucesso" | "erro") => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 4000);
  };

  const fecharFormulario = () => {
    setIdEdicao(null);
    setNome("");
    setIdade("");
    setMostrarForm(false);
  };

  // Chamadas á api
  const carregarPessoas = useCallback(async () => {
    setCarregando(true);
    try {
      const response = await api.get<Pessoa[]>("/Pessoa");
      setPessoas(response.data);
    } catch {
      exibirMensagem("Não foi possível carregar a lista.", "erro");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    carregarPessoas();
  }, [carregarPessoas]);

  const salvarPessoa = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    const payload = { nome, idade: Number(idade) };

    try {
      if (idEdicao) {
        await api.put(`/Pessoa/${idEdicao}`, { id: idEdicao, ...payload });
        exibirMensagem("Cadastro atualizado com sucesso!", "sucesso");
      } else {
        await api.post("/Pessoa", payload);
        exibirMensagem("Cadastro realizado com sucesso!", "sucesso");
      }
      fecharFormulario();
      carregarPessoas();
    } catch {
      exibirMensagem("Erro ao salvar dados. Verifique o servidor.", "erro");
    } finally {
      setCarregando(false);
    }
  };

  const deletarPessoa = async () => {
    if (confirmarDelete.id) {
      try {
        await api.delete(`/Pessoa/${confirmarDelete.id}`);
        exibirMensagem("Cadastro removido.", "sucesso");
        carregarPessoas();
      } catch {
        exibirMensagem("Erro ao tentar excluir.", "erro");
      } finally {
        setConfirmarDelete({ aberto: false, id: null });
      }
    }
  };

  const prepararEdicao = (pessoa: Pessoa) => {
    setIdEdicao(pessoa.id!);
    setNome(pessoa.nome);
    setIdade(pessoa.idade);
    setMostrarForm(true);
  };

  const handleIdadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valorDigitado = e.target.value;

    if (valorDigitado.length > 3) {
      valorDigitado = valorDigitado.slice(0, 3);
    }

    setIdade(valorDigitado === "" ? "" : Number(valorDigitado));
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
          <h2 style={{ color: "#333", margin: 0 }}>Gestão de Pessoas</h2>
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
              + Adicionar Pessoa
            </button>
          )}
        </header>

        {/* Mensagens */}
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

        {/* Formulário */}
        {mostrarForm ? (
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#555" }}>
              {idEdicao ? "📝 Editar Cadastro" : "Novo Cadastro"}
            </h3>
            <form onSubmit={salvarPessoa}>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "bold",
                    color: "#666",
                  }}
                >
                  Nome Completo
                </label>
                <input
                  type="text"
                  maxLength={200}
                  value={nome}
                  required
                  onChange={(e) => setNome(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                  placeholder="Ex: Maria Oliveira"
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
                  Idade
                </label>
                <input
                  type="number"
                  min="0"
                  max="150"
                  value={idade}
                  required
                  onChange={handleIdadeChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                />
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
                  {carregando ? "Processando..." : "Salvar Dados"}
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
                    Nome
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    Idade
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      textAlign: "right",
                      color: "#666",
                    }}
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {carregando && pessoas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{ textAlign: "center", padding: "30px" }}
                    >
                    Carregando...
                    </td>
                  </tr>
                ) : pessoas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "#999",
                      }}
                    >
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                ) : (
                  pessoas.map((pessoa) => (
                    <tr
                      key={pessoa.id}
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <td style={{ padding: "15px", fontWeight: 500 }}>
                        {pessoa.nome}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        {pessoa.idade} anos
                      </td>
                      <td style={{ padding: "15px", textAlign: "right" }}>
                        <button
                          onClick={() => prepararEdicao(pessoa)}
                          style={{
                            marginRight: "8px",
                            padding: "6px 12px",
                            border: "1px solid #ffc107",
                            borderRadius: "4px",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            color: "#856404",
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() =>
                            setConfirmarDelete({ aberto: true, id: pessoa.id! })
                          }
                          style={{
                            padding: "6px 12px",
                            border: "1px solid #dc3545",
                            borderRadius: "4px",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            color: "#dc3545",
                          }}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de confirmação */}
        {confirmarDelete.aberto && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              backdropFilter: "blur(2px)",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "12px",
                maxWidth: "400px",
                width: "90%",
                textAlign: "center",
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "15px" }}>⚠️</div>
              <h3 style={{ marginTop: 0, color: "#333" }}>
                Confirmar Exclusão?
              </h3>
              <p style={{ color: "#666", lineHeight: "1.6" }}>
                Esta ação é irreversível. Todas as{" "}
                <strong>transações financeiras</strong> desta pessoa também
                serão removidas.
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "25px" }}>
                <button
                  onClick={deletarPessoa}
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Sim, Excluir
                </button>
                <button
                  onClick={() =>
                    setConfirmarDelete({ aberto: false, id: null })
                  }
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: "#e9ecef",
                    color: "#495057",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
