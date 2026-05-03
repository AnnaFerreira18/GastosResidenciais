import { useEffect, useState, useCallback, useMemo } from "react";
import api from "../services/api";
import type { Transacao, Pessoa, Categoria } from "../types";
import { TipoTransacao, FinalidadeCategoria } from "../types";
import axios from "axios";

export default function Transacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [tipo, setTipo] = useState<number>(TipoTransacao.Despesa);
  const [idPessoa, setIdPessoa] = useState<string>("");
  const [idCategoria, setIdCategoria] = useState<string>("");

  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  const exibirMensagem = (texto: string, tipo: "sucesso" | "erro") => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 5000);
  };

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    try {
      const [resTransacoes, resPessoas, resCategorias] = await Promise.all([
        api.get<Transacao[]>("/Transacao"),
        api.get<Pessoa[]>("/Pessoa"),
        api.get<Categoria[]>("/Categoria"),
      ]);
      setTransacoes(resTransacoes.data);
      setPessoas(resPessoas.data);
      setCategorias(resCategorias.data);
    } catch {
      exibirMensagem("Erro ao sincronizar dados com o servidor.", "erro");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    carregarDados();
  }, [carregarDados]);

  //Verificar se a pessoa selecionada é menor de idade
  const pessoaSelecionada = useMemo(
    () => pessoas.find((p) => p.id === Number(idPessoa)),
    [idPessoa, pessoas],
  );

  const ehMenorIdade = pessoaSelecionada ? pessoaSelecionada.idade < 18 : false;

  //Filtrar categorias conforme a finalidade permitida
  const categoriasFiltradas = useMemo(() => {
    return categorias.filter((c) => {
      if (tipo === TipoTransacao.Receita) {
        return (
          c.finalidade === FinalidadeCategoria.Receita ||
          c.finalidade === FinalidadeCategoria.Ambas
        );
      } else {
        return (
          c.finalidade === FinalidadeCategoria.Despesa ||
          c.finalidade === FinalidadeCategoria.Ambas
        );
      }
    });
  }, [tipo, categorias]);

  const salvarTransacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || valor === "" || !idPessoa || !idCategoria) {
      exibirMensagem("Preencha todos os campos obrigatórios.", "erro");
      return;
    }

    setCarregando(true);
    try {
      const payload = {
        descricao,
        valor: Number(valor),
        tipo,
        idPessoa: Number(idPessoa),
        idCategoria: Number(idCategoria),
      };

      await api.post("/Transacao", payload);
      exibirMensagem("Transação realizada com sucesso!", "sucesso");
      fecharFormulario();
      carregarDados();
    } catch (error: unknown) {
      let msg = "Erro ao processar transação.";
      if (axios.isAxiosError(error) && error.response) {
        msg = error.response.data?.erro || error.response.data?.mensagem || msg;
      }
      exibirMensagem(msg, "erro");
    } finally {
      setCarregando(false);
    }
  };

  const fecharFormulario = () => {
    setDescricao("");
    setValor("");
    setTipo(TipoTransacao.Despesa);
    setIdPessoa("");
    setIdCategoria("");
    setMostrarForm(false);
  };

  const formatarMoeda = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
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
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ color: "#333", margin: 0 }}>💸 Lançamento Financeiro</h2>
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
              + Novo Lançamento
            </button>
          )}
        </header>

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
            }}
          >
            {mensagem.texto}
          </div>
        )}

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
              Registrar Movimentação
            </h3>
            <form onSubmit={salvarTransacao}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "15px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    Pessoa
                  </label>
                  <select
                    value={idPessoa}
                    onChange={(e) => {
                      const novoId = e.target.value;
                      setIdPessoa(novoId);

                      // Se a nova pessoa for de menor, já troca o tipo aqui
                      const pessoa = pessoas.find(
                        (p) => p.id === Number(novoId),
                      );
                      if (pessoa && pessoa.idade < 18) {
                        setTipo(TipoTransacao.Despesa);
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                    required
                  >
                    <option value="">Quem está registrando?</option>
                    {pessoas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} ({p.idade} anos)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    Tipo de Lançamento
                  </label>
                  <select
                    value={tipo}
                    onChange={(e) => {
                      const novoTipo = Number(e.target.value);
                      setTipo(novoTipo);

                      // Ao mudar o tipo, verificamos se a categoria atual ainda é válida
                      const novasCategorias = categorias.filter((c) => {
                        if (novoTipo === TipoTransacao.Receita) {
                          return (
                            c.finalidade === FinalidadeCategoria.Receita ||
                            c.finalidade === FinalidadeCategoria.Ambas
                          );
                        } else {
                          return (
                            c.finalidade === FinalidadeCategoria.Despesa ||
                            c.finalidade === FinalidadeCategoria.Ambas
                          );
                        }
                      });

                      const categoriaAindaValida = novasCategorias.some(
                        (c) => c.id === Number(idCategoria),
                      );

                      if (!categoriaAindaValida) {
                        setIdCategoria("");
                      }
                    }}
                    disabled={ehMenorIdade}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      backgroundColor: ehMenorIdade ? "#f0f0f0" : "white",
                    }}
                  >
                    <option value={TipoTransacao.Despesa}>🔴 Despesa</option>
                    <option value={TipoTransacao.Receita}>🟢 Receita</option>
                  </select>
                  {ehMenorIdade && (
                    <small style={{ color: "#dc3545" }}>
                      Menores de 18 anos só podem lançar Despesas.
                    </small>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Categoria
                </label>
                <select
                  value={idCategoria}
                  onChange={(e) => setIdCategoria(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                  required
                >
                  <option value="">Selecione a categoria...</option>
                  {categoriasFiltradas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.descricao}
                    </option>
                  ))}
                </select>
                <small style={{ color: "#888" }}>
                  Apenas categorias compatíveis com "
                  {tipo === 1 ? "Receita" : "Despesa"}" são exibidas.
                </small>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Descrição
                </label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                  placeholder="Ex: Compra de supermercado"
                  required
                />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Valor do Lançamento
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={valor}
                  onChange={(e) =>
                    setValor(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                  placeholder="0,00"
                  required
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
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {carregando ? "Gravando..." : "Confirmar Lançamento"}
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
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              overflow: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "600px",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderBottom: "2px solid #eee",
                  }}
                >
                  <th style={{ padding: "15px", textAlign: "left" }}>Pessoa</th>
                  <th style={{ padding: "15px", textAlign: "left" }}>
                    Descrição / Categoria
                  </th>
                  <th style={{ padding: "15px", textAlign: "center" }}>Tipo</th>
                  <th style={{ padding: "15px", textAlign: "right" }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "#999",
                      }}
                    >
                      Nenhum lançamento registrado.
                    </td>
                  </tr>
                ) : (
                  transacoes.map((t) => (
                    <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "15px" }}>
                        <div style={{ fontWeight: "bold" }}>
                          {pessoas.find((p) => p.id === t.idPessoa)?.nome ||
                            "Pessoa Excluída"}
                        </div>
                      </td>
                      <td style={{ padding: "15px" }}>
                        <div>{t.descricao}</div>
                        <small
                          style={{
                            backgroundColor: "#eee",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "11px",
                          }}
                        >
                          {categorias.find((c) => c.id === t.idCategoria)
                            ?.descricao || "Sem Categoria"}
                        </small>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <span
                          style={{
                            color: t.tipo === 1 ? "#28a745" : "#dc3545",
                            backgroundColor:
                              t.tipo === 1 ? "#d4edda" : "#f8d7da",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {t.tipo === 1 ? "↑ RECEITA" : "↓ DESPESA"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "15px",
                          textAlign: "right",
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        {formatarMoeda(t.valor)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
