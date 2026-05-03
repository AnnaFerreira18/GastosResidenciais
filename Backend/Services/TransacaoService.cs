using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using static Backend.Models.Enums;

namespace Backend.Services;

public class TransacaoService : ITransacaoService
{
    private readonly AppDbContext _context;

    public TransacaoService(AppDbContext context)
    {
        _context = context;
    }

    // Listagem
    public async Task<IEnumerable<Transacao>> ObterTodosAsync()
    {
        return await _context.Transacoes
            .Include(t => t.Pessoa)   
            .Include(t => t.Categoria) 
            .ToListAsync();
    }

    // Criar transação
    public async Task<Transacao> CriarTransacaoAsync(TransacaoRequestDto dto)
    {
        //Busca os dados no banco
        var pessoa = await _context.Pessoas.FindAsync(dto.IdPessoa);
        var categoria = await _context.Categorias.FindAsync(dto.IdCategoria);

        if (pessoa == null) throw new ArgumentException("Pessoa não encontrada.");
        if (categoria == null) throw new ArgumentException("Categoria não encontrada.");

        // Menores de 18 anos apenas despesas

        if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
        {
            throw new InvalidOperationException("Menores de 18 anos só podem registrar transações do tipo Despesa.");
        }

        //Restringir categoria conforme finalidade
        bool isCategoriaValida =
            (categoria.Finalidade == FinalidadeCategoria.Ambas) ||
            (dto.Tipo == TipoTransacao.Receita && categoria.Finalidade == FinalidadeCategoria.Receita) ||
            (dto.Tipo == TipoTransacao.Despesa && categoria.Finalidade == FinalidadeCategoria.Despesa);

        if (!isCategoriaValida)
        {
            throw new InvalidOperationException("A categoria escolhida não permite este tipo de transação.");
        }

        //cria a transação
        var transacao = new Transacao
        {
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            IdCategoria = dto.IdCategoria,
            IdPessoa = dto.IdPessoa
        };

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        return transacao;
    }
}
