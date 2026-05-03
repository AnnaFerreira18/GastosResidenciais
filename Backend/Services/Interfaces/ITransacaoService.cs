using Backend.DTOs;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface ITransacaoService
{
    Task<IEnumerable<Transacao>> ObterTodosAsync();
    Task<Transacao> CriarTransacaoAsync(TransacaoRequestDto dto);
}
