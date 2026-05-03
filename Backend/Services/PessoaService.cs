using Backend.Data;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class PessoaService : IPessoaService
{
    private readonly AppDbContext _context;

    public PessoaService(AppDbContext context)
    {
        _context = context;
    }
    // Listar todas as pessoas
    public async Task<IEnumerable<Pessoa>> ObterTodosAsync()
    {
        return await _context.Pessoas.ToListAsync();
    }
    // Buscar pessoa por id
    public async Task<Pessoa?> ObterPorIdAsync(int id)
    {
        return await _context.Pessoas.FindAsync(id);
    }
    // criar pessoa
    public async Task<Pessoa> CriarAsync(Pessoa pessoa)
    {
        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();
        return pessoa;
    }
    // Atualizar pessoa
    public async Task<Pessoa?> AtualizarAsync(int id, Pessoa pessoaAtualizada)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa == null) return null;

        pessoa.Nome = pessoaAtualizada.Nome;
        pessoa.Idade = pessoaAtualizada.Idade;

        await _context.SaveChangesAsync();
        return pessoa;
    }
    // Deletar pessoa
    public async Task<bool> DeletarAsync(int id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa == null) return false;

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();
        return true;
    }
}
