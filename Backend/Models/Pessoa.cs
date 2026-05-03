using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models;

public class Pessoa
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200, ErrorMessage = "O nome deve ter no máximo 200 caracteres.")]
    public string Nome { get; set; } = string.Empty;

    [Required]
    public int Idade { get; set; }

    // Propriedade de navegação do EF Core
    [JsonIgnore]
    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}
