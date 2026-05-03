import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import type { RelatorioGeral, RelatorioCategoria } from "../types";

export default function Relatorios() {
  const [relPessoas, setRelPessoas] = useState<RelatorioGeral | null>(null);
  const [relCategorias, setRelCategorias] = useState<RelatorioCategoria | null>(
    null,
  );
  const [carregando, setCarregando] = useState(true);

  const carregarRelatorios = useCallback(async () => {
    setCarregando(true);
    try {
      const [resPessoas, resCat] = await Promise.all([
        api.get<RelatorioGeral>("/Relatorio/totais-por-pessoa"),
        api.get<RelatorioCategoria>("/Relatorio/totais-por-categoria"),
      ]);
      setRelPessoas(resPessoas.data);
      setRelCategorias(resCat.data);
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    carregarRelatorios();
  }, [carregarRelatorios]);

  const formatarMoeda = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  const CorSaldo = (valor: number) => (valor >= 0 ? "#28a745" : "#dc3545");

  if (carregando) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "50px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "10px" }}>📊</div>
          <p>Processando dados financeiros...</p>
        </div>
      </div>
    );
  }

return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <header style={{ marginBottom: "30px", textAlign: "center" }}>
          <h2 style={{ color: "#333", fontSize: "28px" }}>Painel de Resultados 📈</h2>
          <p style={{ color: "#666" }}>Resumo de receitas, despesas e saldos líquidos.</p>
        </header>

        {/* Relatorio por pessoa */}
        <section style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", marginBottom: "40px" }}>
          <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px", color: "#444" }}>Totais por Pessoa</h3>
          
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px", minWidth: "600px" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#888", fontSize: "14px" }}>
                  <th style={{ padding: "12px" }}>NOME</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>RECEITAS</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>DESPESAS</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>SALDO</th>
                </tr>
              </thead>
              <tbody>
                {relPessoas?.pessoas?.map((p, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #f9f9f9" }}>
                    <td style={{ padding: "12px", fontWeight: "bold" }}>{p.nome}</td>
                    <td style={{ padding: "12px", textAlign: "right", color: "#28a745" }}>{formatarMoeda(p.totalReceitas)}</td>
                    <td style={{ padding: "12px", textAlign: "right", color: "#dc3545" }}>{formatarMoeda(p.totalDespesas)}</td>
                    <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold", color: CorSaldo(p.saldo) }}>{formatarMoeda(p.saldo)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
                  <td style={{ padding: "15px", borderRadius: "0 0 0 8px" }}>RESUMO TOTAL</td>
                  <td style={{ padding: "15px", textAlign: "right", color: "#28a745" }}>{formatarMoeda(relPessoas?.totalGeralReceitas || 0)}</td>
                  <td style={{ padding: "15px", textAlign: "right", color: "#dc3545" }}>{formatarMoeda(relPessoas?.totalGeralDespesas || 0)}</td>
                  <td style={{ padding: "15px", textAlign: "right", fontWeight: "bold", fontSize: "1.1em", color: CorSaldo(relPessoas?.saldoGeralLiquido || 0), backgroundColor: "#f8f9fa", borderRadius: "0 0 8px 0" }}>
                    {formatarMoeda(relPessoas?.saldoGeralLiquido || 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Relatorio por categoria */}
        <section style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px", color: "#444" }}>Totais por Categoria</h3>
          
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px", minWidth: "600px" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#888", fontSize: "14px" }}>
                  <th style={{ padding: "12px" }}>CATEGORIA</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>RECEITAS</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>DESPESAS</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>SALDO</th>
                </tr>
              </thead>
              <tbody>
                {relCategorias?.categorias?.map((c, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #f9f9f9" }}>
                    <td style={{ padding: "12px", fontWeight: "bold" }}>{c.descricao}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>{formatarMoeda(c.totalReceitas)}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>{formatarMoeda(c.totalDespesas)}</td>
                    <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold", color: CorSaldo(c.saldo) }}>{formatarMoeda(c.saldo)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
                  <td style={{ padding: "15px" }}>TOTAL DO SISTEMA</td>
                  <td style={{ padding: "15px", textAlign: "right" }}>{formatarMoeda(relCategorias?.totalGeralReceitas || 0)}</td>
                  <td style={{ padding: "15px", textAlign: "right" }}>{formatarMoeda(relCategorias?.totalGeralDespesas || 0)}</td>
                  <td style={{ padding: "15px", textAlign: "right", color: CorSaldo(relCategorias?.saldoGeralLiquido || 0) }}>{formatarMoeda(relCategorias?.saldoGeralLiquido || 0)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
