using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RelatorioController : ControllerBase
{
    private readonly IRelatorioService _relatorioService;

    public RelatorioController(IRelatorioService relatorioService)
    {
        _relatorioService = relatorioService;
    }

    // Listar o total por pessoas
    [HttpGet("totais-por-pessoa")]
    public async Task<IActionResult> TotaisPorPessoa()
    {
        return Ok(await _relatorioService.ObterRelatorioTotaisAsync());
    }
    // Listar o total por categoria
    [HttpGet("totais-por-categoria")]
    public async Task<IActionResult> TotaisPorCategoria()
    {
        return Ok(await _relatorioService.ObterRelatorioPorCategoriaAsync());
    }
}
