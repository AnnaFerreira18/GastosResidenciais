using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriaController : ControllerBase
{
    private readonly ICategoriaService _categoriaService;

    public CategoriaController(ICategoriaService categoriaService)
    {
        _categoriaService = categoriaService;
    }
    // Listar todas as categorias
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Categoria>>> ObterTodas()
    {
        return Ok(await _categoriaService.ObterTodosAsync());
    }
    // Criar categoria
    [HttpPost]
    public async Task<ActionResult<Categoria>> Criar(Categoria categoria)
    {
        var novaCategoria = await _categoriaService.CriarAsync(categoria);
        return Ok(novaCategoria);
    }
}
