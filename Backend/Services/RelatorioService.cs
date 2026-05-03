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
        // SUM no banco
        var pessoasTotais = await _context.Pessoas
            .Select(p => new PessoaTotalDto
            {
                Nome = p.Nome,
                TotalReceitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
                TotalDespesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
                Saldo = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor) -
                        p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
            }).ToListAsync();

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
        var categoriasTotais = await _context.Categorias
            .Select(c => new CategoriaTotalDto
            {
                Descricao = c.Descricao,
                TotalReceitas = _context.Transacoes.Where(t => t.IdCategoria == c.Id && t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
                TotalDespesas = _context.Transacoes.Where(t => t.IdCategoria == c.Id && t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
                Saldo = _context.Transacoes.Where(t => t.IdCategoria == c.Id && t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor) -
                        _context.Transacoes.Where(t => t.IdCategoria == c.Id && t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
            }).ToListAsync();

        return new RelatorioCategoriaDto
        {
            Categorias = categoriasTotais,
            TotalGeralReceitas = categoriasTotais.Sum(c => c.TotalReceitas),
            TotalGeralDespesas = categoriasTotais.Sum(c => c.TotalDespesas),
            SaldoGeralLiquido = categoriasTotais.Sum(c => c.Saldo)
        };
    }
}
