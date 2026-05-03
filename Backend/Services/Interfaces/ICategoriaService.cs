using Backend.Models;

namespace Backend.Services.Interfaces;

public interface ICategoriaService
{
    Task<IEnumerable<Categoria>> ObterTodosAsync();
    Task<Categoria> CriarAsync(Categoria categoria);
}
