using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IPessoaService
{
    Task<IEnumerable<Pessoa>> ObterTodosAsync();
    Task<Pessoa?> ObterPorIdAsync(int id);
    Task<Pessoa> CriarAsync(Pessoa pesssoa);
    Task<Pessoa?> AtualizarAsync(int id, Pessoa pessoaAtualizada);
    Task<bool> DeletarAsync(int id);
}
