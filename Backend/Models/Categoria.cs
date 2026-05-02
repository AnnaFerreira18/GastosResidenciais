using static Backend.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Categoria
{
    public int Id { get; set; }

    [Required]
    [MaxLength(400, ErrorMessage = "A descrição deve ter no máximo 400 caracteres.")]
    public string Descricao { get; set; } = string.Empty;

    [Required]
    public FinalidadeCategoria Finalidade { get; set; }
}
