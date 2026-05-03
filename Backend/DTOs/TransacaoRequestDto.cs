using System.ComponentModel.DataAnnotations;
using static Backend.Models.Enums;

namespace Backend.DTOs;

public class TransacaoRequestDto
{
    [Required]
    [MaxLength(400)]
    public string Descricao { get; set; } = string.Empty;

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser um número positivo.")]
    public decimal Valor { get; set; }

    [Required]
    public TipoTransacao Tipo { get; set; }

    [Required]
    public int IdCategoria { get; set; }

    [Required]
    public int IdPessoa { get; set; }
}