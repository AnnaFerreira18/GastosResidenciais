using Backend.Data;
using Backend.DTOs;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using static Backend.Models.Enums;

namespace Backend.Services;

public class RelatorioService: IRelatorioService
{
    private readonly AppDbContext _context;

    public RelatorioService(AppDbContext context)
    {
        _context = context;
    }
    // Totais por pessoa
    public async Task<RelatorioGeralDto> ObterRelatorioTotaisAsync()
    {
        // Include para carregar as transações de cada pessoa
        var pessoasComTransacoes = await _context.Pessoas
            .Include(p => p.Transacoes)
            .ToListAsync();

        // SUM no banco
        var pessoasTotais = pessoasComTransacoes
            .Select(p => new PessoaTotalDto
            {
                Nome = p.Nome,
                TotalReceitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
                TotalDespesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
                Saldo = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor) -
                        p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
            }).ToList();

        // Calcula o total geral somando os resultados das pessoas
        var relatorio = new RelatorioGeralDto
        {
            Pessoas = pessoasTotais,
            TotalGeralReceitas = pessoasTotais.Sum(p => p.TotalReceitas),
            TotalGeralDespesas = pessoasTotais.Sum(p => p.TotalDespesas),
            SaldoGeralLiquido = pessoasTotais.Sum(p => p.Saldo)
        };

        return relatorio;
    }

    // Totais por Categoria
    public async Task<RelatorioCategoriaDto> ObterRelatorioPorCategoriaAsync()
    {
        var categoriasComTransacoes = await _context.Categorias
        .Include(c => c.Transacoes) 
        .ToListAsync();

        var categoriasTotais = categoriasComTransacoes
            .Select(c => new CategoriaTotalDto
            {
                Descricao = c.Descricao,
                TotalReceitas = c.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
                TotalDespesas = c.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
                Saldo = c.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor) -
                        c.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
            }).ToList();

        return new RelatorioCategoriaDto
        {
            Categorias = categoriasTotais,
            TotalGeralReceitas = categoriasTotais.Sum(c => c.TotalReceitas),
            TotalGeralDespesas = categoriasTotais.Sum(c => c.TotalDespesas),
            SaldoGeralLiquido = categoriasTotais.Sum(c => c.Saldo)
        };
    }
}
