using Backend.DTOs;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacaoController : ControllerBase
{
    private readonly ITransacaoService _transacaoService;

    public TransacaoController(ITransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }
    // Listar todas as transações
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transacao>>> ObterTodas()
    {
        return Ok(await _transacaoService.ObterTodosAsync());
    }
    // Criar uma transação
    [HttpPost]
    public async Task<ActionResult<Transacao>> Criar(TransacaoRequestDto dto)
    {
        try
        {
            var transacao = await _transacaoService.CriarTransacaoAsync(dto);
            return Ok(transacao);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { erro = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { erro = ex.Message });
        }
    }
}