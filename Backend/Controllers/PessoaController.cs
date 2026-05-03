using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PessoaController : ControllerBase
{
    private readonly IPessoaService _pessoaService;

    public PessoaController(IPessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    // Listar pessoas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pessoa>>> ObterTodas()
    {
        var pessoas = await _pessoaService.ObterTodosAsync();
        return Ok(pessoas);
    }
    // Buscar pessoa por id
    [HttpGet("{id}")]
    public async Task<ActionResult<Pessoa>> ObterPorId(int id)
    {
        var pessoa = await _pessoaService.ObterPorIdAsync(id);
        if (pessoa == null) return NotFound("Pessoa não encontrada.");
        return Ok(pessoa);
    }
    // Criar pessoa
    [HttpPost]
    public async Task<ActionResult<Pessoa>> Criar(Pessoa pessoa)
    {
        var novaPessoa = await _pessoaService.CriarAsync(pessoa);
        return CreatedAtAction(nameof(ObterPorId), new { id = novaPessoa.Id }, novaPessoa);
    }
    // Atualizar pessoa
    [HttpPut("{id}")]
    public async Task<IActionResult> Atualizar(int id, Pessoa pessoa)
    {
        var atualizada = await _pessoaService.AtualizarAsync(id, pessoa);
        if (atualizada == null) return NotFound("Pessoa não encontrada.");
        return NoContent();
    }
    // Deletar pessoa por id
    [HttpDelete("{id}")]
    public async Task<IActionResult> Deletar(int id)
    {
        var sucesso = await _pessoaService.DeletarAsync(id);
        if (!sucesso) return NotFound("Pessoa não encontrada.");
        return NoContent();
    }
}