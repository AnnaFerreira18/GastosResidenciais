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
        //carregar as transações de cada pessoa
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
        // Busca todas as categorias e todas as transações de uma vez
        var categorias = await _context.Categorias.ToListAsync();
        var transacoes = await _context.Transacoes.ToListAsync();

        var categoriasTotais = categorias.Select(c =>
        {
            // Filtra as transações que pertencem a esta categoria específica pelo ID
            var transacoesDaCat = transacoes.Where(t => t.IdCategoria == c.Id).ToList();

            var receitas = transacoesDaCat.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor);
            var despesas = transacoesDaCat.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor);

            return new CategoriaTotalDto
            {
                Descricao = c.Descricao,
                TotalReceitas = receitas,
                TotalDespesas = despesas,
                Saldo = receitas - despesas
            };
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
