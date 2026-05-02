using static Backend.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Transacao
{
    public int Id { get; set; }

    [Required]
    [MaxLength(400, ErrorMessage = "A descrição deve ter no máximo 400 caracteres.")]
    public string Descricao { get; set; } = string.Empty;

    [Required]
    public decimal Valor { get; set; }

    [Required]
    public TipoTransacao Tipo { get; set; }

    // Chaves Estrangeiras
    public int IdCategoria { get; set; }
    public Categoria Categoria { get; set; } = null!;

    public int IdPessoa { get; set; }
    public Pessoa Pessoa { get; set; } = null!;
}
